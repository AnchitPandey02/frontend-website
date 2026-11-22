import React, { useEffect, useRef } from 'react';

export default function InteractiveCursorCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle arrays
    const trailParticles = [];
    const burstParticles = [];
    const shockwaves = [];

    const colors = ['#ff9933', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

    let mouse = { x: width / 2, y: height / 2, moved: false };

    // Mouse Move Listener -> Spawn Trail Particles
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moved = true;

      // Spawn 3-5 luminous particles along mouse path
      for (let i = 0; i < 3; i++) {
        trailParticles.push({
          x: mouse.x + (Math.random() - 0.5) * 12,
          y: mouse.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2.8 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          life: 1
        });
      }
    };

    // Mouse Click Listener -> Shockwave & Explosion Burst
    const handleClick = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // 1. Expanding Shockwave Ring
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 110,
        speed: 4.5,
        color: Math.random() > 0.5 ? '#ff9933' : '#06b6d4',
        alpha: 1
      });

      // 2. High-speed Spark Burst (25-35 particles)
      const count = 30;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4.5 + 2;
        burstParticles.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 1.5,
          color: colors[i % colors.length],
          alpha: 1,
          decay: Math.random() * 0.028 + 0.018,
          gravity: 0.06
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Dark Ambient Grid Lines (Clean & Minimal)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 65;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Soft Cursor Glow Halo (Follows mouse)
      if (mouse.moved) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        glow.addColorStop(0, 'rgba(255, 153, 51, 0.07)');
        glow.addColorStop(0.5, 'rgba(6, 182, 212, 0.035)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render & Update Trail Particles (Mouse Movement)
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // Connect nearby trail particles with subtle constellation lines
      for (let i = 0; i < trailParticles.length; i++) {
        for (let j = i + 1; j < trailParticles.length; j++) {
          const dx = trailParticles[i].x - trailParticles[j].x;
          const dy = trailParticles[i].y - trailParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 45) {
            const lineAlpha = (1 - dist / 45) * trailParticles[i].alpha * 0.35;
            ctx.strokeStyle = `rgba(255, 153, 51, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(trailParticles[i].x, trailParticles[i].y);
            ctx.lineTo(trailParticles[j].x, trailParticles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Render & Update Click Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const s = shockwaves[i];
        s.radius += s.speed;
        s.alpha = 1 - s.radius / s.maxRadius;

        if (s.radius >= s.maxRadius || s.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowBlur = 14;
        ctx.shadowColor = s.color;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Render & Update Click Burst Particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-cursor-canvas" />;
}
