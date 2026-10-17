import asyncio
import base64
import json
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.config import get_settings
from app.database import mongo_manager

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/voice", tags=["AI Voice Tutor"])

SYSTEM_INSTRUCTION = """
You are AdaptIQ Voice Assistant, an ultra-responsive, real-time AI tutor.
You communicate via low-latency live audio.

SPEED & LATENCY DIRECTIVES:
1. Speak IMMEDIATELY. Begin your spoken answer with zero delay, no fillers, no pleasantries, and no preamble.
2. Be extremely concise: respond in 1 to 2 short, punchy spoken sentences. Do not monologue or give lengthy lectures unless explicitly requested.
3. Rapid Socratic flow: give a direct answer or insight, ask a quick guiding question, and yield immediately.
4. Multilingual: seamlessly converse in English, Hindi, or Hinglish to match the student naturally.
5. Code & Concepts: explain computer science algorithms, system designs, and code logic in clear, simple spoken terms.
"""

class VoiceConfigResponse(BaseModel):
    model: str
    available_voices: List[str]
    supported_languages: List[str]
    default_voice: str
    sample_rate_in: int
    sample_rate_out: int

@router.get("/config", response_model=VoiceConfigResponse)
async def get_voice_config():
    """Returns available voice models, supported voices, and audio specs."""
    settings = get_settings()
    return VoiceConfigResponse(
        model=settings.gemini_voice_model or "gemini-2.5-flash-native-audio-latest",
        available_voices=["Puck", "Aoede", "Charon", "Fenrir", "Kore"],
        supported_languages=["English", "Hindi", "Hinglish"],
        default_voice=settings.gemini_voice_name or "Puck",
        sample_rate_in=16000,
        sample_rate_out=24000
    )

class SessionSummaryPayload(BaseModel):
    session_id: str
    course_id: Optional[str] = None
    concept_id: Optional[str] = None
    duration_seconds: int
    transcript_summary: str

@router.post("/sessions/save")
async def save_voice_session(payload: SessionSummaryPayload):
    """Optionally stores minimal session metadata and learning takeaway in MongoDB with student consent."""
    if mongo_manager.db is not None:
        try:
            await mongo_manager.db["voice_sessions"].insert_one({
                "session_id": payload.session_id,
                "course_id": payload.course_id,
                "concept_id": payload.concept_id,
                "duration_seconds": payload.duration_seconds,
                "summary": payload.transcript_summary,
                "created_at": datetime.utcnow()
            })
            return {"status": "saved", "session_id": payload.session_id}
        except Exception as e:
            logger.warning(f"Failed to persist voice session: {e}")
    return {"status": "skipped", "reason": "database not connected or error"}


