import React, { useState, useRef } from 'react';
import { INDIAN_LOCATIONS } from '../utils/geoMockData';
import QgisLogo from '../utils/qgisLogo';
import { playCyberSound } from '../utils/audioFx';

export default function GeoAIWorkbench({ soundEnabled, onInferenceRun }) {
  const [selectedLocation, setSelectedLocation] = useState(INDIAN_LOCATIONS[0]);
  const [activeModel, setActiveModel] = useState('buildings'); // 'buildings' | 'potholes' | 'green' | 'water'
  const [sliderPosition, setSliderPosition] = useState(50); // 0-100% split slider
  const [isScanning, setIsScanning] = useState(false);
  const [customImage, setCustomImage] = useState(null);

  // Layer Toggles
  const [showBuildings, setShowBuildings] = useState(true);
  const [showPotholes, setShowPotholes] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const fileInputRef = useRef(null);

  const handleLocationChange = (locId) => {
    const loc = INDIAN_LOCATIONS.find((l) => l.id === locId) || INDIAN_LOCATIONS[0];
    setSelectedLocation(loc);
    setCustomImage(null);
    playCyberSound('click', soundEnabled);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    playCyberSound('ping', soundEnabled);

    setTimeout(() => {
      setIsScanning(false);
      playCyberSound('success', soundEnabled);
      if (onInferenceRun) onInferenceRun(138);
    }, 1200);
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        playCyberSound('success', soundEnabled);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportGeoJson = () => {
    playCyberSound('click', soundEnabled);
    const data = {
      type: 'FeatureCollection',
      metadata: {
        platform: 'Yantrikaran AI',
        location: selectedLocation.name,
        coordinates: selectedLocation.coordinates,
        timestamp: new Date().toISOString()
      },
      features: [
        {
          type: 'Feature',
          properties: { type: 'building_footprint_summary', count: selectedLocation.stats.buildingsDetected },
          geometry: { type: 'Polygon', coordinates: [[[77.5946, 12.9716], [77.598, 12.9716], [77.598, 12.975], [77.5946, 12.975], [77.5946, 12.9716]]] }
        },
        ...selectedLocation.samplePotholes.map((p) => ({
          type: 'Feature',
          properties: { id: p.id, type: 'pothole', severity: p.severity, depthCm: p.depthCm, road: p.road },
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
        }))
      ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yantrikaran_${selectedLocation.id}_analysis.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentDisplayImage = customImage || selectedLocation.satelliteImg;

  return (
    <section className="workbench-section container" id="workbench">
      <div className="section-header-centered">
        <div className="badge-pill-bharat">
          <span>Interactive GeoAI Workbench</span>
          <span>•</span>
          <span>Building & Pothole Model Explorer</span>
        </div>
        <h2 className="section-title">
          Live Model Explorer: <span className="gradient-saffron">Buildings</span> &{' '}
          <span className="gradient-cyan">Potholes</span> Detection
        </h2>
        <p className="section-subtitle">
          Test real-time segmentation and road condition audits on high-resolution drone orthomosaics.
          Drag the split slider to compare raw aerial views with AI vector outputs.
        </p>
      </div>

      {/* Workbench Card */}
      <div className="workbench-card card glowing-card">
        {/* Top Controls Toolbar */}
        <div className="workbench-toolbar">
          {/* Model Selector Tabs */}
          <div className="model-tabs-group">
            <button
              className={`model-tab-btn ${activeModel === 'buildings' ? 'active' : ''}`}
              onClick={() => {
                setActiveModel('buildings');
                setShowBuildings(true);
                playCyberSound('click', soundEnabled);
              }}
            >
              🏢 Building Footprints
            </button>

            <button
              className={`model-tab-btn ${activeModel === 'potholes' ? 'active' : ''}`}
              onClick={() => {
                setActiveModel('potholes');
                setShowPotholes(true);
                playCyberSound('click', soundEnabled);
              }}
            >
              🕳️ Potholes & Road Cracks
            </button>

            <button
              className={`model-tab-btn ${activeModel === 'green' ? 'active' : ''}`}
              onClick={() => {
                setActiveModel('green');
                playCyberSound('click', soundEnabled);
              }}
            >
              🌳 Green Cover & Canopy
            </button>

            <button
              className={`model-tab-btn ${activeModel === 'water' ? 'active' : ''}`}
              onClick={() => {
                setActiveModel('water');
                playCyberSound('click', soundEnabled);
              }}
            >
              🌊 Water Body & Encroachment
            </button>
          </div>

          {/* Location Selector */}
          <div className="location-select-wrap">
            <span className="location-label">📍 Survey Area:</span>
            <select
              className="form-select location-dropdown"
              value={selectedLocation.id}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {INDIAN_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Interactive Map & Split Viewport */}
        <div className="map-viewport-wrapper">
          {/* Top Layer Toggles Bar */}
          <div className="layer-toggles-bar">
            <span className="layer-title">Active AI Layers:</span>
            <label className="layer-toggle-chip">
              <input
                type="checkbox"
                checked={showBuildings}
                onChange={(e) => setShowBuildings(e.target.checked)}
              />
              <span className="dot orange"></span>
              <span>Building Vectors ({selectedLocation.stats.buildingsDetected})</span>
            </label>

            <label className="layer-toggle-chip">
              <input
                type="checkbox"
                checked={showPotholes}
                onChange={(e) => setShowPotholes(e.target.checked)}
              />
              <span className="dot red"></span>
              <span>Potholes ({selectedLocation.stats.potholesCount})</span>
            </label>

            <label className="layer-toggle-chip">
              <input
                type="checkbox"
                checked={showRoads}
                onChange={(e) => setShowRoads(e.target.checked)}
              />
              <span className="dot cyan"></span>
              <span>Road Centrelines</span>
            </label>

            <label className="layer-toggle-chip">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
              />
              <span className="dot purple"></span>
              <span>Distress Heatmap</span>
            </label>

            {/* Run Inference Button */}
            <button
              className="btn btn-saffron btn-xs ml-auto"
              onClick={handleRunScan}
              disabled={isScanning}
            >
              {isScanning ? '⚡ AI Scanning Drone Mesh...' : '🔄 Re-Run Inference'}
            </button>
          </div>

          {/* Interactive Split Viewport (Before / After Slider) */}
          <div className="split-image-container">
            {/* Raw Satellite Base Image */}
            <img
              src={currentDisplayImage}
              alt="Raw Aerial Drone"
              className="base-satellite-img"
            />

            {/* AI Vectorized Overlay (Clipped by slider percentage) */}
            <div
              className="ai-overlay-clipped"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={currentDisplayImage}
                alt="AI Analysis"
                className="ai-overlay-img"
              />

              {/* Laser Scanline when running */}
              {isScanning && <div className="vision-scanline"></div>}

              {/* SVG Vector Layer Overlays */}
              <svg className="vector-svg-overlay" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {/* Simulated Building Polygons */}
                {showBuildings && (
                  <g className="building-polygons-group">
                    <polygon points="120,80 240,65 260,190 140,210" className="poly-building" />
                    <polygon points="280,70 410,50 430,170 300,185" className="poly-building" />
                    <polygon points="460,60 590,45 610,165 480,180" className="poly-building" />
                    <polygon points="640,55 780,40 800,160 660,175" className="poly-building" />
                    <polygon points="130,240 250,225 270,360 150,375" className="poly-building" />
                    <polygon points="290,230 420,210 440,350 310,370" className="poly-building" />
                    <polygon points="470,220 600,205 620,345 490,360" className="poly-building" />
                    <polygon points="650,210 790,195 810,335 670,350" className="poly-building" />
                    <polygon points="160,410 280,395 300,530 180,545" className="poly-building" />
                    <polygon points="320,400 450,380 470,520 340,540" className="poly-building" />
                    <polygon points="500,390 630,375 650,515 520,530" className="poly-building" />
                  </g>
                )}

                {/* Road Line */}
                {showRoads && (
                  <path
                    d="M 50,290 C 300,270 650,285 950,270"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="8 6"
                    opacity="0.8"
                  />
                )}

                {/* Heatmap Layer */}
                {showHeatmap && (
                  <rect
                    x="0"
                    y="0"
                    width="1000"
                    height="600"
                    fill="url(#distressHeatmapGrad)"
                    opacity="0.35"
                  />
                )}

                <defs>
                  <radialGradient id="distressHeatmapGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              {/* Pothole Point Markers with Live Tooltips */}
              {showPotholes && (
                <div className="pothole-markers-layer">
                  {selectedLocation.samplePotholes.map((p, idx) => {
                    const topPct = 42 + idx * 7 + (idx % 2 === 0 ? -4 : 6);
                    const leftPct = 25 + idx * 24;
                    return (
                      <div
                        key={p.id}
                        className="pothole-pin"
                        style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                        title={`[${p.id}] ${p.road} - Depth: ${p.depthCm}cm`}
                      >
                        <span className="pin-pulse"></span>
                        <span className="pin-core">!</span>
                        <div className="pin-tooltip">
                          <strong>{p.id}</strong> • {p.severity} Pothole
                          <div>Depth: {p.depthCm} cm</div>
                          <div className="font-mono text-xs">{p.road}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vector Badge */}
              <div className="view-mode-badge ai-badge">
                <span>🤖 AI Segmented Vectors & Detection</span>
              </div>
            </div>

            {/* Raw Satellite Badge */}
            <div className="view-mode-badge raw-badge">
              <span>🛰️ Raw Drone Orthomosaic</span>
            </div>

            {/* Split Slider Draggable Divider Handle */}
            <div
              className="split-slider-line"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="split-slider-handle">
                <span>◀ ▶</span>
              </div>
            </div>

            {/* Range Slider for Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="slider-range-input"
              aria-label="Before and After Split Slider"
            />
          </div>

          {/* GPS Coordinates & Scale Bar */}
          <div className="viewport-footer-meta">
            <span className="meta-item">
              <strong>GPS:</strong> {selectedLocation.coordinates}
            </span>
            <span className="meta-item">
              <strong>Resolution:</strong> 5cm GSD (Drone Survey)
            </span>
            <span className="meta-item">
              <strong>QGIS CRS:</strong> EPSG:4326 (WGS 84)
            </span>
            <button
              className="meta-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Upload Custom Drone TIFF / Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.tif,.tiff"
              className="hidden"
              onChange={handleCustomFileUpload}
            />
          </div>
        </div>

        {/* Live GIS Telemetry Dashboard */}
        <div className="telemetry-dashboard-grid">
          <div className="telemetry-box">
            <div className="box-title">Total Buildings</div>
            <div className="box-val text-saffron font-mono">
              {selectedLocation.stats.buildingsDetected.toLocaleString()}
            </div>
            <div className="box-sub">Polygons Vectorized</div>
          </div>

          <div className="telemetry-box">
            <div className="box-title">Potholes Detected</div>
            <div className="box-val text-red font-mono">
              {selectedLocation.stats.potholesCount}
            </div>
            <div className="box-sub">Avg Depth: 5.8 cm</div>
          </div>

          <div className="telemetry-box">
            <div className="box-title">Pothole Severity</div>
            <div className="box-val text-gold font-mono">
              {selectedLocation.stats.potholeSeverityIndex} / 10
            </div>
            <div className="box-sub">Critical Remediation Needed</div>
          </div>

          <div className="telemetry-box">
            <div className="box-title">Road Network</div>
            <div className="box-val text-cyan font-mono">
              {selectedLocation.stats.roadCoverageKm} km
            </div>
            <div className="box-sub">Surveyed & Classified</div>
          </div>

          <div className="telemetry-box">
            <div className="box-title">Encroachments</div>
            <div className="box-val text-purple font-mono">
              {selectedLocation.stats.encroachmentsFlagged}
            </div>
            <div className="box-sub">Buffer Violations Flagged</div>
          </div>
        </div>

        {/* Export & QGIS Integration Bar */}
        <div className="workbench-export-bar">
          <div className="export-left">
            <QgisLogo width={26} height={26} />
            <div>
              <strong>Instant GIS Export:</strong>
              <span className="text-muted text-sm ml-2">Direct output compatible with QGIS 3.x, ArcGIS, and PostGIS</span>
            </div>
          </div>

          <div className="export-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleExportGeoJson}>
              📥 Export GeoJSON
            </button>
            <a href="#qgis" className="btn btn-qgis btn-sm">
              <QgisLogo width={16} height={16} />
              <span>Load in QGIS Layer</span>
            </a>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                alert(`Generated comprehensive survey report for ${selectedLocation.name} (${selectedLocation.stats.buildingsDetected} buildings, ${selectedLocation.stats.potholesCount} potholes).`);
                playCyberSound('success', soundEnabled);
              }}
            >
              📄 Survey PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
