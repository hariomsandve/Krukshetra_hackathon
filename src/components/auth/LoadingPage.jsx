import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const LoadingPage = ({ onComplete, message = "Initializing Mentos AI Portal..." }) => {
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Establishing secure session & role authorization...",
    "Calibrating adaptive cognitive dependency graphs...",
    "Syncing with Google Gemini Multimodal Live engine...",
    "Synthesizing personalized student knowledge frontiers...",
    "Portal ready. Launching workspace..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return 100;
        }
        // Accelerate smoothly
        const increment = Math.max(2, Math.floor((100 - prev) / 6));
        return Math.min(100, prev + increment);
      });
    }, 120);

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < statusMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(168, 85, 247, 0.16), transparent 55%),
          radial-gradient(circle at 20% 70%, rgba(99, 102, 241, 0.1), transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.08), transparent 45%),
          #090d16
        `,
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Ambient background particles/glow effect */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'mentosOrbPulse 4s infinite ease-in-out'
        }}
      />

      {/* Main card */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '460px',
          width: '90%',
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(16, 22, 38, 0.72)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.18)',
          textAlign: 'center'
        }}
      >
        {/* Animated Emblem Orb */}
        <div
          style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Outer rotating ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px dashed rgba(168, 85, 247, 0.45)',
              animation: 'mentosSpinSlow 10s linear infinite'
            }}
          />

          {/* Glowing central core */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 32px rgba(168, 85, 247, 0.65), inset 0 0 16px rgba(255, 255, 255, 0.35)',
              transform: 'rotate(-4deg)'
            }}
          >
            <Sparkles size={34} color="#ffffff" />
          </div>
        </div>

        {/* Brand Titles */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 30%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px'
          }}
        >
          Mentos AI
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.28)',
            color: '#c4b5fd',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#a855f7',
              boxShadow: '0 0 8px #a855f7'
            }}
          />
          Adaptive Learning & Assessment Portal
        </div>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}
          >
            <span>System Telemetry</span>
            <span style={{ fontWeight: 600, color: '#c4b5fd' }}>{progress}%</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '7px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1px'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #06b6d4 100%)',
                boxShadow: '0 0 14px rgba(168, 85, 247, 0.7)',
                transition: 'width 0.15s ease-out'
              }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div
          style={{
            minHeight: '22px',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            animation: 'mentosFadeIn 0.3s ease'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#06b6d4',
              boxShadow: '0 0 6px #06b6d4'
            }}
          />
          <span>{statusMessages[statusIndex]}</span>
        </div>

        {/* Bottom Capabilities Tags */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <Zap size={12} color="#a855f7" />
            <span>Gemini Live Multimodal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <Cpu size={12} color="#6366f1" />
            <span>Concept Graph DAG</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={12} color="#10b981" />
            <span>Role RBAC Integrity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