@router.websocket("/ws")
async def voice_tutor_websocket(
    websocket: WebSocket,
    token: Optional[str] = None,
    language: Optional[str] = "English",
    voice: Optional[str] = "Puck"
):
    """Bidirectional WebSocket streaming endpoint bridging browser audio to Gemini Multimodal Live API.
    Maintains persistent multi-turn conversations across continuous student-tutor exchanges."""
    await websocket.accept()

    settings = get_settings()
    if not settings.gemini_api_key:
        logger.error("GEMINI_API_KEY is not configured on the server")
        await websocket.send_json({
            "type": "error",
            "code": "API_KEY_MISSING",
            "fatal": True,
            "message": "Gemini Live API key is not configured on the server. Please check backend/.env."
        })
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Authenticate token (dev token or Firebase ID token)
    authenticated_user = None
    if token:
        if settings.environment == "development" and token.startswith("dev-"):
            role_part = token.replace("dev-", "").lower()
            authenticated_user = {"uid": f"dev_user_{role_part}", "role": role_part}
        else:
            try:
                import firebase_admin.auth as fb_auth
                decoded = fb_auth.verify_id_token(token)
                authenticated_user = decoded
            except Exception as e:
                logger.warning(f"WebSocket token authentication warning: {e}")
                if settings.environment == "development":
                    authenticated_user = {"uid": "dev_user_student", "role": "student"}

    if not authenticated_user and settings.environment != "development":
        await websocket.send_json({
            "type": "error",
            "code": "AUTH_REQUIRED",
            "fatal": True,
            "message": "Authentication required for voice tutor session."
        })
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    client = genai.Client(api_key=settings.gemini_api_key)
    voice_name = voice or settings.gemini_voice_name or "Puck"
    model_name = settings.gemini_voice_model or "gemini-2.5-flash-native-audio-latest"

    # Configure Gemini Live session with zero-thinking latency, instant VAD sensitivity, and native audio
    live_config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
            )
        ),
        # 1. Eliminate thinking tokens to eliminate 2-4s response latency
        thinking_config=types.ThinkingConfig(thinking_budget=0),
        # 2. Instant Voice Activity Detection (VAD): high sensitivity on start/end of speech
        realtime_input_config=types.RealtimeInputConfig(
            automatic_activity_detection=types.AutomaticActivityDetection(
                disabled=False,
                start_of_speech_sensitivity=types.StartSensitivity.START_SENSITIVITY_HIGH,
                end_of_speech_sensitivity=types.EndSensitivity.END_SENSITIVITY_HIGH,
                prefix_padding_ms=60,
                silence_duration_ms=300,
            )
        ),
        output_audio_transcription=types.AudioTranscriptionConfig(),
        input_audio_transcription=types.AudioTranscriptionConfig(),
        session_resumption=types.SessionResumptionConfig(),
        system_instruction=types.Content(
            parts=[types.Part.from_text(text=SYSTEM_INSTRUCTION)]
        )
    )

    await websocket.send_json({
        "type": "status",
        "state": "connecting",
        "message": f"Connecting to Gemini Live native-audio ({model_name})..."
    })

    session_active = True
    current_resumption_handle = None

    try:
        async with client.aio.live.connect(model=model_name, config=live_config) as gemini_session:
            logger.info(f"Gemini Live session connected for user={authenticated_user.get('uid') if authenticated_user else 'anon'}")
            await websocket.send_json({
                "type": "status",
                "state": "connected",
                "voice": voice_name,
                "message": "Voice tutor connected and ready."
            })

            # Task 1: Gemini -> Client loop (Multi-Turn persistent receiver)
            async def receive_from_gemini():
                nonlocal current_resumption_handle, session_active
                while session_active:
                    try:
                        # gemini_session.receive() is an async generator for ONE turn.
                        # Wrapping it in while session_active ensures multi-turn persistence!
                        async for response in gemini_session.receive():
                            if not session_active:
                                break

                            # Track session resumption handles if emitted by Gemini Live
                            if hasattr(response, "session_resumption_update") and response.session_resumption_update:
                                current_resumption_handle = response.session_resumption_update.new_handle
                                logger.debug(f"Received session resumption handle: {current_resumption_handle}")

                            # Handle server GoAway notifications
                            if hasattr(response, "go_away") and response.go_away:
                                time_left = getattr(response.go_away, "time_left", "shortly")
                                logger.warning(f"Gemini GoAway notice received: time_left={time_left}")
                                await websocket.send_json({
                                    "type": "status",
                                    "state": "reconnecting",
                                    "message": "Provider scheduled session transition."
                                })

                            sc = response.server_content
                            if sc:
                                # Interruption signal (student barged in)
                                if getattr(sc, "interrupted", False):
                                    await websocket.send_json({"type": "interrupted"})

                                # Spoken transcript from model
                                if getattr(sc, "output_transcription", None) and sc.output_transcription.text:
                                    await websocket.send_json({
                                        "type": "transcript",
                                        "role": "model",
                                        "text": sc.output_transcription.text
                                    })

                                # Spoken transcript from student mic
                                if getattr(sc, "input_transcription", None) and sc.input_transcription.text:
                                    await websocket.send_json({
                                        "type": "transcript",
                                        "role": "user",
                                        "text": sc.input_transcription.text
                                    })

                                # Audio chunks
                                if sc.model_turn:
                                    for part in sc.model_turn.parts:
                                        if part.inline_data and part.inline_data.data:
                                            audio_b64 = base64.b64encode(part.inline_data.data).decode("utf-8")
                                            await websocket.send_json({
                                                "type": "audio",
                                                "data": audio_b64,
                                                "sample_rate": 24000
                                            })

                                # Single turn completion: notify client but KEEP receive loop alive!
                                if getattr(sc, "turn_complete", False):
                                    await websocket.send_json({"type": "turn_complete"})

                            # Voice activity detection signals
                            vad = getattr(response, "voice_activity", None)
                            if vad:
                                await websocket.send_json({
                                    "type": "vad",
                                    "activity": getattr(vad, "activity", "active")
                                })

                    except asyncio.CancelledError:
                        break
                    except Exception as e:
                        if not session_active:
                            break
                        err_str = str(e).lower()
                        logger.error(f"Error in Gemini receive stream: {e}")

                        # Check for quota exhaustion / rate limiting
                        is_quota = "quota" in err_str or "resource_exhausted" in err_str or "429" in err_str
                        is_auth = "auth" in err_str or "permission" in err_str or "403" in err_str or "401" in err_str

                        await websocket.send_json({
                            "type": "error",
                            "code": "QUOTA_EXHAUSTED" if is_quota else "AUTH_FAILED" if is_auth else "STREAM_ERROR",
                            "fatal": is_quota or is_auth,
                            "message": (
                                "Gemini API quota or rate limit exceeded. Please wait a moment."
                                if is_quota else
                                f"Gemini voice stream error: {str(e)}"
                            )
                        })

                        if is_quota or is_auth:
                            session_active = False
                            break
                        # Transient delay before retrying receive
                        await asyncio.sleep(0.2)

            # Task 2: Client -> Gemini loop (Forwarding microphone and text commands)
            async def forward_to_gemini():
                nonlocal session_active
                try:
                    while session_active:
                        msg = await websocket.receive()
                        if msg.get("type") == "websocket.disconnect":
                            logger.info("WebSocket disconnect message received.")
                            session_active = False
                            break

                        if "text" in msg and msg["text"]:
                            data = json.loads(msg["text"])
                            msg_type = data.get("type")

                            if msg_type == "audio" and "data" in data:
                                # Incoming base64 PCM 16kHz from microphone
                                pcm_bytes = base64.b64decode(data["data"])
                                await gemini_session.send_realtime_input(
                                    audio=types.Blob(
                                        data=pcm_bytes,
                                        mime_type="audio/pcm;rate=16000"
                                    )
                                )

                            elif msg_type == "text":
                                # Quick action prompt / question
                                text_content = data.get("text", "")
                                if text_content.strip():
                                    await gemini_session.send_client_content(
                                        turns=[types.Content(parts=[types.Part.from_text(text=text_content)])],
                                        turn_complete=True
                                    )

                            elif msg_type == "context":
                                # Context injection (current course, concept, question)
                                course_title = data.get("course", "Computer Science")
                                concept_title = data.get("concept", "")
                                details = data.get("details", "")
                                ctx_text = f"[Current Student Context: Course '{course_title}', Concept '{concept_title}'. {details} Guide the student Socratically based on this context.]"
                                await gemini_session.send_client_content(
                                    turns=[types.Content(parts=[types.Part.from_text(text=ctx_text)])],
                                    turn_complete=True
                                )

                            elif msg_type == "end":
                                logger.info("Client requested explicit voice session end.")
                                session_active = False
                                break

                        elif "bytes" in msg and msg["bytes"]:
                            # Direct binary PCM 16kHz audio from mic
                            await gemini_session.send_realtime_input(
                                audio=types.Blob(
                                    data=msg["bytes"],
                                    mime_type="audio/pcm;rate=16000"
                                )
                            )

                except WebSocketDisconnect:
                    logger.info("Voice WebSocket disconnected by client.")
                    session_active = False
                except asyncio.CancelledError:
                    pass
                except Exception as e:
                    logger.error(f"Error forwarding to Gemini Live: {e}")
                    session_active = False

            # Spawn both loops
            receive_task = asyncio.create_task(receive_from_gemini())
            forward_task = asyncio.create_task(forward_to_gemini())

            # Wait on the client's forward_task (session lifetime is controlled by the client)
            await forward_task

            # Cleanup session
            session_active = False
            receive_task.cancel()
            await asyncio.gather(receive_task, return_exceptions=True)

    except Exception as e:
        logger.error(f"Gemini Live session failure: {e}")
        try:
            err_str = str(e).lower()
            is_quota = "quota" in err_str or "resource_exhausted" in err_str or "429" in err_str
            await websocket.send_json({
                "type": "error",
                "code": "QUOTA_EXHAUSTED" if is_quota else "SESSION_FAILED",
                "fatal": True,
                "message": (
                    "Gemini API quota or rate limit reached. Please try again shortly."
                    if is_quota else
                    f"Gemini Live connection failed: {str(e)}"
                )
            })
        except Exception:
            pass
    finally:
        session_active = False
        try:
            await websocket.close()
        except Exception:
            pass
