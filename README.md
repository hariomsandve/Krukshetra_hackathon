# AdaptIQ — Adaptive Learning and Assessment Portal 🎓

**Personalized Learning. Adaptive Assessments. Real-Time Gemini Multimodal Voice Tutor.**

AdaptIQ is a full-stack educational platform built with **React + TypeScript + Vite**, **Python FastAPI**, **MongoDB Atlas**, and **Google Gemini Multimodal Live API**. It personalizes the learning experience based on student mastery, concept dependency graphs (DAGs), automated code execution, and real-time bidirectional conversational AI voice tutoring.

---

## 🎙️ Real-Time Gemini Live Conversational Voice Tutor

AdaptIQ features a real-time conversational AI voice tutor powered directly by Google's official **Gemini Multimodal Live API** (`gemini-2.5-flash-native-audio-latest`).

### 🌟 Key Voice Capabilities
- **Native Bidirectional Audio Streaming**: Uses Web Audio API to capture raw 16kHz mono PCM microphone input and stream it directly over WebSocket to FastAPI. Receives high-fidelity 24kHz mono PCM audio chunks from Gemini with gapless playback.
- **Voice Activity Detection & Interruption (Barge-In)**: The student can speak at any time to interrupt the tutor naturally. Gemini Live emits interruption signals (`interrupted = true`), causing the client audio buffer to immediately flush and listen.
- **Multilingual Support (English, Hindi, Hinglish)**: Fluid language understanding and spoken response in English, Hindi, and natural Hinglish.
- **Configurable Native Voices**: Support for official Google Gemini prebuilt voices: `Puck` (Engaging), `Aoede` (Warm), `Charon` (Academic), `Fenrir` (Fast), and `Kore` (Calm).
- **Reactive Animated Voice Orb**: Canvas-driven visualizer with dynamic gradients that morphs and expands in real-time based on audio volume, voice activity, and thinking states.
- **Context-Aware Socratic Guidance**: Carries student course, concept, and question context into the Live session. Offers intuitive analogies and asks guiding questions instead of simply blurting out answers.
- **Dual Spoken Transcription**: Streams live speech-to-text tokens for both student microphone input and tutor responses.
- **Minimal Data Retention**: Stores session takeaways and metadata in MongoDB Atlas only upon explicit student save action (`/api/v1/voice/sessions/save`). Never stores raw audio recordings.

---

## 🏗️ Architecture & Voice Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Browser)
    participant Client as React VoiceClient (Web Audio API)
    participant FastAPI as FastAPI WebSocket (/api/v1/voice/ws)
    participant Gemini as Gemini Live Multimodal API
    participant MongoDB as MongoDB Atlas

    Student->>Client: Clicks "Voice Tutor" / Grants Mic Permission
    Client->>FastAPI: WebSocket Connect (?token=dev-student&voice=Puck)
    FastAPI->>FastAPI: Verify Firebase Token / Role
    FastAPI->>Gemini: AsyncLive.connect(gemini-2.5-flash-native-audio-latest)
    Gemini-->>FastAPI: Session Ready
    FastAPI-->>Client: {"type": "status", "state": "connected"}

    loop Continuous Audio Streaming
        Student->>Client: Speaks into Microphone
        Client->>FastAPI: 16kHz Int16 PCM Audio Chunks
        FastAPI->>Gemini: send_realtime_input(audio/pcm;rate=16000)
        Gemini-->>FastAPI: 24kHz Int16 PCM Audio + Live Transcription Tokens
        FastAPI-->>Client: {"type": "audio", "data": "base64...", "sample_rate": 24000}
        Client->>Student: Gapless 24kHz Audio Playback + Transcript Display
    end

    opt Student Interrupts (Barge-In)
        Student->>Client: Speaks while Tutor is talking
        Gemini-->>FastAPI: server_content.interrupted = true
        FastAPI-->>Client: {"type": "interrupted"}
        Client->>Client: Immediately Stop Audio Playback & Clear Queue
    end

    opt Save Takeaways
        Student->>Client: Clicks "Save Session"
        Client->>FastAPI: POST /api/v1/voice/sessions/save
        FastAPI->>MongoDB: Insert session metadata & summary
    end
```

---

## ⚙️ Environment Variables Configuration

### Backend (`backend/.env`)
```bash
# Server Configuration
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=adaptiq_learning_portal

# Firebase Authentication
FIREBASE_PROJECT_ID=ps-2-adaptive-portal
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase_service_account.json

# Google Gemini Multimodal Live API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_VOICE_MODEL=gemini-2.5-flash-native-audio-latest
GEMINI_VOICE_NAME=Puck
```

> [!SECURITY]
> The `GEMINI_API_KEY` is kept **strictly on the backend server**. It is never exposed in Vite variables, React client code, browser network payloads, or git repositories.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- Google Gemini API Key with Multimodal Live API access

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will run on `http://127.0.0.1:8000`. You can inspect endpoints via Swagger at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# In project root:
npm install
npm run dev
```
Open `http://localhost:5173` in any modern browser (Chrome, Edge, Firefox, Brave).

---

## 🧪 Testing the Voice Tutor

1. Navigate to `http://localhost:5173` in Google Chrome or Microsoft Edge.
2. In the topbar or bottom-right corner, click the **AI Voice Tutor** button.
3. Grant microphone permissions when prompted by your browser.
4. Watch the **Reactive Voice Orb** pulse and transition from connecting to listening.
5. Speak naturally into your microphone (e.g. *"Hello tutor! Can you explain recursion in Hinglish?"*).
6. Listen to the 24kHz spoken response and observe the live transcript stream.
7. Test **barge-in interruption**: speak while the tutor is talking to observe immediate playback interruption and transition back to listening.
8. Click **Save Session** to store the learning takeaways into MongoDB.

---

## 💰 Costs, Quotas & Usage Considerations

1. **Model**: `gemini-2.5-flash-native-audio-latest` is Google's low-latency multimodal native audio model.
2. **Audio Pricing**: Audio tokens are billed based on input audio seconds and output audio seconds.
3. **Session Duration Limits**: Client sessions automatically track duration. It is recommended to keep interactive viva sessions between 5 to 15 minutes to optimize token costs.
4. **VAD (Voice Activity Detection)**: Real-time silence suppression minimizes idle token consumption when the student is listening.
