import React from 'react';
import QgisLogo from '../utils/qgisLogo';

export default function HeroSection() {
  return (
    <section className="hero-section hero-yantrikaran">
      <div className="hero-glow-saffron"></div>
      <div className="hero-glow-cyan"></div>

      <div className="container hero-content">
        {/* Flagship Badge */}
        <div className="badge-pill-bharat">
          <span className="badge-flag">📍</span>
          <span className="badge-text">
            <strong>Yantrikaran AI</strong> • Geospatial Foundation Models for Urban & Road Infrastructure
          </span>
          <span className="badge-live-dot"></span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading">
          Automating Infrastructure with{' '}
          <span className="gradient-saffron">Geospatial AI</span> &{' '}
          <span className="gradient-cyan">Drone Vision</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtext">
          Engineered for high-density urban environments and nationwide highways. Instantly detect{' '}
          <strong>every building footprint</strong>, identify <strong>potholes & road surface distress</strong>,
          and seamlessly synchronize with <strong>QGIS</strong> via our native plugin.
        </p>

        {/* Integrations Ribbon */}
        <div className="hero-integrations-bar">
          <div className="integration-chip">
            <QgisLogo width={22} height={22} />
            <span>Native QGIS 3.x Plugin</span>
          </div>
          <div className="integration-chip">
            <span className="chip-icon">🛰️</span>
            <span>Drone & High-Res Satellite</span>
          </div>
          <div className="integration-chip">
            <span className="chip-icon">🛣️</span>
            <span>Highway & Road Quality AI</span>
          </div>
          <div className="integration-chip">
            <span className="chip-icon">🏢</span>
            <span>Municipal Building Footprints</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hero-action-buttons">
          <a
            href="#workbench"
            className="btn btn-saffron btn-lg glowing-border-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>🚀 Launch GeoAI Workbench</span>
          </a>

          <a
            href="#qgis"
            className="btn btn-qgis btn-lg"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('qgis')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <QgisLogo width={22} height={22} />
            <span>Explore QGIS Plugin</span>
          </a>

          <a
            href="#backend"
            className="btn btn-outline btn-lg"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('backend')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>⚡ Connect Your Model API</span>
          </a>
        </div>

        {/* Real-Time Infrastructure Stats */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <span className="stat-number gradient-saffron">4.8M+</span>
            <span className="stat-label">Buildings Detected & Segmented</span>
            <span className="stat-sub">Across 42 Municipalities & Regions</span>
          </div>

          <div className="stat-card">
            <span className="stat-number gradient-cyan">140,000+</span>
            <span className="stat-label">Kilometres of Roads Audited</span>
            <span className="stat-sub">Potholes, Cracks & Roughness Index</span>
          </div>

          <div className="stat-card">
            <span className="stat-number text-green">99.2%</span>
            <span className="stat-label">Building IoU Precision</span>
            <span className="stat-sub">Trained on dense urban morphology</span>
          </div>

          <div className="stat-card">
            <span className="stat-number text-gold">&lt; 180ms</span>
            <span className="stat-label">Inference per Drone Tile</span>
            <span className="stat-sub">FastAPI / ONNX accelerated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
