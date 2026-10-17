import React, { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLParagraphElement>(null);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    const bar = barRef.current;
    const pctEl = pctRef.current;
    if (!stage || !cv || !bar || !pctEl) return;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const TEXT = 'MentOS';
    const FONT_FAMILY = "Montserrat, 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
    const TAU = Math.PI * 2;

    const STOPS: [number, string][] = [
      [0, '#0a5cff'], [0.13, '#1fa2ff'], [0.27, '#00c853'], [0.38, '#7be000'], [0.5, '#ff1f2b'],
      [0.6, '#ffd400'], [0.72, '#ff1f2b'], [0.82, '#00c853'], [0.92, '#ffd400'], [1, '#ffb300']
    ];
    const BLOBS: [number, string][] = [
      [0.07, '#0a5cff'], [0.2, '#1fa2ff'], [0.31, '#00c853'], [0.49, '#ff1f2b'],
      [0.62, '#ffd400'], [0.74, '#ff1f2b'], [0.84, '#00c853'], [0.94, '#ffd400']
    ];

    const rgbCache: Record<string, [number, number, number]> = {};
    function rgba(hex: string, a: number) {
      let c = rgbCache[hex];
      if (!c) {
        const n = parseInt(hex.slice(1), 16);
        c = rgbCache[hex] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      }
      return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    }

    let cssW = 0, cssH = 0, pw = 0, ph = 0, dpr = 1;
    let fs = 100, wordW = 0, asc = 0, desc = 0;
    let left = 0, right = 0, top = 0, bot = 0, baseline = 0;
    let gap = 0, reflH = 0;
    let baseY = 0, amp = 0, tilt = 0;

    interface OffscreenBuffer {
      c: HTMLCanvasElement;
      x: CanvasRenderingContext2D;
    }

    let M: OffscreenBuffer;
    let S: OffscreenBuffer;
    let R: OffscreenBuffer;
    let L: OffscreenBuffer;
    let F: OffscreenBuffer;

    interface Bubble {
      x: number;
      y: number;
      r: number;
      vy: number;
      w: number;
      ph: number;
      still: boolean;
    }

    let bubbles: Bubble[] = [];

    function mk(): OffscreenBuffer {
      const c = document.createElement('canvas');
      c.width = pw;
      c.height = ph;
      const x = c.getContext('2d')!;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { c, x };
    }

    function setFont(x: CanvasRenderingContext2D) {
      x.font = `800 ${fs}px ${FONT_FAMILY}`;
      x.textAlign = 'center';
      x.textBaseline = 'alphabetic';
      x.lineJoin = 'round';
      x.miterLimit = 2;
    }

    function fillWord(x: CanvasRenderingContext2D, dx = 0, dy = 0) {
      setFont(x);
      x.fillText(TEXT, cssW / 2 + dx, baseline + dy);
    }

    function strokeWord(x: CanvasRenderingContext2D) {
      setFont(x);
      x.strokeText(TEXT, cssW / 2, baseline);
    }

    function newBubble(init?: boolean): Bubble {
      const rad = fs * (0.005 + Math.random() * Math.random() * 0.022);
      return {
        x: left + Math.random() * wordW,
        y: init ? top + Math.random() * (bot - top) : bot + rad + Math.random() * fs * 0.1,
        r: rad,
        vy: fs * (0.05 + Math.random() * 0.11),
        w: 0.6 + Math.random() * 1.2,
        ph: Math.random() * TAU,
        still: false
      };
    }

    function initBubbles() {
      bubbles = [];
      const n = Math.round(Math.min(80, Math.max(26, wordW / 16)));
      for (let i = 0; i < n; i++) bubbles.push(newBubble(true));
      for (let i = 0; i < 14; i++) {
        const b = newBubble(true);
        b.still = true;
        b.y = top + (bot - top) * (0.05 + Math.random() * 0.8);
        b.r = fs * (0.004 + Math.random() * 0.01);
        bubbles.push(b);
      }
    }

    function buildStatic() {
      const hgt = bot - top;

      M.x.fillStyle = '#000';
      fillWord(M.x);

      // Ground shadow and glass thickness
      const s = S.x;
      s.clearRect(0, 0, cssW, cssH);
      s.save();
      s.shadowColor = 'rgba(28,78,130,0.26)';
      s.shadowBlur = fs * 0.14 * dpr;
      s.shadowOffsetX = fs * 0.015 * dpr;
      s.shadowOffsetY = fs * 0.07 * dpr;
      s.fillStyle = '#000';
      fillWord(s);
      s.restore();

      const N = Math.max(3, Math.round(fs * 0.03));
      s.fillStyle = 'rgba(150,196,230,0.5)';
      for (let i = N; i >= 1; i--) fillWord(s, i * 0.55, i * 0.85);
      s.globalCompositeOperation = 'destination-out';
      s.fillStyle = '#000';
      fillWord(s);
      s.globalCompositeOperation = 'source-over';

      // Glass rim, highlights, outline
      const r = R.x;
      r.clearRect(0, 0, cssW, cssH);
      r.lineJoin = 'round';
      r.strokeStyle = 'rgba(210,235,255,0.38)';
      r.lineWidth = fs * 0.12;
      strokeWord(r);

      const g = r.createLinearGradient(0, top, 0, bot);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.5, 'rgba(215,236,250,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0.85)');
      r.strokeStyle = g;
      r.lineWidth = fs * 0.05;
      strokeWord(r);

      r.strokeStyle = 'rgba(255,255,255,0.9)';
      r.lineWidth = Math.max(1.2, fs * 0.012);
      strokeWord(r);

      // Big mirror gloss on upper half
      const g3 = r.createLinearGradient(0, top, 0, top + hgt * 0.5);
      g3.addColorStop(0, 'rgba(255,255,255,0.62)');
      g3.addColorStop(0.7, 'rgba(255,255,255,0.12)');
      g3.addColorStop(1, 'rgba(255,255,255,0)');
      r.fillStyle = g3;
      r.fillRect(left - 6, top - 6, wordW + 12, hgt * 0.5 + 6);

      // Soft bottom bounce light
      const g4 = r.createLinearGradient(0, bot - hgt * 0.22, 0, bot);
      g4.addColorStop(0, 'rgba(255,255,255,0)');
      g4.addColorStop(1, 'rgba(255,255,255,0.35)');
      r.fillStyle = g4;
      r.fillRect(left - 6, bot - hgt * 0.22, wordW + 12, hgt * 0.22 + 6);

      r.globalCompositeOperation = 'destination-in';
      r.fillStyle = '#000';
      fillWord(r);
      r.globalCompositeOperation = 'source-over';

      r.strokeStyle = 'rgba(40,96,150,0.7)';
      r.lineWidth = Math.max(1, fs * 0.006);
      strokeWord(r);
    }

    function layout() {
      if (!stage || !cv) return;
      const cw = Math.max(240, stage.clientWidth | 0);
      const frac = cw < 640 ? 0.92 : 0.72;
      const m = document.createElement('canvas').getContext('2d')!;
      m.font = `800 100px ${FONT_FAMILY}`;
      const mt = m.measureText(TEXT);
      const wRatio = mt.width / 100;
      const aRatio = (mt.actualBoundingBoxAscent || 72) / 100;
      const dRatio = (mt.actualBoundingBoxDescent || 2) / 100;

      fs = Math.min((cw * frac) / wRatio, window.innerHeight * 0.42);
      const pad = fs * 0.2;
      wordW = wRatio * fs;
      asc = aRatio * fs;
      desc = dRatio * fs;
      cssW = cw;
      top = pad;
      bot = pad + asc + desc;
      baseline = pad + asc;
      gap = fs * 0.02;
      reflH = (asc + desc) * 0.55;
      cssH = Math.ceil(bot + gap + reflH + pad * 0.3);
      left = (cw - wordW) / 2;
      right = left + wordW;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      dpr = Math.min(dpr, Math.sqrt(3.6e6 / (cssW * cssH)));
      dpr = Math.max(dpr, 0.75);
      pw = Math.round(cssW * dpr);
      ph = Math.round(cssH * dpr);
      cv.width = pw;
      cv.height = ph;
      cv.style.height = `${cssH}px`;

      M = mk();
      S = mk();
      R = mk();
      L = mk();
      F = mk();
      buildStatic();
      initBubbles();
    }

    function surfY(x: number, t: number, ph: number, off: number) {
      const u = (x - cssW / 2) / wordW;
      const k = TAU / (fs * 0.95);
      return (
        baseY +
        off +
        tilt * u * 2 +
        amp * Math.sin(x * k + t * 1.55 + ph) +
        amp * 0.55 * Math.sin(x * k * 2.2 - t * 1.05 + ph * 1.7)
      );
    }

    function wavePath(
      c: CanvasRenderingContext2D,
      t: number,
      ph: number,
      off: number,
      open: boolean
    ) {
      const x0 = left - fs * 0.1;
      const x1 = right + fs * 0.1;
      const step = Math.max(3, fs * 0.012);
      c.beginPath();
      c.moveTo(x0, surfY(x0, t, ph, off));
      for (let x = x0 + step; x <= x1; x += step) {
        c.lineTo(x, surfY(x, t, ph, off));
      }
      c.lineTo(x1, surfY(x1, t, ph, off));
      if (!open) {
        c.lineTo(x1, cssH + 2);
        c.lineTo(x0, cssH + 2);
        c.closePath();
      }
    }

    function paintColors(c: CanvasRenderingContext2D, t: number, hgt: number) {
      const g = c.createLinearGradient(
        left - fs * 0.15 + Math.sin(t * 0.45) * fs * 0.12,
        0,
        right + fs * 0.15 + Math.cos(t * 0.4) * fs * 0.12,
        0
      );
      for (let i = 0; i < STOPS.length; i++) {
        const o = STOPS[i][0] + Math.sin(t * 0.6 + i * 1.7) * 0.022;
        g.addColorStop(Math.min(1, Math.max(0, o)), STOPS[i][1]);
      }
      c.fillStyle = g;
      c.fillRect(0, 0, cssW, cssH);

      for (let i = 0; i < BLOBS.length; i++) {
        const b = BLOBS[i];
        const cx =
          left + (b[0] + Math.sin(t * (0.35 + i * 0.07) + i * 2.1) * 0.07) * wordW;
        const cy =
          top + hgt * (0.5 + 0.38 * Math.sin(t * (0.5 + i * 0.05) + i * 1.3));
        const rad = hgt * 0.7;
        const rg = c.createRadialGradient(cx, cy, 0, cx, cy, rad);
        rg.addColorStop(0, rgba(b[1], 0.85));
        rg.addColorStop(1, rgba(b[1], 0));
        c.fillStyle = rg;
        c.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }

      c.lineWidth = hgt * 0.02;
      c.strokeStyle = 'rgba(255,255,255,0.26)';
      c.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        for (let x = left; x <= right; x += 8) {
          const y =
            top +
            hgt * (0.2 + 0.3 * i) +
            Math.sin((x * TAU) / (fs * 0.8) + t * (0.9 + i * 0.3) + i * 2) *
              hgt *
              0.05;
          if (x === left) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      }
    }

    function drawBubbles(c: CanvasRenderingContext2D, t: number, dt: number) {
      c.lineCap = 'round';
      for (let i = 0; i < bubbles.length; i++) {
        let b = bubbles[i];
        if (!b.still && dt > 0) {
          b.y -= b.vy * dt;
          b.x += Math.sin(t * b.w + b.ph) * 0.18;
          const sy = top - fs * 0.02;
          if (b.y < sy + b.r) bubbles[i] = b = newBubble(false);
        }
        const by = b.still ? b.y + Math.sin(t * 0.5 + b.ph) * 0.4 : b.y;
        c.beginPath();
        c.arc(b.x, by, b.r, 0, TAU);
        c.fillStyle = 'rgba(255,255,255,0.16)';
        c.fill();
        c.lineWidth = Math.max(0.8, b.r * 0.16);
        c.strokeStyle = 'rgba(255,255,255,0.85)';
        c.stroke();
        c.beginPath();
        c.arc(
          b.x - b.r * 0.28,
          by - b.r * 0.28,
          b.r * 0.55,
          Math.PI * 1.05,
          Math.PI * 1.65
        );
        c.lineWidth = Math.max(0.7, b.r * 0.14);
        c.strokeStyle = 'rgba(255,255,255,1)';
        c.stroke();
      }
    }

    function draw(t: number, dt: number) {
      if (!ctx) return;
      const c = L.x;
      const hgt = bot - top;
      baseY = top - hgt * 0.12;
      amp = hgt * 0.03;
      tilt =
        Math.sin(t * 0.9) * hgt * 0.03 +
        Math.sin(t * 0.37 + 1.3) * hgt * 0.02;

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.clearRect(0, 0, cssW, cssH);

      // Far layer for depth
      c.save();
      wavePath(c, t, 1.9, -hgt * 0.02, false);
      c.clip();
      c.globalAlpha = 0.55;
      paintColors(c, t + 3.1, hgt);
      c.restore();

      // Main liquid body
      c.save();
      wavePath(c, t, 0, 0, false);
      c.clip();
      paintColors(c, t, hgt);
      const dg = c.createLinearGradient(0, top, 0, bot);
      dg.addColorStop(0, 'rgba(255,255,255,0.22)');
      dg.addColorStop(0.3, 'rgba(255,255,255,0)');
      dg.addColorStop(1, 'rgba(0,20,60,0.14)');
      c.fillStyle = dg;
      c.fillRect(0, 0, cssW, cssH);
      c.restore();

      drawBubbles(c, t, dt);

      // Light sweeps
      for (let k = 0; k < 2; k++) {
        const p = ((t * 0.085 + k * 0.55) % 1.6) - 0.3;
        const sx = left + p * wordW;
        const bw = fs * (k ? 0.12 : 0.26);
        const sg = c.createLinearGradient(sx - bw, top, sx + bw, bot);
        sg.addColorStop(0, 'rgba(255,255,255,0)');
        sg.addColorStop(0.5, `rgba(255,255,255,${k ? 0.4 : 0.34})`);
        sg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = sg;
        c.fillRect(left - fs * 0.1, top - 4, wordW + fs * 0.2, hgt + 8);
      }

      // Letter shape mask
      c.save();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = 'destination-in';
      c.drawImage(M.c, 0, 0);
      c.restore();

      // Underside mirror reflection
      const f = F.x;
      f.setTransform(1, 0, 0, 1, 0, 0);
      f.globalCompositeOperation = 'source-over';
      f.globalAlpha = 1;
      f.clearRect(0, 0, pw, ph);
      f.setTransform(dpr, 0, 0, -dpr, 0, (2 * bot + gap) * dpr);
      f.globalAlpha = 0.38;
      f.drawImage(L.c, 0, 0, cssW, cssH);
      f.drawImage(R.c, 0, 0, cssW, cssH);
      f.setTransform(1, 0, 0, 1, 0, 0);
      f.globalAlpha = 1;
      f.globalCompositeOperation = 'destination-out';
      const fg = f.createLinearGradient(
        0,
        (bot + gap) * dpr,
        0,
        (bot + gap + reflH) * dpr
      );
      fg.addColorStop(0, 'rgba(0,0,0,0.15)');
      fg.addColorStop(1, 'rgba(0,0,0,1)');
      f.fillStyle = fg;
      f.fillRect(0, 0, pw, ph);
      f.globalCompositeOperation = 'source-over';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      ctx.drawImage(F.c, 0, 0);
      ctx.drawImage(S.c, 0, 0);
      try {
        ctx.filter = 'saturate(1.3) contrast(1.06)';
      } catch (e) {}
      ctx.drawImage(L.c, 0, 0);
      try {
        ctx.filter = 'none';
      } catch (e) {}
      ctx.drawImage(R.c, 0, 0);
    }

    let prog = -1;
    let finishedTriggered = false;

    function setProg(n: number) {
      if (!bar || !pctEl) return;
      n = Math.max(0, Math.min(100, n));
      const r = Math.round(n);
      bar.style.setProperty('--p', `${n}%`);
      if (r !== prog) {
        prog = r;
        pctEl.textContent = `Loading workspace... ${r}%`;
        bar.setAttribute('aria-valuenow', String(r));
      }

      if (r >= 100 && !finishedTriggered) {
        finishedTriggered = true;
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            onFinish();
          }, 450);
        }, 350);
      }
    }

    let animId = 0;
    let t0 = 0;
    let last = 0;
    let started = false;

    // Loading duration: 2.8s smooth cubic bezier progress
    const TOTAL_DURATION = 2800;

    function frame(now: number) {
      const elapsed = now - t0;
      const t = elapsed / 1000;
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      draw(t, dt);

      const f = Math.min(1, elapsed / TOTAL_DURATION);
      const e = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
      setProg(e * 100);

      if (!finishedTriggered || f < 1) {
        animId = requestAnimationFrame(frame);
      }
    }

    let lastW = 0, lastH = 0, queued = false;
    function onResize() {
      if (!started || queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (!stage) return;
        const w = stage.clientWidth;
        const h = window.innerHeight;
        if (w === lastW && h === lastH) return;
        lastW = w;
        lastH = h;
        layout();
        if (reduce) draw(2.3, 0);
      });
    }

    function start() {
      if (started) return;
      started = true;
      layout();
      lastW = stage?.clientWidth || 0;
      lastH = window.innerHeight;
      if (reduce) {
        draw(2.3, 0);
        setProg(100);
      } else {
        t0 = performance.now();
        animId = requestAnimationFrame(frame);
      }
    }

    window.addEventListener('resize', onResize);
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && stage) {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(stage);
    }

    const fontReady =
      document.fonts && document.fonts.load
        ? Promise.race([
            document.fonts.load(`800 100px Montserrat`, TEXT),
            new Promise((res) => setTimeout(res, 1800)),
          ])
        : Promise.resolve();

    fontReady.then(start, start);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
      }}
    >
      <style>{`
        .mentos-screen {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2vh, 22px);
          padding-block: 24px;
          width: 100%;
        }
        .mentos-stage {
          width: 100%;
          max-width: 1700px;
        }
        #mark {
          display: block;
          width: 100%;
          max-width: 100%;
        }
        .mentos-quote {
          margin: 0;
          text-align: center;
          white-space: nowrap;
          font-family: 'Poppins', 'DM Sans', system-ui, -apple-system, sans-serif;
          font-size: clamp(11px, 2.1vw, 22px);
          line-height: 1.45;
          letter-spacing: 0.01em;
          font-weight: 500;
          color: #1c2733;
        }
        .mentos-loader {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: clamp(4px, 2vh, 18px);
        }
        .mentos-bar {
          position: relative;
          width: clamp(220px, 36vw, 460px);
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(180deg, #eef3f7, #f8fbfd);
          box-shadow:
            0 0 0 1px rgba(96, 134, 166, 0.55),
            inset 0 2px 3px rgba(40, 70, 100, 0.22),
            0 8px 16px rgba(40, 90, 140, 0.14);
        }
        .mentos-bar-fill {
          position: absolute;
          inset: 3px;
          border-radius: 999px;
          background: linear-gradient(180deg, #3a3a3a 0%, #000 50%, #141414 100%);
          clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0 round 999px);
          transition: clip-path 0.05s linear;
        }
        .mentos-bar-gloss {
          position: absolute;
          inset: 3px;
          border-radius: 999px;
          pointer-events: none;
          background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0) 62%, rgba(255, 255, 255, 0.18) 100%);
        }
        .mentos-pct {
          margin: 0;
          font-family: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.03em;
          color: #566472;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <main className="mentos-screen">
        <h1 className="sr-only">MentOS</h1>
        <div className="mentos-stage" id="stage" ref={stageRef}>
          <canvas id="mark" ref={canvasRef} aria-hidden="true" />
        </div>
        <p className="mentos-quote">Your personalized mentor for academics and future success.</p>
        <div className="mentos-loader">
          <div
            className="mentos-bar"
            id="bar"
            ref={barRef}
            role="progressbar"
            aria-label="Loading workspace"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <div className="mentos-bar-fill" />
            <div className="mentos-bar-gloss" />
          </div>
          <p className="mentos-pct" id="pct" ref={pctRef}>
            Loading workspace... 0%
          </p>
        </div>
      </main>
    </div>
  );
}
