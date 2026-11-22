import React, { useState } from 'react';

export default function AddModelModal({ isOpen, onClose, onAddModel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('nlp');
  const [method, setMethod] = useState('POST');
  const [endpoint, setEndpoint] = useState('/api/my-model/predict');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !endpoint.trim()) return;

    onAddModel({
      name: name.trim(),
      type,
      method,
      endpoint: endpoint.startsWith('/') ? endpoint.trim() : `/${endpoint.trim()}`,
      description: description.trim() || 'Custom connected AI endpoint.',
      status: 'online',
      lastPing: 'new'
    });

    // Reset and close
    setName('');
    setEndpoint('/api/my-model/predict');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Register New AI Model</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Model Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. YOLOv8 Object Detector"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-grid">
            <div className="form-row">
              <label>Category / Task</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="nlp">Natural Language Processing (NLP)</option>
                <option value="vision">Computer Vision</option>
                <option value="tabular">Tabular / Predictive ML</option>
                <option value="audio">Audio / Speech</option>
                <option value="custom">Custom / Other</option>
              </select>
            </div>

            <div className="form-row">
              <label>HTTP Method</label>
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>Endpoint Path</label>
            <input
              type="text"
              className="form-input"
              placeholder="/api/my-model/predict"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              required
            />
            <span className="param-hint">Will be appended to your base URL: e.g. http://localhost:8000/api/my-model/predict</span>
          </div>

          <div className="form-row">
            <label>Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief note about architecture, dataset, or purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save & Register Model</button>
          </div>
        </form>
      </div>
    </div>
  );
}
