import React, { useRef, useEffect, useState } from 'react';
import { getKrathongImage } from '../utils/canvasHelpers';

export default function RiverCanvas({
  krathongs = [],
  onSelectKrathong,
  onOpenWizard,
  onGoToFair
}) {
  const canvasRef = useRef(null);
  const [hoveredKrathong, setHoveredKrathong] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Keep internal mutable state for animation loop to avoid re-binding
  const animationState = useRef({
    krathongsState: [],
    stars: [],
    lanterns: [],
    time: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    hoveredItem: null
  });

  // Initialize stars and lanterns
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.45, // Top 45% of screen
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: 0.02 + Math.random() * 0.03
      });
    }

    const lanterns = [];
    for (let i = 0; i < 20; i++) {
      lanterns.push({
        x: Math.random(),
        y: Math.random() * 0.45,
        size: 13 + Math.random() * 15,
        speedY: 0.00015 + Math.random() * 0.0002,
        swaySpeed: 0.001 + Math.random() * 0.002,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: 0.6 + Math.random() * 0.4
      });
    }

    animationState.current.stars = stars;
    animationState.current.lanterns = lanterns;
  }, []);

  // Sync prop krathongs into mutable animation state
  useEffect(() => {
    const existingMap = new Map();
    animationState.current.krathongsState.forEach((k) => existingMap.set(k.id, k));

    const updated = krathongs.map((k, idx) => {
      const existing = existingMap.get(k.id);
      if (existing) {
        return {
          ...k,
          x: existing.x,
          y: existing.y,
          speed: existing.speed,
          scale: existing.scale,
          bobOffset: existing.bobOffset
        };
      }
      return {
        ...k,
        x: k.x !== undefined ? k.x : (idx * 0.14) % 1.0,
        y: k.y !== undefined ? k.y : 0.55 + ((idx * 0.08) % 0.35),
        speed: k.speed || (0.00025 + Math.random() * 0.0002),
        scale: k.scale || (0.9 + Math.random() * 0.3),
        bobOffset: Math.random() * Math.PI * 2
      };
    });

    animationState.current.krathongsState = updated;
  }, [krathongs]);

  // Handle Resize & Orientation Change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance on Retina iPads
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
      ctx.scale(dpr, dpr);
      animationState.current.width = w;
      animationState.current.height = h;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 150);
    });

    const render = () => {
      animationState.current.time += 0.016;
      const t = animationState.current.time;
      const w = animationState.current.width;
      const h = animationState.current.height;

      ctx.clearRect(0, 0, w, h);

      // 1. SKY GRADIENT
      const isLandscape = w > h;
      const skyHeightRatio = isLandscape ? 0.45 : 0.42;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * skyHeightRatio);
      skyGrad.addColorStop(0, '#060913');
      skyGrad.addColorStop(0.5, '#0b1329');
      skyGrad.addColorStop(1, '#111e38');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * (skyHeightRatio + 0.05));

      // 2. STARS
      animationState.current.stars.forEach((star) => {
        const twinkle = Math.sin(t * star.twinkleSpeed * 60) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h * (skyHeightRatio / 0.45), star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. FULL MOON (Adaptive size for Mobile / iPad / Desktop)
      const moonX = isLandscape ? w * 0.84 : w * 0.80;
      const moonY = isLandscape ? h * 0.18 : h * 0.16;
      const moonR = Math.max(26, Math.min(w, h) * (isLandscape ? 0.08 : 0.09));

      // Outer Moon Halo
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 3.5);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      moonGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.15)');
      moonGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Moon Body
      const moonBody = ctx.createRadialGradient(moonX - moonR * 0.3, moonY - moonR * 0.3, moonR * 0.1, moonX, moonY, moonR);
      moonBody.addColorStop(0, '#fffae0');
      moonBody.addColorStop(0.7, '#fef08a');
      moonBody.addColorStop(1, '#facc15');
      ctx.fillStyle = moonBody;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Soft Moon Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.ellipse(moonX + 12, moonY + 6, moonR * 1.3, moonR * 0.35, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // 4. FLOATING SKY LANTERNS (โคมลอย)
      animationState.current.lanterns.forEach((lantern) => {
        lantern.y -= lantern.speedY;
        if (lantern.y < -0.05) {
          lantern.y = skyHeightRatio + 0.05;
          lantern.x = Math.random();
        }
        const swayX = Math.sin(t * lantern.swaySpeed * 100 + lantern.swayOffset) * 15;
        const lx = lantern.x * w + swayX;
        const ly = lantern.y * h;

        // Lantern Glow
        const lGlow = ctx.createRadialGradient(lx, ly, lantern.size * 0.2, lx, ly, lantern.size * 1.8);
        lGlow.addColorStop(0, 'rgba(251, 146, 60, 0.5)');
        lGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = lGlow;
        ctx.beginPath();
        ctx.arc(lx, ly, lantern.size * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Lantern Shape
        ctx.fillStyle = `rgba(254, 215, 170, ${lantern.alpha})`;
        ctx.beginPath();
        ctx.roundRect(lx - lantern.size * 0.4, ly - lantern.size * 0.6, lantern.size * 0.8, lantern.size * 1.2, 4);
        ctx.fill();

        // Lantern Flame Core
        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(lx, ly + lantern.size * 0.3, lantern.size * 0.18, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. DISTANT SILHOUETTES (ขอบฝั่งแม่น้ำ)
      const riverTopY = h * skyHeightRatio;
      ctx.fillStyle = '#070b16';
      ctx.beginPath();
      ctx.moveTo(0, riverTopY);
      for (let x = 0; x <= w; x += 40) {
        const hill = Math.sin(x * 0.005) * 12 + Math.sin(x * 0.015) * 8;
        ctx.lineTo(x, riverTopY - 14 + hill);
      }
      ctx.lineTo(w, riverTopY);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Distant Pagoda (เจดีย์ริมน้ำ)
      const pagodaX = w * (isLandscape ? 0.35 : 0.28);
      ctx.fillStyle = '#060913';
      ctx.beginPath();
      ctx.moveTo(pagodaX - 22, riverTopY - 8);
      ctx.lineTo(pagodaX - 13, riverTopY - 32);
      ctx.lineTo(pagodaX - 5, riverTopY - 60);
      ctx.lineTo(pagodaX, riverTopY - 85); // spire
      ctx.lineTo(pagodaX + 5, riverTopY - 60);
      ctx.lineTo(pagodaX + 13, riverTopY - 32);
      ctx.lineTo(pagodaX + 22, riverTopY - 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.beginPath();
      ctx.arc(pagodaX, riverTopY - 85, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 6. RIVER WATER
      const riverGrad = ctx.createLinearGradient(0, riverTopY, 0, h);
      riverGrad.addColorStop(0, '#0c1a30');
      riverGrad.addColorStop(0.3, '#091b35');
      riverGrad.addColorStop(0.7, '#07162b');
      riverGrad.addColorStop(1, '#051020');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, riverTopY, w, h - riverTopY);

      // Moon Reflection on Water
      const moonReflectGrad = ctx.createLinearGradient(moonX - 70, 0, moonX + 70, 0);
      moonReflectGrad.addColorStop(0, 'rgba(253, 224, 71, 0)');
      moonReflectGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.12)');
      moonReflectGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = moonReflectGrad;
      ctx.fillRect(moonX - 80, riverTopY, 160, h - riverTopY);

      // Shimmering Water Waves
      const waveCount = isLandscape ? 16 : 12;
      for (let waveIdx = 0; waveIdx < waveCount; waveIdx++) {
        const wy = riverTopY + (waveIdx / waveCount) * (h - riverTopY);
        const waveSpeed = 0.8 + waveIdx * 0.1;
        ctx.strokeStyle = `rgba(147, 197, 253, ${0.04 + (waveIdx / waveCount) * 0.08})`;
        ctx.lineWidth = 1.2 + (waveIdx / waveCount) * 1.5;
        ctx.beginPath();
        for (let wx = 0; wx <= w; wx += 50) {
          const waveHeight = Math.sin(wx * 0.015 + t * waveSpeed + waveIdx) * (3 + waveIdx * 0.4);
          if (wx === 0) ctx.moveTo(wx, wy + waveHeight);
          else ctx.lineTo(wx, wy + waveHeight);
        }
        ctx.stroke();
      }

      // 7. KRATHONGS IN WATER
      const currentKrathongs = [...animationState.current.krathongsState];
      currentKrathongs.sort((a, b) => a.y - b.y);

      let foundHover = null;
      const mouse = mousePos;

      currentKrathongs.forEach((k) => {
        // Drift forward with river flow
        k.x += k.speed;
        if (k.x > 1.15) {
          k.x = -0.15;
          k.y = (skyHeightRatio + 0.1) + Math.random() * (1 - (skyHeightRatio + 0.2));
        }

        const baseKSize = Math.max(70, Math.min(w * 0.18, 110));
        const kScale = k.scale * (0.7 + k.y * 0.6);
        const kSize = baseKSize * kScale;
        const bob = Math.sin(t * 2 + k.bobOffset) * (3 * kScale);
        const kx = k.x * w;
        const ky = k.y * h + bob;

        // Check distance to mouse or touch
        const hitRadius = Math.max(38, kSize * 0.55); // generous touch area
        const dist = Math.hypot(kx - mouse.x, ky - mouse.y);
        const isHovered = dist < hitRadius;
        if (isHovered && !foundHover) {
          foundHover = k;
        }

        // Draw Water Light Reflection under Krathong
        const flameConfig = k.flameColor === 'rose' ? 'rgba(251, 113, 133, ' :
                           k.flameColor === 'cyan' ? 'rgba(56, 189, 248, ' :
                           k.flameColor === 'purple' ? 'rgba(192, 132, 252, ' : 'rgba(255, 170, 0, ';
        
        const reflGrad = ctx.createRadialGradient(kx, ky + kSize * 0.35, kSize * 0.1, kx, ky + kSize * 0.35, kSize * 0.9);
        reflGrad.addColorStop(0, flameConfig + '0.45)');
        reflGrad.addColorStop(0.6, flameConfig + '0.12)');
        reflGrad.addColorStop(1, flameConfig + '0)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.ellipse(kx, ky + kSize * 0.35, kSize * 0.85, kSize * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Krathong SVG Image
        const img = getKrathongImage(k.style, k.flameColor);
        if (img && img.complete) {
          ctx.save();
          ctx.translate(kx, ky);

          const tilt = Math.cos(t * 1.5 + k.bobOffset) * 0.04;
          ctx.rotate(tilt);

          if (isHovered) {
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 18;
          }

          ctx.drawImage(img, -kSize / 2, -kSize / 2, kSize, kSize);
          ctx.restore();
        }

        // Name Tag Floating above Krathong
        ctx.save();
        ctx.font = '500 11px "Prompt", sans-serif';
        const isCouple = Boolean(k.isCouple);
        const nameText = isCouple ? `💑 ${k.name}` : (k.name || 'ผู้ร่วมลอยกระทง');
        const textWidth = ctx.measureText(nameText).width;
        const tagX = kx - textWidth / 2 - 7;
        const tagY = ky - kSize * 0.55;

        // Tag background
        ctx.fillStyle = isHovered 
          ? 'rgba(245, 158, 11, 0.95)' 
          : isCouple ? 'rgba(88, 28, 135, 0.85)' : 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = isHovered 
          ? '#fef08a' 
          : isCouple ? '#f472b6' : 'rgba(253, 224, 71, 0.35)';
        ctx.lineWidth = isCouple ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, textWidth + 14, 20, 10);
        ctx.fill();
        ctx.stroke();

        // Tag text
        ctx.fillStyle = isHovered ? '#0f172a' : isCouple ? '#fdf2f8' : '#fef9c3';
        ctx.fillText(nameText, kx - textWidth / 2, tagY + 14);
        ctx.restore();
      });

      // Update hover state
      animationState.current.hoveredItem = foundHover;
      if (foundHover?.id !== hoveredKrathong?.id) {
        setHoveredKrathong(foundHover);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, hoveredKrathong]);

  // Mouse handlers
  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
    setHoveredKrathong(null);
  };

  // Touch handlers for iPad & Mobile phones
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const tx = e.touches[0].clientX - rect.left;
        const ty = e.touches[0].clientY - rect.top;
        setMousePos({ x: tx, y: ty });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const tx = e.touches[0].clientX - rect.left;
        const ty = e.touches[0].clientY - rect.top;
        setMousePos({ x: tx, y: ty });
      }
    }
  };

  const handleTouchEnd = () => {
    if (animationState.current.hoveredItem) {
      onSelectKrathong(animationState.current.hoveredItem);
    }
    // reset after small delay so tooltip can close
    setTimeout(() => {
      setMousePos({ x: -1000, y: -1000 });
      setHoveredKrathong(null);
    }, 400);
  };

  const handleClick = () => {
    if (animationState.current.hoveredItem) {
      onSelectKrathong(animationState.current.hoveredItem);
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-full block ${hoveredKrathong ? 'cursor-pointer' : 'cursor-default'}`}
      />

      {/* Floating Interactive Hover Tooltip */}
      {hoveredKrathong && (
        <div 
          className="fixed pointer-events-none z-30 transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ 
            left: `${Math.max(140, Math.min(window.innerWidth - 140, mousePos.x))}px`, 
            top: `${mousePos.y - 45}px` 
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-3 rounded-2xl border border-amber-400/40 shadow-2xl max-w-[260px] sm:max-w-xs text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs sm:text-sm font-bold text-amber-300 truncate">
                {hoveredKrathong.isCouple ? `💑 ${hoveredKrathong.name}` : hoveredKrathong.name}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full border ${
                hoveredKrathong.isCouple 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-200 border-amber-500/30'
              }`}>
                {hoveredKrathong.isCouple ? 'กระทงคู่รัก 💖' : 'แตะเพื่ออ่าน 🪷'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2 leading-relaxed">
              "{hoveredKrathong.wish}"
            </p>
            <div className="flex items-center gap-2.5 mt-1.5 text-[10px] sm:text-[11px] text-amber-400 font-medium">
              <span>❤️ {hoveredKrathong.likes || 0}</span>
              <span>🙏 {hoveredKrathong.blessings || 0} สาธุ</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Pier & Action Button */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex flex-col sm:flex-row justify-between items-center sm:items-end gap-2.5 sm:gap-4 p-3 sm:p-6 md:p-8 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Pier notice card */}
        <div className="pointer-events-auto w-full sm:w-auto">
          <div className="bg-gradient-to-t from-slate-950 via-slate-900/85 to-slate-900/60 p-2.5 sm:p-3.5 md:p-4 rounded-2xl sm:rounded-3xl border border-amber-500/20 backdrop-blur-md shadow-xl text-center sm:text-left flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] sm:text-xs text-amber-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ประเพณีลอยกระทง คืนเพ็ญเดือน ๑๒
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                {krathongs.length === 0 
                  ? 'ยังไม่มีกระทงในสายน้ำ แตะปุ่มด้านล่างเพื่อลอยเป็นคนแรกได้เลย! 🪷' 
                  : 'แตะที่กระทงใดก็ได้ในแม่น้ำเพื่ออ่านคำขอพรและส่งกำลังใจ ❤️'}
              </p>
            </div>
            {onGoToFair && (
              <button
                onClick={onGoToFair}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
              >
                ไปงานวัด 🎪
              </button>
            )}
          </div>
        </div>

        {/* Floating Launch Button */}
        <div className="pointer-events-auto w-full sm:w-auto flex items-center gap-2 justify-center sm:justify-end">
          {onGoToFair && (
            <button
              onClick={onGoToFair}
              className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-semibold rounded-2xl sm:rounded-full text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>🎪 ลานงานวัด</span>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className="group relative flex-1 sm:flex-initial flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 md:px-7 md:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-2xl sm:rounded-full shadow-2xl hover:shadow-amber-500/40 transform active:scale-95 transition-all cursor-pointer border border-yellow-200 text-xs sm:text-base md:text-lg"
          >
            <span className="text-lg sm:text-2xl group-hover:scale-125 transition-transform duration-300">🪷</span>
            <div className="text-left">
              <div className="leading-tight font-extrabold">สร้างและลอยกระทง</div>
              <div className="text-[9px] sm:text-[10px] text-amber-950/80 font-normal">เลือกกระทง • อธิษฐาน</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
