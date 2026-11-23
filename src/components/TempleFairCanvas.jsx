import React, { useRef, useEffect } from 'react';

export default function TempleFairCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Stars
    const stars = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.45,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    const render = () => {
      time += 0.015;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // 1. SKY GRADIENT (Festive night sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#060a17');
      skyGrad.addColorStop(0.35, '#0d1630');
      skyGrad.addColorStop(0.7, '#131e3d');
      skyGrad.addColorStop(1, '#0a1024');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. STARS
      stars.forEach((s) => {
        const twinkle = Math.sin(time * 2 + s.x * 20) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. FULL MOON
      const moonX = w * 0.82;
      const moonY = h * 0.16;
      const moonR = Math.min(w, h) * 0.07;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 3);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      moonGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // 4. ROTATING FERRIS WHEEL (ชิงช้าสวรรค์งานวัด)
      const fwX = w * (w > 768 ? 0.18 : 0.22);
      const fwY = h * (w > 768 ? 0.38 : 0.34);
      const fwR = Math.min(w, h) * (w > 768 ? 0.22 : 0.24);

      // Support legs (A-frame)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fwX, fwY);
      ctx.lineTo(fwX - fwR * 0.8, h * 0.7);
      ctx.moveTo(fwX, fwY);
      ctx.lineTo(fwX + fwR * 0.8, h * 0.7);
      ctx.stroke();

      // Center hub
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(fwX, fwY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Wheel rings
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(fwX, fwY, fwR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fwX, fwY, fwR * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Spokes & Gondolas with rotating festive neon lights
      const gondolaCount = 10;
      const neonColors = ['#f43f5e', '#38bdf8', '#facc15', '#4ade80', '#c084fc', '#fb923c'];
      for (let i = 0; i < gondolaCount; i++) {
        const angle = time * 0.4 + (i * Math.PI * 2) / gondolaCount;
        const gx = fwX + Math.cos(angle) * fwR;
        const gy = fwY + Math.sin(angle) * fwR;

        // Spoke line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fwX, fwY);
        ctx.lineTo(gx, gy);
        ctx.stroke();

        // Gondola cabin
        const col = neonColors[i % neonColors.length];
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(gx, gy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 5. THAI TEMPLE ROOFS SILHOUETTE (พระอุโบสถวัดริมน้ำ)
      const templeX = w * (w > 768 ? 0.65 : 0.68);
      const templeBaseY = h * 0.65;
      ctx.fillStyle = '#0a101f';
      ctx.beginPath();
      // Main hall
      ctx.rect(templeX - 80, templeBaseY - 60, 160, 60);
      ctx.fill();

      // Multi-tier tiered Thai roof
      ctx.beginPath();
      // Lower roof
      ctx.moveTo(templeX - 110, templeBaseY - 60);
      ctx.lineTo(templeX, templeBaseY - 115);
      ctx.lineTo(templeX + 110, templeBaseY - 60);
      // Chofa finial left & right
      ctx.quadraticCurveTo(templeX - 115, templeBaseY - 75, templeX - 120, templeBaseY - 80);
      // Upper roof
      ctx.moveTo(templeX - 85, templeBaseY - 95);
      ctx.lineTo(templeX, templeBaseY - 150);
      ctx.lineTo(templeX + 85, templeBaseY - 95);
      // Spire tip
      ctx.moveTo(templeX, templeBaseY - 150);
      ctx.lineTo(templeX, templeBaseY - 190);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Golden spire tip glow
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(templeX, templeBaseY - 190, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. FESTIVE PENNANT BUNTING FLAGS & LIGHT BULBS (ธงราวงานวัด 7 สี)
      const flagColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4'];
      const stringPoints = 12;
      const ropeY = h * 0.12;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= stringPoints; i++) {
        const sx = (i / stringPoints) * w;
        const sag = Math.sin((i / stringPoints) * Math.PI) * 22;
        if (i === 0) ctx.moveTo(sx, ropeY + sag);
        else ctx.lineTo(sx, ropeY + sag);
      }
      ctx.stroke();

      // Hanging triangle flags and glowing bulbs
      for (let i = 0; i < stringPoints; i++) {
        const sx = ((i + 0.5) / stringPoints) * w;
        const sag = Math.sin(((i + 0.5) / stringPoints) * Math.PI) * 22;
        const flagColor = flagColors[i % flagColors.length];

        // Triangle flag
        ctx.fillStyle = flagColor;
        ctx.beginPath();
        ctx.moveTo(sx - 12, ropeY + sag);
        ctx.lineTo(sx + 12, ropeY + sag);
        ctx.lineTo(sx, ropeY + sag + 20);
        ctx.closePath();
        ctx.fill();

        // Carnival bulb
        const bulbLit = Math.sin(time * 3 + i) > -0.3;
        ctx.fillStyle = bulbLit ? '#fef08a' : '#713f12';
        ctx.shadowColor = bulbLit ? '#fde047' : 'transparent';
        ctx.shadowBlur = bulbLit ? 10 : 0;
        ctx.beginPath();
        ctx.arc(sx, ropeY + sag + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. WATER EDGE & WOODEN PIER WALKWAY (ท่าน้ำงานวัด)
      const riverTopY = h * 0.72;
      const riverGrad = ctx.createLinearGradient(0, riverTopY, 0, h);
      riverGrad.addColorStop(0, '#09152b');
      riverGrad.addColorStop(1, '#050c1b');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, riverTopY, w, h - riverTopY);

      // Light reflections on water
      for (let i = 0; i < 8; i++) {
        const rx = (i / 8) * w + Math.sin(time + i) * 15;
        const ry = riverTopY + 15 + i * 8;
        ctx.fillStyle = 'rgba(253, 224, 71, 0.08)';
        ctx.beginPath();
        ctx.ellipse(rx, ry, 35, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
    />
  );
}
