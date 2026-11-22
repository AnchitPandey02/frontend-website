import React from 'react';

export default function BackendConnectionBar({
  baseUrl,
  setBaseUrl,
  apiKey,
  setApiKey,
  mockMode,
  setMockMode,
  onTestConnection,
  testingConnection
}) {
  const presets = [
    { name: 'FastAPI GeoAI (:8000)', url: 'http://localhost:8000' },
    { name: 'Flask GIS (:5000)', url: 'http://localhost:5000' },
    { name: 'Ollama GeoLLM (:11434)', url: 'http://localhost:11434' },
    { name: 'vLLM Vision (:8080)', url: 'http://localhost:8080' }
  ];

  return (
    <section className="backend-bar-section container" id="backend">
      <div className="connection-bar-card glowing-card">
        <div className="bar-header-row">
          <div>
            <h3 className="text-base font-bold">
              ⚡ Connect Your Custom AI Model (FastAPI / Flask / PyTorch / ONNX)
            </h3>
            <p className="text-xs text-muted">
              Route building segmentation and pothole detection requests to your local Python server or cloud endpoint.
            </p>
          </div>

          <label
            className="toggle-switch"
            title="When enabled, returns realistic simulated AI responses if your local server is offline"
          >
            <input
              type="checkbox"
              checked={mockMode}
              onChange={(e) => setMockMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Demo Simulation</span>
          </label>
        </div>

        <div className="connection-bar-form mt-3">
          <div className="input-group flex-1">
            <span className="input-prefix">API BASE URL</span>
            <input
              type="text"
              className="form-input"
              placeholder="http://localhost:8000"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>

          <div className="input-group auth-group">
            <span className="input-prefix">API KEY (OPTIONAL)</span>
            <input
              type="password"
              className="form-input"
              placeholder="Bearer token or secret key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="connection-actions">
            <button
              className="btn btn-secondary"
              onClick={onTestConnection}
              disabled={testingConnection}
            >
              {testingConnection && <span className="btn-spinner"></span>}
              <span>{testingConnection ? 'Pinging...' : '⚡ Ping Backend'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="preset-backends-bar">
          <span className="preset-label">⚡ Quick Presets:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              className={`preset-pill ${baseUrl === p.url ? 'active' : ''}`}
              onClick={() => setBaseUrl(p.url)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="connection-status-msg mt-2">
          {mockMode ? (
            <>
              💡 Demo Simulation is <strong>ON</strong>. The UI returns realistic outputs for Indian cities immediately.
              Turn this toggle off when running your local <code>backend_example.py</code>!
            </>
          ) : (
            <>
              🚀 Live mode active. Routing requests to <code>{baseUrl}</code> (e.g. <code>/api/v1/buildings/detect</code>, <code>/api/v1/potholes/predict</code>).
            </>
          )}
        </div>
      </div>
    </section>
  );
}
