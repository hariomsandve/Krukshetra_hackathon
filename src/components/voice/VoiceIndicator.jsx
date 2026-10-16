import React from 'react';

/**
 * Subtle Animated Voice Indicator
 * Replaces the large canvas orb with a lightweight, minimalist wave-bar indicator.
 * Animates only when listening or speaking using lightweight CSS transforms.
 */
export function VoiceIndicator({ state = 'disconnected', volume = { level: 0, source: 'none' }, isMuted = false }) {
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';

  // Calculate dynamic scale for bars based on volume level (0 to 1)
  const normLevel = Math.min(1.0, (volume?.level || 0) * 3);

  const getBarStyle = (index) => {
    if (isMuted) {
      return { transform: 'scaleY(0.15)', opacity: 0.3 };
    }

    if (isSpeaking) {
      const variation = Math.sin((index + 1) * 1.5) * 0.3;
      const scale = Math.max(0.2, Math.min(1.0, 0.3 + normLevel * 0.7 + variation));
      return { transform: `scaleY(${scale})` };
    }

    if (isListening) {
      const variation = Math.cos((index + 1) * 1.2) * 0.25;
      const scale = Math.max(0.18, Math.min(0.9, 0.2 + normLevel * 0.65 + variation));
      return { transform: `scaleY(${scale})` };
    }

    if (isThinking) {
      return { animationDelay: `${index * 0.15}s` };
    }

    // Idle
    return { transform: 'scaleY(0.2)', opacity: 0.5 };
  };

  const getStatusText = () => {
    if (isMuted) return 'Microphone off — tap to speak';
    if (state === 'speaking') return 'AdaptIQ is speaking...';
    if (state === 'listening') return 'Listening — speak now';
    if (state === 'thinking') return 'Gemini thinking...';
    if (state === 'connecting') return 'Connecting live session...';
    if (state === 'reconnecting') return 'Reconnecting session...';
    if (state === 'connected') return 'Listening — speak now';
    if (state === 'error') return 'Connection error';
    return 'Voice session offline';
  };

  const barClass = isSpeaking
    ? 'speaking'
    : isListening
    ? 'listening'
    : isThinking
    ? 'thinking'
    : '';

  return (
    <div className="voice-indicator-section">
      <div className="voice-wave-container" aria-label={getStatusText()}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`voice-wave-bar ${barClass}`}
            style={getBarStyle(i)}
          />
        ))}
      </div>
      <div className="voice-indicator-status-text">
        {getStatusText()}
      </div>
    </div>
  );
}
