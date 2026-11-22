import React, { useState } from 'react';
import { TABULAR_PRESETS, simulateTabularResponse } from '../../utils/mockBackend';
import { playCyberSound } from '../../utils/audioFx';

export default function TabularTab({
  baseUrl,
  apiKey,
  mockMode,
  soundEnabled,
  onInferenceSuccess,
  setIsGeneratingTelemetry
}) {
  const [activePreset, setActivePreset] = useState('housing');
  const [fields, setFields] = useState(TABULAR_PRESETS.housing);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelectPreset = (presetName) => {
    setActivePreset(presetName);
    setFields(TABULAR_PRESETS[presetName] || []);
    setResult(null);
    playCyberSound('click', soundEnabled);
  };

  const handleFieldChange = (index, val) => {
    const updated = [...fields];
    updated[index].value = updated[index].type === 'number' ? parseFloat(val) || 0 : val;
    setFields(updated);
  };

  const handleAddField = () => {
    const key = `feature_${fields.length + 1}`;
    setFields([...fields, { name: `Feature ${fields.length + 1}`, key, type: 'number', value: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    setIsGeneratingTelemetry(true);
    playCyberSound('click', soundEnabled);

    const featureObj = {};
    fields.forEach((f) => {
      featureObj[f.key] = f.value;
    });

    const startTime = performance.now();

    try {
      if (mockMode) {
        await new Promise((r) => setTimeout(r, 350));
        const res = simulateTabularResponse(featureObj);
        const elapsed = Math.round(performance.now() - startTime);

        setResult(res);
        onInferenceSuccess(elapsed);
        playCyberSound('success', soundEnabled);
      } else {
        const endpoint = `${baseUrl.replace(/\/$/, '')}/api/tabular/predict`;
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(featureObj)
        });

        const elapsed = Math.round(performance.now() - startTime);
        onInferenceSuccess(elapsed);

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        setResult(data);
        playCyberSound('success', soundEnabled);
      }
    } catch (err) {
      setResult({
        prediction: 'ERROR',
        details: err.message
      });
      playCyberSound('error', soundEnabled);
    } finally {
      setIsPredicting(false);
      setIsGeneratingTelemetry(false);
    }
  };

  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">Tabular ML Feature Predictor</h2>
          <p className="section-subtitle">Feed numerical and categorical features into your scikit-learn, XGBoost, or PyTorch tabular models.</p>
        </div>
        <div className="endpoint-badge">
          <span>Target:</span>
          <code>POST /api/tabular/predict</code>
        </div>
      </div>

      <div className="playground-layout">
        {/* Features Input Form */}
        <div className="playground-main card">
          <div className="tabular-header">
            <span className="font-bold">Preset Feature Templates:</span>
            <div className="template-buttons">
              <button
                type="button"
                className={`btn btn-xs ${activePreset === 'housing' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleSelectPreset('housing')}
              >
                🏠 House Price
              </button>
              <button
                type="button"
                className={`btn btn-xs ${activePreset === 'churn' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleSelectPreset('churn')}
              >
                📉 Customer Churn
              </button>
              <button
                type="button"
                className={`btn btn-xs ${activePreset === 'credit' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleSelectPreset('credit')}
              >
                💳 Credit Risk
              </button>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={handleAddField}
              >
                + Add Field
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="features-form">
            <div className="features-grid">
              {fields.map((f, idx) => (
                <div key={idx} className="feature-input-card">
                  <label>{f.name}</label>
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    step={f.type === 'number' ? 'any' : undefined}
                    className="form-input"
                    value={f.value}
                    onChange={(e) => handleFieldChange(idx, e.target.value)}
                    required
                  />
                  <span className="text-xs text-muted font-mono">{f.key}</span>
                </div>
              ))}
            </div>

            <div className="tabular-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleSelectPreset(activePreset)}
              >
                Reset Defaults
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPredicting}>
                {isPredicting && <span className="btn-spinner"></span>}
                <span>Generate Prediction 📊</span>
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Result Display */}
        <aside className="playground-sidebar card">
          <h3 className="sidebar-title">Model Decision</h3>

          <div className="tabular-result-card">
            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">📈</div>
                <p>Submit features to calculate model prediction probability and score output.</p>
              </div>
            ) : (
              <div className="decision-box">
                <div className="decision-header">
                  <span className="text-xs uppercase font-bold text-muted">Predicted Outcome</span>
                  <span className="status-dot online"></span>
                </div>
                <div className="prediction-headline">{result.prediction}</div>
                {result.score !== undefined && (
                  <div className="score-meter">
                    <div className="score-label">Score Value: {result.score}</div>
                  </div>
                )}
                <p className="prediction-explanation">{result.details}</p>
                {result.timestamp && (
                  <div className="text-xs text-muted font-mono mt-2">
                    Inference at: {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
