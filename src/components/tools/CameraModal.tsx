import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { ChatAttachment } from '../../services/historyService';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (attachment: ChatAttachment) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Unable to access webcam. Generating snapshot pattern fallback.');
      createFallbackSnapshot();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const createFallbackSnapshot = () => {
    // Generate a fallback snapshot pattern on canvas if camera is blocked/unavailable
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Warm dark gradient
      const grad = ctx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, '#1c1b18');
      grad.addColorStop(1, '#2a2824');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      // Grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Title & Reticle
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MentOS Camera Viewfinder', 320, 220);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Optical Code & Document Capture Simulated', 320, 250);

      // Timestamp
      ctx.fillStyle = '#10b981';
      ctx.font = '12px monospace';
      ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 320, 280);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleConfirm = () => {
    if (!capturedImage) return;
    const attachment: ChatAttachment = {
      id: 'photo_' + Date.now(),
      name: `Camera_Capture_${new Date().toISOString().slice(11, 19).replace(/:/g, '-')}.jpg`,
      type: 'image/jpeg',
      url: capturedImage,
      size: Math.round((capturedImage.length * 3) / 4)
    };
    onCapture(attachment);
    onClose();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-[#121214]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide">MentOS Live Camera</div>
              <div className="text-[10px] text-neutral-400">Capture code, diagrams or documents</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {!capturedImage && (
              <button
                onClick={handleFlipCamera}
                title="Flip Camera"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Viewfinder Overlay Guides */}
              <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </>
          )}

          {cameraError && !capturedImage && (
            <div className="absolute bottom-3 left-3 right-3 bg-red-950/80 border border-red-700/60 p-2 rounded-lg text-[11px] text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Actions */}
        <div className="p-3 bg-[#121214] border-t border-neutral-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Attach to Prompt</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                onClick={handleCapture}
                className="w-14 h-14 rounded-full border-4 border-white/30 bg-white hover:bg-neutral-200 flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Capture Photo"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
