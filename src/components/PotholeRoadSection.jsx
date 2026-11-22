import React, { useState } from 'react';
import { playCyberSound } from '../utils/audioFx';

export default function PotholeRoadSection({ soundEnabled }) {
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('all');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  const potholes = [
    { id: 'POT-101', road: 'NH-44 Outer Ring Road, Bengaluru', severity: 'Critical', depth: '8.4 cm', area: '1.2 m²', lat: '12.9782° N', lng: '77.6408° E', pciImpact: '-14 pts' },
    { id: 'POT-102', road: 'Western Express Highway, Andheri, Mumbai', severity: 'Critical', depth: '9.1 cm', area: '1.8 m²', lat: '19.1136° N', lng: '72.8697° E', pciImpact: '-18 pts' },
    { id: 'POT-103', road: 'Ring Road Lajpat Nagar Flyover, New Delhi', severity: 'Moderate', depth: '5.2 cm', area: '0.7 m²', lat: '28.5678° N', lng: '77.2433° E', pciImpact: '-8 pts' },
    { id: 'POT-104', road: 'Varanasi Ring Road Phase 1, Varanasi', severity: 'Critical', depth: '7.6 cm', area: '1.1 m²', lat: '25.3541° N', lng: '82.9234° E', pciImpact: '-12 pts' },
    { id: 'POT-105', road: 'Hosur Road Flyover Ramp, Bengaluru', severity: 'Minor', depth: '3.1 cm', area: '0.4 m²', lat: '12.9165° N', lng: '77.6101° E', pciImpact: '-4 pts' }
  ];

  const filteredPotholes = activeSeverityFilter === 'all'
    ? potholes
    : potholes.filter((p) => p.severity.toLowerCase() === activeSeverityFilter);

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoPlaying(true);
      playCyberSound('success', soundEnabled);
    }
  };

  return (
    <section className="pothole-section container" id="potholes">
      <div className="section-header-centered">
        <div className="badge-pill-bharat">
          <span>मार्ग-एआई</span>
          <span>•</span>
          <span>Marg-AI Road Infrastructure Engine</span>
        </div>
        <h2 className="section-title">
          Automated <span className="gradient-saffron">Pothole</span> &{' '}
          <span className="gradient-cyan">Road Distress</span> Detection
        </h2>
        <p className="section-subtitle">
          Turn vehicle dashcams, drone flyovers, and smartphone footage into sub-centimeter road quality audits.
          Automate Pavement Condition Index (PCI) and International Roughness Index (IRI) across Indian highways.
        </p>
      </div>

      <div className="pothole-layout-grid">
        {/* Left: Interactive Video & Drone Camera Viewport */}
        <div className="pothole-video-card card">
          <div className="card-header-flex">
            <div className="card-title-badge">
              <span className="live-dot-pulse"></span>
              <span>LIVE ROAD DISTRESS INFERENCE (YOLOv9-Geo)</span>
            </div>
            <span className="font-mono text-xs text-muted">FRAME: 1048 / 60 FPS</span>
          </div>

          {/* Video / Camera Viewport with Cyber Scanlines & Bounding Boxes */}
          <div className="road-viewport-container">
            {videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                className="road-video-element"
              />
            ) : (
              <div className="road-feed-mock">
                {/* Simulated Road Surface Inspection Image */}
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop"
                  alt="Road Inspection Feed"
                  className="road-bg-img"
                />

                {/* Laser Scanning Grid */}
                <div className="vision-scanline"></div>

                {/* Live Detected Bounding Box Overlay */}
                <div className="detection-box-overlay box-pothole-1">
                  <div className="det-label red font-mono">POTHOLE #101 [98.4%] • 8.4cm</div>
                  <div className="det-coords font-mono">12.9782°N, 77.6408°E</div>
                </div>

                <div className="detection-box-overlay box-crack-2">
                  <div className="det-label yellow font-mono">ALLIGATOR CRACK #102 [94.1%]</div>
                </div>

                <div className="detection-box-overlay box-manhole-3">
                  <div className="det-label cyan font-mono">MANHOLE RIM #103 • ALIGNED</div>
                </div>

                {/* HUD Telemetry Overlay */}
                <div className="hud-corner-topleft font-mono">
                  <div>SPEED: 42.6 km/h</div>
                  <div>SURFACE: BITUMEN (ASPHALT)</div>
                  <div>LATENCY: 22ms / FRAME</div>
                </div>

                <div className="hud-corner-bottomright font-mono">
                  <div className="pci-badge">PCI SCORE: 68 / 100 (FAIR)</div>
                </div>
              </div>
            )}
          </div>

          {/* Video Upload & Placeholder Controls */}
          <div className="video-upload-toolbar">
            <label className="btn btn-secondary btn-sm upload-video-label">
              <span>📹 Upload Dashcam / Drone Video</span>
              <input
                type="file"
                accept="video/*,image/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                alert('Testing demo video stream at 60 FPS...');
                playCyberSound('ping', soundEnabled);
              }}
            >
              🔄 Test Sample Drone Stream
            </button>
            <span className="text-xs text-muted">Supports MP4, WebM, MOV, and 4K Drone GeoTIFFs</span>
          </div>
        </div>

        {/* Right: Detected Potholes Log & Severity Priorities */}
        <div className="pothole-log-card card">
          <div className="log-header">
            <h3>Infrastructure Distress Log</h3>
            {/* Filter Pills */}
            <div className="filter-pills-row">
              <button
                className={`filter-pill ${activeSeverityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveSeverityFilter('all')}
              >
                All ({potholes.length})
              </button>
              <button
                className={`filter-pill ${activeSeverityFilter === 'critical' ? 'active' : ''}`}
                onClick={() => setActiveSeverityFilter('critical')}
              >
                Critical (3)
              </button>
              <button
                className={`filter-pill ${activeSeverityFilter === 'moderate' ? 'active' : ''}`}
                onClick={() => setActiveSeverityFilter('moderate')}
              >
                Moderate (1)
              </button>
            </div>
          </div>

          {/* List of Detected Potholes */}
          <div className="potholes-list-scroll">
            {filteredPotholes.map((p) => (
              <div key={p.id} className={`pothole-list-item ${p.severity.toLowerCase()}`}>
                <div className="item-main">
                  <div className="item-top">
                    <span className="item-id font-mono">{p.id}</span>
                    <span className={`severity-tag ${p.severity.toLowerCase()}`}>
                      {p.severity}
                    </span>
                    <span className="impact-tag font-mono">{p.pciImpact}</span>
                  </div>
                  <div className="item-road">{p.road}</div>
                  <div className="item-metrics font-mono text-xs">
                    <span>Depth: <strong>{p.depth}</strong></span>
                    <span>Area: <strong>{p.area}</strong></span>
                    <span>GPS: {p.lat}, {p.lng}</span>
                  </div>
                </div>

                <button
                  className="btn-locate"
                  title="Locate on Map / QGIS"
                  onClick={() => {
                    alert(`Locating ${p.id} at GPS ${p.lat}, ${p.lng} in QGIS.`);
                    playCyberSound('click', soundEnabled);
                  }}
                >
                  📍 Locate
                </button>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="audit-summary-box">
            <div className="summary-col">
              <span className="summary-label">Remediation Cost Est.:</span>
              <span className="summary-val text-saffron">₹ 4.85 Lakh</span>
            </div>
            <div className="summary-col">
              <span className="summary-label">NHAI Priority:</span>
              <span className="summary-val text-red">High Urgency</span>
            </div>
            <button
              className="btn btn-saffron btn-sm"
              onClick={() => {
                alert('Exporting Work Order GeoJSON with contractor repair coordinates...');
                playCyberSound('success', soundEnabled);
              }}
            >
              📥 Generate PWD Work Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
