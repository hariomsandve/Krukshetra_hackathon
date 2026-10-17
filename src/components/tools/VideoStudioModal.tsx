import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Send,
  X,
  Volume2,
  Sliders,
  Check
} from 'lucide-react';
import { ChatAttachment } from '../../services/historyService';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVideo: (topicPrompt: string, attachment: ChatAttachment) => void;
}

const QUICK_TOPICS = [
  'Monaco Editor Telemetry & Keystroke Replay',
  'Quicksort Partitioning & Recursive Call Tree',
  'Docker Sub-container Isolation Pipeline',
  'WebSocket 16kHz PCM Audio Streaming to Gemini'
];

export function VideoStudioModal({ isOpen, onClose, onInsertVideo }: VideoStudioModalProps) {
  const [topic, setTopic] = useState(QUICK_TOPICS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);
    setProgress(0);

    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setIsPlaying(true);
    }, 1200);
  };

  // Video Canvas Animation Loop
  useEffect(() => {
    if (!hasGenerated || !isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let currentProgress = progress;
    const interval = setInterval(() => {
      currentProgress += 0.8;
      if (currentProgress >= 100) {
        currentProgress = 0;
      }
      setProgress(currentProgress);
      drawFrame(currentProgress);
    }, 50);

    return () => clearInterval(interval);
  }, [hasGenerated, isPlaying, progress, topic]);

  const drawFrame = (pct: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark sleek terminal canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, 40);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(36, 20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(52, 20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`MentOS Concept Walkthrough: ${topic}`, 75, 24);

    // Animated Code Box on Left
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(30, 60, w * 0.55, h - 100, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    const codeLines = [
      '// 1. Telemetry Capture Engine',
      'const telemetry = new MonacoTelemetry();',
      'editor.onDidChangeModelContent((event) => {',
      '  const diff = computeKeystrokeDiff(event);',
      '  telemetry.logEvent({ type: "diff", diff });',
      '});',
      '',
      '// 2. Stream to Assessment Evaluator',
      'await sandbox.executeTests(telemetry.snapshot);'
    ];

    const linesToShow = Math.min(codeLines.length, Math.floor((pct / 100) * (codeLines.length + 2)));
    ctx.font = '12px "JetBrains Mono", monospace';
    for (let i = 0; i < linesToShow; i++) {
      if (codeLines[i].startsWith('//')) ctx.fillStyle = '#64748b';
      else if (codeLines[i].includes('const') || codeLines[i].includes('await')) ctx.fillStyle = '#38bdf8';
      else ctx.fillStyle = '#f8fafc';

      ctx.fillText(codeLines[i], 50, 95 + i * 22);
    }

    // Dynamic Diagram / Execution Visualizer on Right
    const rightX = w * 0.62;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(rightX, 60, w * 0.34, h - 100, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('Execution Trace', rightX + 20, 90);

    // Animated progress bars / gauges
    const stages = [
      { name: 'Keystroke Buffer', val: Math.min(100, pct * 1.5) },
      { name: 'Cadence Telemetry', val: Math.min(100, Math.max(0, (pct - 20) * 1.6)) },
      { name: 'Sandbox Validation', val: Math.min(100, Math.max(0, (pct - 50) * 2)) }
    ];

    stages.forEach((st, idx) => {
      const barY = 125 + idx * 55;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(st.name, rightX + 20, barY);

      // Background bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rightX + 20, barY + 8, 160, 10);

      // Active fill
      ctx.fillStyle = idx === 2 ? '#10b981' : '#38bdf8';
      ctx.fillRect(rightX + 20, barY + 8, (st.val / 100) * 160, 10);
    });

    // Audio waveform simulation at bottom right
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 16; i++) {
      const hBar = Math.sin(pct * 0.3 + i) * 12 + 14;
      ctx.fillRect(rightX + 20 + i * 10, h - 75, 4, hBar);
    }
  };

  const handleInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 0.95);

    const attachment: ChatAttachment = {
      id: 'vid_' + Date.now(),
      name: `${topic.replace(/\s+/g, '_')}_Walkthrough.mp4`,
      type: 'video/mp4',
      url: dataUrl,
      size: 3400000
    };

    onInsertVideo(`Generated animated walkthrough for: ${topic}`, attachment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedcd5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ecebe7] bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1f1f1f]">Video Studio — Bring Ideas to Life</div>
              <div className="text-[11px] text-[#71717a]">Generate animated concept walkthroughs & lectures</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Monaco Editor Telemetry & Keystroke Replay..."
              className="w-full p-2.5 rounded-xl border border-[#dedcd5] bg-[#faf9f6] text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
            />
          </div>

          {/* Quick Topics */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {QUICK_TOPICS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTopic(t)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f4f3ee] hover:bg-[#eceae4] text-neutral-700 border border-[#dedcd5] whitespace-nowrap cursor-pointer transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          {/* Video Player / Canvas */}
          <div className="border border-neutral-800 rounded-xl bg-black overflow-hidden relative aspect-16/9 flex items-center justify-center shadow-lg">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-10 text-white">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xs font-semibold text-neutral-300">
                  Synthesizing animated video demonstration & telemetry script...
                </span>
              </div>
            ) : hasGenerated ? (
              <>
                <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-contain" />

                {/* Video Playback Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-1.5">
                  {/* Progress scrubber */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-white text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 rounded-full hover:bg-white/20 cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setProgress(0)}
                        className="p-1 rounded-full hover:bg-white/20 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[10px] text-neutral-300">
                        {Math.floor((progress / 100) * 45)}s / 45s
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Synthesized Audio Active</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs flex flex-col items-center gap-2">
                <Video className="w-8 h-8 text-neutral-600" />
                <span>Click "Generate Video Lecture" to compile an interactive animation</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf9f5] border-t border-[#ecebe7] flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Rendering Video...' : 'Generate Video Lecture'}</span>
          </button>

          {hasGenerated && (
            <button
              onClick={handleInsert}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Insert Walkthrough into Chat</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
