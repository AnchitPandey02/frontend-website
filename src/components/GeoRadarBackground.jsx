import React, { useEffect, useRef } from 'react';

export default function GeoRadarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let angle = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Major India Coordinate Nodes (normalized 0-1 across screen)
    const geoNodes = [
      { name: 'DELHI [28.61° N, 77.20° E]', x: 0.42, y: 0.28, pulse: 0 },
      { name: 'BENGALURU [12.97° N, 77.59° E]', x: 0.44, y: 0.72, pulse: 1.5 },
      { name: 'MUMBAI [19.07° N, 72.87° E]', x: 0.32, y: 0.54, pulse: 0.8 },
      { name: 'VARANASI [25.31° N, 82.97° E]', x: 0.54, y: 0.38, pulse: 2.1 },
      { name: 'HYDERABAD [17.38° N, 78.48° E]', x: 0.45, y: 0.58, pulse: 1.2 },
      { name: 'KOLKATA [22.57° N, 88.36° E]', x: 0.65, y: 0.44, pulse: 2.7 }
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width * 0.46;
      const centerY = height * 0.48;
      const maxRadius = Math.min(width, height) * 0.55;

      // 1. Draw Subtle Geospatial Coordinate Grid
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.05)'; // Indian Saffron tint
      ctx.lineWidth = 1;

      // Horizontal latitude parallels
      const gridSpacingY = 70;
      for (let y = 0; y < height; y += gridSpacingY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical longitude meridians
      const gridSpacingX = 80;
      for (let x = 0; x < width; x += gridSpacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 2. Draw Concentric Radar Distance Rings
      for (let r = 100; r <= maxRadius; r += 110) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Radar Beam Sweep (Saffron / Cyan Glowing Cone)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, maxRadius);
      gradient.addColorStop(0, 'rgba(255, 153, 51, 0.22)'); // Saffron core
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)'); // Ashoka cyan
      gradient.addColorStop(1, 'rgba(19, 136, 8, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();

      // Lead line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.stroke();

      ctx.restore();
      angle += 0.008;

      // 4. Draw Geo Nodes (Cities & Satellite Targets)
      geoNodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        node.pulse += 0.04;

        const pulseSize = (Math.sin(node.pulse) + 1) * 6;
        const alpha = (Math.sin(node.pulse) + 1) * 0.35 + 0.3;

        // Outer pulse circle
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 153, 51, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.arc(nx, ny, 8 + pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Target center dot
        ctx.beginPath();
        ctx.fillStyle = '#ff9933';
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff9933';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(node.name, nx + 12, ny + 4);
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="geo-radar-canvas" />;
}
