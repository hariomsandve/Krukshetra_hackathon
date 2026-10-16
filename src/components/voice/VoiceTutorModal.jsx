import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  SlidersHorizontal,
  BookmarkPlus,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { VoiceIndicator } from './VoiceIndicator';
import { VoiceClient } from '../../services/voiceSocket';
import './VoiceTutor.css';

const VOICES = [
  { id: 'Puck', label: 'Puck (Natural & Engaging)' },
  { id: 'Aoede', label: 'Aoede (Warm & Expressive)' },
  { id: 'Charon', label: 'Charon (Deep & Academic)' },
  { id: 'Fenrir', label: 'Fenrir (Fast & Confident)' },
  { id: 'Kore', label: 'Kore (Calm & Patient)' }
];

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hinglish', label: 'Hinglish (Hindi + English)' },
  { id: 'Hindi', label: 'Hindi (हिंदी)' }
];

export function VoiceTutorModal({
  isOpen,
  onClose,
  selectedCourse,
  selectedConcept,
  onNotify
}) {
  const [voiceClient, setVoiceClient] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected, listening, thinking, speaking, error
  const [volume, setVolume] = useState({ level: 0, source: 'none' });
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Reference to current VoiceClient instance to prevent stale closure references
  const voiceClientRef = useRef(null);

  // Transcript entries: { id, role: 'user' | 'model', text: string, time: string }
  const [transcripts, setTranscripts] = useState([]);
  const transcriptEndRef = useRef(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  // Session duration timer
  useEffect(() => {
    let timer;
    if (connectionState === 'listening' || connectionState === 'speaking' || connectionState === 'thinking') {
      timer = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [connectionState]);

  // Format mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Connect or disconnect when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  const startSession = (voice = selectedVoice, lang = selectedLanguage) => {
    if (voiceClientRef.current) {
      voiceClientRef.current.disconnect();
      voiceClientRef.current = null;
    }

    setErrorMessage('');

    const client = new VoiceClient({
      voice,
      language: lang,
      onStateChange: (state) => {
        setConnectionState(state);
      },
      onVolume: (vol) => {
        setVolume(vol);
      },
      onTranscript: ({ role, text }) => {
        setTranscripts((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].role === role) {
            const last = prev[prev.length - 1];
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: `${last.text} ${text}`.trim()
            };
            return updated;
          }
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              role,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        });
      },
      onError: (err) => {
        setErrorMessage(err);
      }
    });

    voiceClientRef.current = client;
    setVoiceClient(client);
    client.connect();

    // Initial context injection
    if (selectedCourse || selectedConcept) {
      setTimeout(() => {
        if (voiceClientRef.current === client) {
          client.sendContext({
            course: selectedCourse?.title || 'Computer Science',
            concept: selectedConcept?.title || 'General Engineering',
            details: selectedConcept?.description || ''
          });
        }
      }, 1200);
    }

    return client;
  };

  const stopSession = () => {
    if (voiceClientRef.current) {
      voiceClientRef.current.disconnect();
      voiceClientRef.current = null;
    }
    setVoiceClient(null);
    setConnectionState('disconnected');
    setVolume({ level: 0, source: 'none' });
  };

  const handleToggleMute = () => {
    if (voiceClientRef.current) {
      const muted = voiceClientRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleInterrupt = () => {
    if (voiceClientRef.current) {
      voiceClientRef.current.stopPlayback();
      setConnectionState('listening');
    }
  };

  const handleQuickPrompt = (promptText) => {
    let client = voiceClientRef.current;
    if (!client || connectionState === 'disconnected' || connectionState === 'error') {
      client = startSession();
    }
    setTranscripts((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: promptText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (client) {
      client.sendText(promptText);
    }
  };

  const handleVoiceChange = (e) => {
    const newVoice = e.target.value;
    setSelectedVoice(newVoice);
    if (connectionState !== 'disconnected') {
      startSession(newVoice, selectedLanguage);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    handleQuickPrompt(`Please speak in ${newLang} from now on.`);
  };

  const handleSaveSession = async () => {
    try {
      const summaryText = transcripts
        .map((t) => `${t.role === 'user' ? 'Student' : 'AdaptIQ'}: ${t.text}`)
        .join('\n');

      const res = await fetch('http://localhost:8000/api/v1/voice/sessions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: `session_${Date.now()}`,
          course_id: selectedCourse?.id || null,
          concept_id: selectedConcept?.id || null,
          duration_seconds: sessionDuration,
          transcript_summary: summaryText || 'Voice tutoring session.'
        })
      });
      if (res.ok) {
        setIsSaved(true);
        if (onNotify) onNotify('Session takeaways saved to your learning progress!');
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  };

  const handleCopyTranscript = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-backdrop" onClick={onClose}>
      <div
        className="voice-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="AdaptIQ Voice Tutor"
      >
        {/* 1. HEADER */}
        <div className="voice-modal-header">
          <div className="voice-header-left">
            <div className="voice-icon-badge">
              <Mic size={16} />
            </div>
            <div className="voice-title-group">
              <div className="voice-title-row">
                <span className="voice-title">AdaptIQ Voice Tutor</span>
                <span className="voice-status-pill">
                  <span className={`voice-status-dot ${connectionState}`} />
                  <span>
                    {connectionState === 'speaking'
                      ? 'Speaking'
                      : connectionState === 'listening'
                      ? 'Listening'
                      : connectionState === 'thinking'
                      ? 'Thinking'
                      : connectionState === 'connected'
                      ? 'Live'
                      : connectionState === 'connecting'
                      ? 'Connecting'
                      : connectionState === 'reconnecting'
                      ? 'Reconnecting...'
                      : connectionState === 'error'
                      ? 'Error'
                      : 'Offline'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="voice-header-actions">
            {/* Preferences Toggle */}
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className={`btn btn-ghost ${showPreferences ? 'active' : ''}`}
              style={{ padding: '5px 8px', fontSize: '0.75rem' }}
              title="Voice & Language Settings"
              aria-label="Settings"
            >
              <SlidersHorizontal size={14} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '5px 8px' }}
              title="Close Voice Tutor"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. ERROR BANNER (IF ANY) */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              background: 'rgba(244, 63, 94, 0.12)',
              borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
              fontSize: '0.75rem',
              color: '#fb7185'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => startSession()}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: '0.6875rem' }}
            >
              <RefreshCw size={11} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 3. OPTIONAL PREFERENCES ROW */}
        {showPreferences && (
          <div className="voice-preferences-row">
            <div className="voice-pref-group">
              <span className="voice-pref-label">Language:</span>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="voice-custom-select"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="voice-pref-group">
              <span className="voice-pref-label">Voice:</span>
              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="voice-custom-select"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 4. ACTIVE TOPIC CONTEXT STRIP */}
        <div className="voice-context-bar">
          <div className="voice-context-topic">
            <span>Topic:</span>
            <span className="voice-topic-tag" title={selectedCourse?.title || 'Data Structures & Algorithms'}>
              {selectedCourse?.title || 'Data Structures & Algorithms'}
            </span>
            {selectedConcept && (
              <>
                <span style={{ color: 'var(--text-disabled)' }}>/</span>
                <span style={{ color: '#67e8f9', fontWeight: 500 }} title={selectedConcept.title}>
                  {selectedConcept.title}
                </span>
              </>
            )}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {formatTime(sessionDuration)}
          </span>
        </div>

        {/* 5. SUBTLE ANIMATED VOICE INDICATOR */}
        <VoiceIndicator
          state={connectionState}
          volume={volume}
          isMuted={isMuted}
        />

        {/* 6. CONTEXTUAL ACTION CHIPS */}
        <div className="voice-action-chips">
          <button
            onClick={() =>
              handleQuickPrompt(
                `Explain ${selectedConcept?.title || 'the current concept'} simply with an everyday analogy.`
              )
            }
            className="voice-chip"
          >
            <Sparkles size={11} style={{ color: '#818cf8' }} />
            <span>Explain concept</span>
          </button>

          <button
            onClick={() =>
              handleQuickPrompt(
                'Help me understand this problem step-by-step with guiding questions, without giving the final answer.'
              )
            }
            className="voice-chip"
          >
            <HelpCircle size={11} style={{ color: '#38bdf8' }} />
            <span>Help with question</span>
          </button>

          <button
            onClick={() =>
              handleQuickPrompt(
                'Summarize my current mastery progress in this course and recommend the best next step.'
              )
            }
            className="voice-chip"
          >
            <BookmarkPlus size={11} style={{ color: '#34d399' }} />
            <span>Summarize progress</span>
          </button>

          <button
            onClick={() =>
              handleQuickPrompt(
                'Bhaiya, is concept ko Hinglish me samjhaiye with an intuitive example.'
              )
            }
            className="voice-chip"
          >
            <span>🇮🇳</span>
            <span>Explain in Hinglish</span>
          </button>
        </div>

        {/* 7. CONVERSATION TRANSCRIPT AREA */}
        {showTranscript && (
          <div className="voice-transcript-wrapper">
            {transcripts.length === 0 ? (
              <div className="voice-empty-state">
                <Mic size={24} className="voice-empty-icon" />
                <div className="voice-empty-title">Ready when you are</div>
                <div className="voice-empty-desc">
                  Speak naturally to the tutor or select an action above. Barge-in is enabled so you can interrupt anytime.
                </div>
              </div>
            ) : (
              transcripts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`voice-message-item ${item.role === 'user' ? 'user' : 'model'}`}
                >
                  <div className={`voice-message-header ${item.role === 'user' ? 'user' : 'model'}`}>
                    <span>{item.role === 'user' ? 'You' : 'AdaptIQ'}</span>
                    <span className="voice-message-time">{item.time}</span>
                  </div>
                  <div className={`voice-message-bubble ${item.role === 'user' ? 'user' : 'model'}`}>
                    {item.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}

        {/* 8. BOTTOM CONTROLS TOOLBAR */}
        <div className="voice-modal-footer">
          <div className="voice-footer-left">
            {/* Prominent Microphone ON / OFF Toggle */}
            <button
              onClick={handleToggleMute}
              className={`voice-mic-toggle-btn ${isMuted ? 'mic-off' : 'mic-on'}`}
              title={isMuted ? 'Microphone off — tap to speak' : 'Listening — speak now'}
              aria-label={isMuted ? 'Turn Microphone On' : 'Turn Microphone Off'}
              aria-pressed={!isMuted}
            >
              {isMuted ? (
                <>
                  <MicOff size={16} />
                  <span>Mic Off</span>
                  <span className="voice-mic-indicator-dot off" />
                </>
              ) : (
                <>
                  <Mic size={16} />
                  <span>Mic On</span>
                  <span className="voice-mic-indicator-dot on" />
                </>
              )}
            </button>

            {/* Quick Interrupt (only active when tutor is speaking) */}
            <button
              onClick={handleInterrupt}
              disabled={connectionState !== 'speaking'}
              className="voice-ctrl-btn"
              title="Interrupt tutor speech immediately"
            >
              <VolumeX size={14} />
              <span>Interrupt</span>
            </button>
          </div>

          <div className="voice-footer-right">
            {/* Transcript Toggle */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`voice-ctrl-btn ${showTranscript ? 'active' : ''}`}
              title={showTranscript ? 'Hide conversation transcript' : 'Show conversation transcript'}
            >
              <MessageSquare size={14} />
              <span>{showTranscript ? 'Hide Text' : 'Show Text'}</span>
            </button>

            {/* Save Session */}
            <button
              onClick={handleSaveSession}
              disabled={transcripts.length === 0}
              className={`voice-ctrl-btn ${isSaved ? 'active' : ''}`}
              title="Save session takeaways to progress"
            >
              {isSaved ? <CheckCircle2 size={14} style={{ color: '#34d399' }} /> : <BookmarkPlus size={14} />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* End Call Button */}
            <button
              onClick={() => {
                stopSession();
                onClose();
              }}
              className="voice-ctrl-btn danger"
              title="End voice conversation"
            >
              <PhoneOff size={14} />
              <span>End</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
