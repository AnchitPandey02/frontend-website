import React, { useRef } from 'react';

function ModelCard({ model, onLaunch, onDelete }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const badgeClass = model.type === 'vision' ? 'vision' : model.type === 'tabular' ? 'tabular' : '';

  return (
    <div
      ref={cardRef}
      className="model-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="model-card-header">
        <span className={`model-badge ${badgeClass}`}>{model.type}</span>
        <div className="model-status-indicator">
          <span className={`status-dot ${model.status === 'online' ? 'online' : 'offline'}`}></span>
          <span>{model.status}</span>
        </div>
      </div>

      <h3 className="model-name">{model.name}</h3>
      <p className="model-desc">{model.description}</p>

      <div className="model-meta">
        <span>Route: <code>{model.endpoint}</code></span>
        <span>{model.method || 'POST'}</span>
      </div>

      <div className="model-card-actions">
        <button
          className="btn btn-primary btn-sm flex-1"
          onClick={() => onLaunch(model.type)}
        >
          Launch Playground &rarr;
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => onDelete(model.id)}
          title="Remove Model"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default function ModelsTab({ models, onLaunchTab, onDeleteModel, onOpenAddModel, onRefresh }) {
  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">Connected AI Models</h2>
          <p className="section-subtitle">Manage model endpoints, verify uptime, and jump straight to corresponding playgrounds.</p>
        </div>
        <div className="section-actions">
          <button className="btn btn-outline btn-sm" onClick={onRefresh}>🔄 Refresh Status</button>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModel}>+ Register Model</button>
        </div>
      </div>

      <div className="models-grid">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onLaunch={onLaunchTab}
            onDelete={onDeleteModel}
          />
        ))}
      </div>
    </section>
  );
}
