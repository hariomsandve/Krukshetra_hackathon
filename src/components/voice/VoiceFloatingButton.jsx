import React from 'react';
import { Mic, Sparkles } from 'lucide-react';
import './VoiceTutor.css';

export function VoiceFloatingButton({ onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className="voice-floating-trigger"
      aria-label="Open AdaptIQ Voice Tutor"
      title="Open Conversational AI Voice Tutor (English, Hinglish & Hindi)"
    >
      <div className="voice-floating-icon">
        <Mic size={14} />
      </div>
      <div className="voice-floating-text">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="voice-floating-label">Voice Tutor</span>
          <Sparkles size={11} style={{ color: '#fbbf24' }} />
        </div>
        <span className="voice-floating-sub">Live • Duplex Audio</span>
      </div>
    </button>
  );
}
