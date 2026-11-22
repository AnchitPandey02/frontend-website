import React from 'react';

export default function HeroConnectionBar({
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
    { name: 'FastAPI (:8000)', url: 'http://localhost:8000' },
    { name: 'Flask (:5000)', url: 'http://localhost:5000' },
    { name: 'Ollama (:11434)', url: 'http://localhost:11434' },
    { name: 'LM Studio (:1234)', url: 'http://localhost:1234/v1' },
    { name: 'vLLM (:8080)', url: 'http://localhost:8080' }
  ];

  return (
    <section className="hero-section">
      <div className="hero-glow"></div>
      <div className="container hero-content">
        <div className="badge-pill">
          <span className="badge-dot"></span>
          Interactive Frontend for Your Machine Learning Models
        </div>
        <h1 className="hero-heading">
          Bring Your <span className="gradient-text">AI Models</span> to Life
        </h1>
        <p className="hero-subtext">
          Connect your FastAPI, Flask, PyTorch, TensorFlow, Hugging Face, or local model endpoints. Test text generation,
          run image inference, predict tabular data, and inspect API responses in real time.
        </p>

        {/* Global Connection Bar */}
        <div className="connection-bar-card glowing-card">
          <div className="connection-bar-form">
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
                placeholder="Bearer token or key"
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
          </div>

          {/* Quick Backend Presets */}
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

          <div className="connection-status-msg">
            {mockMode ? (
              <>💡 Demo Simulation is <strong>ON</strong>. The UI works right now with realistic outputs. Turn it off to route requests to your local Python/FastAPI/Flask server!</>
            ) : (
              <>🚀 Routing requests directly to <code>{baseUrl}</code>. Ensure CORS is enabled on your server!</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
