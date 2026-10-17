/**
 * VoiceSocket Service
 * Manages persistent multi-turn WebSocket connection to AdaptIQ Gemini Live Multimodal streaming backend.
 * Handles continuous bidirectional 16kHz PCM mic streaming, 24kHz gapless PCM playback,
 * voice activity detection, barge-in interruption, and bounded exponential reconnect logic.
 */

import { getStoredRole } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

function floatTo16BitPCM(input) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output;
}

function downsampleBuffer(buffer, sampleRate, outSampleRate = 16000) {
  if (outSampleRate === sampleRate) {
    return buffer;
  }
  const sampleRateRatio = sampleRate / outSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function base64EncodeAudio(int16Array) {
  let binary = '';
  const bytes = new Uint8Array(int16Array.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function decodePcm24kToAudioBuffer(audioCtx, base64Data) {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / (int16[i] < 0 ? 32768 : 32767);
  }
  const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
  audioBuffer.copyToChannel(float32, 0);
  return audioBuffer;
}

export class VoiceClient {
  constructor(options = {}) {
    this.voice = options.voice || 'Puck';
    this.language = options.language || 'English';
    this.onStateChange = options.onStateChange || (() => {});
    this.onTranscript = options.onTranscript || (() => {});
    this.onError = options.onError || (() => {});
    this.onVolume = options.onVolume || (() => {});

    this.ws = null;
    this.audioCtx = null;
    this.playbackCtx = null;
    this.micStream = null;
    this.micProcessor = null;
    this.micSource = null;
    this.micAnalyser = null;
    this.speakerAnalyser = null;
    this.nextPlayTime = 0;
    this.activeNodes = [];
    this.isMuted = false;
    this.isConnected = false;
    this.isExplicitEnd = false;
    this.isFatalError = false;
    this.volumeInterval = null;

    // Bounded reconnect configuration
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectTimer = null;
  }

  getWebSocketUrl() {
    const role = getStoredRole() || 'student';
    const token = `dev-${role}`;
    let wsHost = '127.0.0.1:8000';
    let wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    if (API_BASE_URL.startsWith('http')) {
      try {
        const u = new URL(API_BASE_URL);
        wsProto = u.protocol === 'https:' ? 'wss:' : 'ws:';
        wsHost = u.host;
      } catch (e) {
        console.warn('URL parse fallback:', e);
      }
    }

    return `${wsProto}//${wsHost}/api/v1/voice/ws?token=${encodeURIComponent(token)}&voice=${encodeURIComponent(this.voice)}&language=${encodeURIComponent(this.language)}`;
  }

  async connect() {
    this.isExplicitEnd = false;
    this.isFatalError = false;
    this.onStateChange('connecting');

    try {
      // 1. Initialize Microphone AudioContext if needed
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Initialize 24kHz Playback AudioContext
      if (!this.playbackCtx || this.playbackCtx.state === 'closed') {
        this.playbackCtx = new AudioCtxClass({ sampleRate: 24000 });
      }
      if (this.playbackCtx.state === 'suspended') {
        await this.playbackCtx.resume();
      }

      if (!this.speakerAnalyser) {
        this.speakerAnalyser = this.playbackCtx.createAnalyser();
        this.speakerAnalyser.fftSize = 256;
        this.speakerAnalyser.connect(this.playbackCtx.destination);
      }

      // 2. Request microphone stream if not already active
      if (!this.micStream || !this.micStream.active) {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            latency: 0
          }
        });

        this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);
        this.micAnalyser = this.audioCtx.createAnalyser();
        this.micAnalyser.fftSize = 256;
        this.micSource.connect(this.micAnalyser);

        // Low-latency streaming buffer: 2048 frames (~42ms)
        const bufferSize = 2048;
        this.micProcessor = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);
        this.micSource.connect(this.micProcessor);
        this.micProcessor.connect(this.audioCtx.destination);

        const actualSampleRate = this.audioCtx.sampleRate;

        this.micProcessor.onaudioprocess = (e) => {
          // Keep continuous streaming alive across multiple turns
          if (!this.isConnected || this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return;
          }

          const inputChannelData = e.inputBuffer.getChannelData(0);
          const downsampled = downsampleBuffer(inputChannelData, actualSampleRate, 16000);
          const pcm16 = floatTo16BitPCM(downsampled);

          // Direct binary PCM 16kHz audio streaming: zero JSON/base64 serialization overhead
          this.ws.send(pcm16.buffer);
        };
      }

      // Start volume level polling loop
      if (!this.volumeInterval) {
        this.startVolumeMeter();
      }

      // 3. Open WebSocket to backend
      const wsUrl = this.getWebSocketUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onStateChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.error('Voice WebSocket error:', err);
        if (!this.isFatalError) {
          this.onError('Voice connection experienced a network issue.');
        }
      };

      this.ws.onclose = (event) => {
        this.isConnected = false;
        console.warn(`Voice WebSocket closed (code=${event.code}, reason='${event.reason || ''}')`);

        // If user explicitly pressed End or fatal error (e.g. quota/auth), do not reconnect
        if (this.isExplicitEnd || this.isFatalError) {
          this.onStateChange('disconnected');
          return;
        }

        // Bounded exponential reconnect for transient network hiccups
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(4000, 1000 * Math.pow(2, this.reconnectAttempts - 1));
          console.log(`Scheduling voice reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
          this.onStateChange('reconnecting');
          this.reconnectTimer = setTimeout(() => {
            if (!this.isExplicitEnd && !this.isFatalError) {
              this.connect();
            }
          }, delay);
        } else {
          this.onStateChange('disconnected');
          this.onError('Connection closed. Click Retry or restart the voice tutor.');
        }
      };

    } catch (err) {
      console.error('Failed to initialize VoiceClient:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.isFatalError = true;
        this.onError('Microphone access was denied. Please allow microphone permissions in your browser to speak with the voice tutor.');
      } else {
        this.onError(`Voice initialization error: ${err.message || 'Check microphone & backend status.'}`);
      }
      this.onStateChange('error');
    }
  }

  handleServerMessage(msg) {
    switch (msg.type) {
      case 'status':
        if (msg.state === 'connected') {
          this.onStateChange('listening');
        } else if (msg.state === 'reconnecting') {
          this.onStateChange('reconnecting');
        }
        break;

      case 'interrupted':
        // Student barged in! Immediate gapless flush of tutor audio
        this.stopPlayback();
        this.onStateChange('listening');
        break;

      case 'audio':
        this.onStateChange('speaking');
        this.playAudioChunk(msg.data);
        break;

      case 'transcript':
        this.onTranscript({
          role: msg.role || 'model',
          text: msg.text || ''
        });
        break;

      case 'turn_complete':
        // Turn completed: Transition back to listening for the next student utterance!
        // The session and microphone remain fully active!
        this.onStateChange('listening');
        break;

      case 'error':
        if (msg.fatal) {
          this.isFatalError = true;
        }
        this.onError(msg.message || 'Voice tutor encountered an error.', msg.code);
        if (msg.fatal) {
          this.onStateChange('error');
        }
        break;

      default:
        break;
    }
  }

  playAudioChunk(base64Data) {
    if (!this.playbackCtx) return;

    try {
      const audioBuffer = decodePcm24kToAudioBuffer(this.playbackCtx, base64Data);
      const sourceNode = this.playbackCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.speakerAnalyser);

      const currentTime = this.playbackCtx.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime + 0.01; // Instant 10ms safety lookahead buffer
      }

      sourceNode.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;
      this.activeNodes.push(sourceNode);

      sourceNode.onended = () => {
        const idx = this.activeNodes.indexOf(sourceNode);
        if (idx !== -1) {
          this.activeNodes.splice(idx, 1);
        }
      };
    } catch (e) {
      console.error('Audio chunk playback failure:', e);
    }
  }

  stopPlayback() {
    for (const node of this.activeNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    }
    this.activeNodes = [];
    if (this.playbackCtx) {
      this.nextPlayTime = this.playbackCtx.currentTime;
    }
  }

  startVolumeMeter() {
    const dataArray = new Uint8Array(128);
    this.volumeInterval = setInterval(() => {
      let level = 0;
      let activeSource = 'none';

      // If tutor speaking, measure speaker output
      if (this.activeNodes.length > 0 && this.speakerAnalyser) {
        this.speakerAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        level = sum / (dataArray.length * 255);
        activeSource = 'speaker';
      } else if (!this.isMuted && this.micAnalyser) {
        this.micAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        level = sum / (dataArray.length * 255);
        activeSource = 'mic';
      }

      this.onVolume({ level, source: activeSource });
    }, 50);
  }

  sendText(text) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.onStateChange('thinking');
      this.ws.send(JSON.stringify({
        type: 'text',
        text
      }));
    }
  }

  sendContext({ course, concept, details }) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'context',
        course,
        concept,
        details
      }));
    }
  }

  setMicActive(active) {
    this.isMuted = !active;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((track) => {
        track.enabled = active;
      });
    }
    return !this.isMuted;
  }

  toggleMute() {
    return this.setMicActive(this.isMuted);
  }

  disconnect() {
    this.isExplicitEnd = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }

    this.stopPlayback();

    // Send explicit end signal to backend
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'end' }));
      } catch (e) {}
    }

    if (this.micProcessor) {
      this.micProcessor.disconnect();
      this.micProcessor = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.ws) {
      try {
        this.ws.close(1000, "User ended session");
      } catch (e) {}
      this.ws = null;
    }

    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }

    if (this.playbackCtx) {
      try {
        this.playbackCtx.close();
      } catch (e) {}
      this.playbackCtx = null;
    }

    this.isConnected = false;
    this.onStateChange('disconnected');
  }
}
