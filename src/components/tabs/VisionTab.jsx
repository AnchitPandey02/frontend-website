import React, { useState, useRef } from 'react';
import { simulateVisionResponse } from '../../utils/mockBackend';
import { playCyberSound } from '../../utils/audioFx';

export default function VisionTab({
  baseUrl,
  apiKey,
  mockMode,
  soundEnabled,
  onInferenceSuccess,
  setIsGeneratingTelemetry
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [customRoute, setCustomRoute] = useState('/api/vision/predict');
  const [isRunning, setIsRunning] = useState(false);
  const [showScanline, setShowScanline] = useState(false);
  const [visionResults, setVisionResults] = useState(null);
  const [rawJson, setRawJson] = useState('{"status": "waiting_for_input"}');

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const sampleImages = [
    { label: 'Dog 🐶', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop' },
    { label: 'Cat 🐱', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop' },
    { label: 'Car 🚗', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        clearCanvas();
        setVisionResults(null);
        setRawJson('{"status": "image_loaded_ready_for_inference"}');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSample = (url) => {
    setImageSrc(url);
    clearCanvas();
    setVisionResults(null);
    setRawJson('{"status": "sample_loaded_ready_for_inference"}');
  };

  const handleLoadUrl = () => {
    if (imageUrl.trim()) {
      setImageSrc(imageUrl.trim());
      clearCanvas();
      setVisionResults(null);
      setRawJson('{"status": "url_loaded_ready_for_inference"}');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawBoundingBoxes = (detections) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((det) => {
      const [xNorm, yNorm, wNorm, hNorm] = det.box;
      const x = xNorm * canvas.width;
      const y = yNorm * canvas.height;
      const w = wNorm * canvas.width;
      const h = hNorm * canvas.height;

      // Draw box
      ctx.strokeStyle = det.color || '#6366f1';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Label background
      ctx.fillStyle = det.color || '#6366f1';
      const labelText = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x, Math.max(0, y - 22), textWidth + 12, 22);

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x + 6, Math.max(16, y - 6));
    });
  };

  const handleRunInference = async () => {
    if (!imageSrc || isRunning) return;

    setIsRunning(true);
    setShowScanline(true);
    setIsGeneratingTelemetry(true);
    playCyberSound('click', soundEnabled);

    const startTime = performance.now();

    try {
      if (mockMode) {
        await new Promise((r) => setTimeout(r, 650));
        const data = simulateVisionResponse();
        const elapsed = Math.round(performance.now() - startTime);

        setVisionResults(data);
        setRawJson(JSON.stringify(data, null, 2));
        drawBoundingBoxes(data.detections);
        onInferenceSuccess(elapsed);
        playCyberSound('success', soundEnabled);
      } else {
        const endpoint = `${baseUrl.replace(/\/$/, '')}${customRoute.startsWith('/') ? customRoute : `/${customRoute}`}`;
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ image: imageSrc })
        });

        const elapsed = Math.round(performance.now() - startTime);
        onInferenceSuccess(elapsed);

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        setVisionResults(data);
        setRawJson(JSON.stringify(data, null, 2));
        if (data.detections) drawBoundingBoxes(data.detections);
        playCyberSound('success', soundEnabled);
      }
    } catch (err) {
      setRawJson(JSON.stringify({ error: err.message }, null, 2));
      playCyberSound('error', soundEnabled);
    } finally {
      setIsRunning(false);
      setShowScanline(false);
      setIsGeneratingTelemetry(false);
    }
  };

  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">Computer Vision Playground</h2>
          <p className="section-subtitle">Classify images, detect bounding boxes, or test segmentation models with live image inputs.</p>
        </div>
        <div className="endpoint-badge">
          <span>Target:</span>
          <code>POST {customRoute}</code>
        </div>
      </div>

      <div className="playground-layout">
        {/* Image Upload & Canvas Area */}
        <div className="playground-main card">
          <div
            className="image-uploader-zone"
            onClick={() => !imageSrc && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="file-input-hidden"
              onChange={handleFileChange}
            />

            {!imageSrc ? (
              <div className="upload-idle">
                <div className="upload-icon">📷</div>
                <h3>Drag & Drop image here</h3>
                <p>or click to browse from your computer (PNG, JPG, WEBP)</p>
                <div className="sample-images">
                  <span className="text-xs text-muted">Or try sample:</span>
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSample(s.url);
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="image-preview-wrapper">
                <div className="canvas-container">
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Upload Preview"
                    onLoad={() => {
                      if (visionResults?.detections) {
                        drawBoundingBoxes(visionResults.detections);
                      }
                    }}
                  />
                  <canvas ref={canvasRef} />
                  {showScanline && <div className="vision-scanline"></div>}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs remove-img-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageSrc(null);
                    clearCanvas();
                    setVisionResults(null);
                  }}
                >
                  ✕ Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="vision-actions">
            <div className="input-group flex-1">
              <span className="input-prefix">IMAGE URL</span>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button className="btn btn-secondary btn-sm" onClick={handleLoadUrl}>Load</button>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleRunInference}
              disabled={!imageSrc || isRunning}
            >
              {isRunning && <span className="btn-spinner"></span>}
              <span>Run Inference 🔍</span>
            </button>
          </div>
        </div>

        {/* Vision Inference Results Sidebar */}
        <aside className="playground-sidebar card">
          <h3 className="sidebar-title">Detection & Predictions</h3>

          <div className="vision-results">
            {!visionResults ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>Upload an image and run inference to see predicted classes, confidence scores, and detection boxes.</p>
              </div>
            ) : (
              <div className="results-list">
                {visionResults.detections?.map((det, idx) => (
                  <div key={idx} className="result-item" style={{ borderLeft: `4px solid ${det.color || '#6366f1'}` }}>
                    <div className="result-header">
                      <span className="font-bold">{det.label}</span>
                      <span className="font-mono text-xs">{(det.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="confidence-bar-bg">
                      <div
                        className="confidence-bar-fill"
                        style={{
                          width: `${det.confidence * 100}%`,
                          backgroundColor: det.color || '#6366f1'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-inner-box">
            <div className="box-header">
              <span className="text-xs uppercase font-bold text-muted">Model Output (JSON)</span>
              <button
                className="btn-copy-code"
                onClick={() => navigator.clipboard.writeText(rawJson)}
              >
                📋 Copy
              </button>
            </div>
            <pre className="code-block json-view"><code>{rawJson}</code></pre>
          </div>
        </aside>
      </div>
    </section>
  );
}
