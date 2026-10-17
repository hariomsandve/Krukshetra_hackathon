import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Send,
  X,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { ChatAttachment } from '../../services/historyService';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (prompt: string, attachment: ChatAttachment) => void;
}

const QUICK_PROMPTS = [
  'B+ Tree Indexing in Database Engine',
  'Microservices Event-Driven Mesh Architecture',
  'Transformer Self-Attention Matrix Mechanism',
  'Docker Container vs Virtual Machine Isolation',
  'Monaco Editor Telemetry Pipeline Architecture'
];

export function ImageStudioModal({ isOpen, onClose, onInsertImage }: ImageStudioModalProps) {
  const [prompt, setPrompt] = useState(QUICK_PROMPTS[0]);
  const [style, setStyle] = useState<'diagram' | 'blueprint' | 'flowchart' | 'isometric'>('diagram');
  const [aspect, setAspect] = useState<'1:1' | '16:9' | '4:3'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    setTimeout(() => {
      // Create high-resolution SVG canvas based on prompt and style
      const canvas = document.createElement('canvas');
      const width = aspect === '16:9' ? 1280 : aspect === '4:3' ? 1024 : 800;
      const height = aspect === '16:9' ? 720 : aspect === '4:3' ? 768 : 800;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Theme background
        if (style === 'blueprint') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = '#1e3a8a';
        } else if (style === 'diagram') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = '#e2e8f0';
        } else {
          ctx.fillStyle = '#faf9f6';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = '#e5e4de';
        }

        // Technical Grid
        ctx.lineWidth = 1;
        const step = 40;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Header Title
        ctx.fillStyle = style === 'blueprint' ? '#93c5fd' : '#18181b';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`MentOS Technical Visualizer • ${prompt}`, 48, 60);

        ctx.font = '13px monospace';
        ctx.fillStyle = style === 'blueprint' ? '#60a5fa' : '#71717a';
        ctx.fillText(`STYLE: ${style.toUpperCase()} | RATIO: ${aspect} | GENERATED: ${new Date().toLocaleTimeString()}`, 48, 88);

        // Architectural Nodes
        const nodes = [
          { label: 'Client / Monaco Telemetry', x: width * 0.18, y: height * 0.45, w: 220, h: 80, color: '#0284c7' },
          { label: 'API Gateway & Auth', x: width * 0.5, y: height * 0.3, w: 200, h: 70, color: '#4f46e5' },
          { label: 'Docker Sandboxed Engine', x: width * 0.5, y: height * 0.65, w: 230, h: 75, color: '#059669' },
          { label: 'Gemini Multimodal Live', x: width * 0.82, y: height * 0.45, w: 220, h: 80, color: '#d97706' }
        ];

        // Connector lines
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = style === 'blueprint' ? '#38bdf8' : '#71717a';
        ctx.setLineDash([6, 6]);

        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.stroke();

        ctx.setLineDash([]);

        // Render Nodes
        nodes.forEach((node) => {
          ctx.save();
          ctx.fillStyle = style === 'blueprint' ? '#1e293b' : '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;
          ctx.beginPath();
          ctx.roundRect(node.x - node.w / 2, node.y - node.h / 2, node.w, node.h, 12);
          ctx.fill();
          ctx.restore();

          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(node.x - node.w / 2, node.y - node.h / 2, node.w, node.h, 12);
          ctx.stroke();

          // Node pill indicator
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x - node.w / 2 + 18, node.y - node.h / 2 + 18, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = style === 'blueprint' ? '#f8fafc' : '#18181b';
          ctx.font = 'bold 13px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + 4);
        });

        // Watermark tag
        ctx.fillStyle = style === 'blueprint' ? '#475569' : '#a1a1aa';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText('MentOS Generative Architectural Visualizer', width - 40, height - 24);

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        setGeneratedImageUrl(dataUrl);
        setIsGenerating(false);
      }
    }, 900);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `MentOS_Visual_${prompt.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleInsert = () => {
    if (!generatedImageUrl) return;
    const attachment: ChatAttachment = {
      id: 'img_' + Date.now(),
      name: `${prompt.replace(/\s+/g, '_')}.png`,
      type: 'image/png',
      url: generatedImageUrl,
      size: Math.round((generatedImageUrl.length * 3) / 4)
    };
    onInsertImage(`Generated visual diagram for: ${prompt}`, attachment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedcd5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ecebe7] bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1f1f1f]">Image Studio — Visualise & Edit</div>
              <div className="text-[11px] text-[#71717a]">Generate engineering architecture, diagrams & concepts</div>
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
          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800">Concept Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Describe the architectural diagram or concept to visualize..."
              className="w-full p-2.5 rounded-xl border border-[#dedcd5] bg-[#faf9f6] text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 leading-relaxed resize-none"
            />
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => setPrompt(qp)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f4f3ee] hover:bg-[#eceae4] text-neutral-700 border border-[#dedcd5] whitespace-nowrap cursor-pointer transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Config Controls: Style & Aspect */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Visual Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-[#dedcd5] bg-white text-xs text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="diagram">Technical Diagram (Light)</option>
                <option value="blueprint">Engineering Blueprint (Dark)</option>
                <option value="flowchart">Modular Flowchart</option>
                <option value="isometric">Isometric View</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Aspect Ratio</label>
              <div className="flex items-center gap-1 bg-[#f4f3ee] p-0.5 rounded-lg border border-[#dedcd5]">
                {(['16:9', '4:3', '1:1'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspect(r)}
                    className={`flex-1 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      aspect === r ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview / Canvas Area */}
          <div className="border border-[#dedcd5] rounded-xl bg-[#faf9f6] p-2 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-10">
                <RefreshCw className="w-6 h-6 text-neutral-800 animate-spin" />
                <span className="text-xs font-semibold text-neutral-600">
                  Synthesizing architectural diagram & nodes...
                </span>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt="Generated Visual"
                className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-[#ecebe7] shadow-xs"
              />
            ) : (
              <div className="text-center py-8 text-neutral-400 text-xs">
                Click "Generate Visual Diagram" to render an architectural model
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf9f5] border-t border-[#ecebe7] flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Rendering...' : 'Generate Visual Diagram'}</span>
          </button>

          {generatedImageUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white hover:bg-[#f2f0ea] text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={handleInsert}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Insert into Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
