import React, { useEffect, useRef } from 'react';

/**
 * Animated Reactive Voice Orb
 * Reacts to microphone and speaker audio levels, morphing dynamically based on:
 * - listening: calm pulsing cyan/indigo waves
 * - thinking: rotating hypnotic violet/amber glow
 * - speaking: vibrant reactive expanding sound ripples
 * - idle/disconnected: gentle slow ambient breathing
 */
export function VoiceOrb({ state = 'idle', volume = { level: 0, source: 'none' } }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      phase += 0.04;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const audioScale = Math.min(1.0, volume.level * 2.8);
      const isSpeaking = state === 'speaking';
      const isListening = state === 'listening';
      const isThinking = state === 'thinking';

      // Base radius with sound boost
      let baseRadius = 55;
      if (isSpeaking) {
        baseRadius = 55 + audioScale * 35;
      } else if (isListening) {
        baseRadius = 55 + audioScale * 20;
      }

      // 1. Draw outer ambient rings / ripples
      const ringCount = isSpeaking ? 3 : 2;
      for (let i = ringCount; i >= 1; i--) {
        const ringRadius = baseRadius + i * (isSpeaking ? 24 : 14) * (1 + Math.sin(phase + i) * 0.15);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        
        let strokeColor = 'rgba(99, 102, 241, 0.15)'; // Indigo
        if (isSpeaking) {
          strokeColor = `rgba(168, 85, 247, ${0.35 - i * 0.08})`; // Purple
        } else if (isListening && volume.level > 0.05) {
          strokeColor = `rgba(6, 182, 212, ${0.4 - i * 0.1})`; // Cyan
        } else if (isThinking) {
          strokeColor = `rgba(234, 179, 8, ${0.3 - i * 0.08})`; // Amber
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. Draw organic morphing orb
      ctx.save();
      ctx.beginPath();
      const points = 36;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        let distortion = 0;

        if (isSpeaking) {
          distortion = Math.sin(angle * 5 + phase * 2.5) * (audioScale * 14) + Math.cos(angle * 3 - phase) * 8;
        } else if (isListening) {
          distortion = Math.sin(angle * 4 + phase) * (audioScale * 10 + 3);
        } else if (isThinking) {
          distortion = Math.sin(angle * 6 + phase * 3) * 6;
        } else {
          distortion = Math.sin(angle * 3 + phase) * 3;
        }

        const r = baseRadius + distortion;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // 3. Create rich dynamic gradient fill
      const gradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.3,
        centerY - baseRadius * 0.3,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius * 1.3
      );

      if (isSpeaking) {
        gradient.addColorStop(0, '#f472b6'); // Rose pink
        gradient.addColorStop(0.3, '#818cf8'); // Indigo
        gradient.addColorStop(0.7, '#6366f1'); // Deep violet
        gradient.addColorStop(1, '#312e81');
      } else if (isListening) {
        gradient.addColorStop(0, '#67e8f9'); // Cyan light
        gradient.addColorStop(0.3, '#38bdf8'); // Sky
        gradient.addColorStop(0.7, '#4f46e5'); // Indigo
        gradient.addColorStop(1, '#1e1b4b');
      } else if (isThinking) {
        gradient.addColorStop(0, '#fde047'); // Yellow
        gradient.addColorStop(0.4, '#f43f5e'); // Rose
        gradient.addColorStop(0.8, '#7c3aed'); // Violet
        gradient.addColorStop(1, '#1e1b4b');
      } else {
        gradient.addColorStop(0, '#818cf8');
        gradient.addColorStop(0.5, '#4338ca');
        gradient.addColorStop(1, '#0f172a');
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = isSpeaking ? '#818cf8' : (isListening ? '#38bdf8' : '#6366f1');
      ctx.shadowBlur = 24 + audioScale * 20;
      ctx.fill();
      ctx.restore();

      // 4. Subtle inner core highlight
      ctx.beginPath();
      ctx.arc(centerX - baseRadius * 0.28, centerY - baseRadius * 0.28, baseRadius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, volume]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] drop-shadow-2xl transition-transform duration-300"
      />
      <div className="mt-2 flex items-center space-x-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
          state === 'speaking' ? 'bg-indigo-400 animate-ping' :
          state === 'listening' ? 'bg-cyan-400 animate-pulse' :
          state === 'thinking' ? 'bg-amber-400 animate-bounce' :
          state === 'connected' ? 'bg-emerald-400' :
          'bg-slate-500'
        }`} />
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
          {state === 'speaking' ? 'Tutor is Speaking' :
           state === 'listening' ? (volume.level > 0.05 ? 'Listening to You...' : 'Listening') :
           state === 'thinking' ? 'Gemini Thinking...' :
           state === 'connecting' ? 'Establishing Live Audio...' :
           state === 'connected' ? 'Ready' :
           'Disconnected'}
        </span>
      </div>
    </div>
  );
}
