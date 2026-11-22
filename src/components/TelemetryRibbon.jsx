import React, { useEffect, useRef } from 'react';

export default function TelemetryRibbon({
  engineStatus = 'ONLINE • READY',
  speed = '~54 tok/s',
  latency = '4.2 ms',
  inferencesCount = 0,
  isGenerating = false
}) {
  const waveCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.6;

      const freq = isGenerating ? 0.35 : 0.18;
      const amp = isGenerating ? 7 : 4;
      const step = isGenerating ? 0.12 : 0.05;

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * freq + phase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      phase += step;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isGenerating]);

  return (
    <section className="telemetry-section container">
      <div className="telemetry-ribbon card">
        <div className="telemetry-item">
          <span className="telemetry-dot live"></span>
          <div className="telemetry-info">
            <span className="telemetry-label">INFERENCE ENGINE</span>
            <span className="telemetry-val">{engineStatus}</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-info">
            <span className="telemetry-label">SIGNAL OSCILLOSCOPE</span>
            <canvas
              ref={waveCanvasRef}
              width={110}
              height={20}
              className="telemetry-canvas"
              title="Real-time request waveform"
            />
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-info">
            <span className="telemetry-label">EST. SPEED</span>
            <span className="telemetry-val font-mono">{speed}</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-info">
            <span className="telemetry-label">AVG LATENCY</span>
            <span className="telemetry-val font-mono">{latency}</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-info">
            <span className="telemetry-label">TOTAL INFERENCES</span>
            <span className="telemetry-val font-mono">{inferencesCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
