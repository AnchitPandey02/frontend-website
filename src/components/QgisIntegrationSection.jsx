import React, { useState } from 'react';
import QgisLogo from '../utils/qgisLogo';
import { playCyberSound } from '../utils/audioFx';

export default function QgisIntegrationSection({ soundEnabled }) {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <section className="qgis-section container" id="qgis">
      <div className="section-header-centered">
        <div className="qgis-badge-hero">
          <QgisLogo width={36} height={36} />
          <span>Official QGIS Plugin Ecosystem Partner</span>
        </div>
        <h2 className="section-title">
          Deep <span className="gradient-qgis">QGIS Integration</span> — AI Inside Your Desktop GIS
        </h2>
        <p className="section-subtitle">
          Just like TerraLab, Yantrikaran brings state-of-the-art computer vision and foundation GeoAI directly
          into QGIS 3.x. No heavy GPU requirements on your machine — our cloud API does the heavy lifting.
        </p>
      </div>

      <div className="qgis-showcase-grid">
        {/* Left: Interactive QGIS Plugin Capabilities */}
        <div className="qgis-features-card card">
          <div className="qgis-card-header">
            <div className="qgis-logo-title">
              <QgisLogo width={30} height={30} />
              <div>
                <h3 className="text-lg font-bold">Yantrikaran GeoAI Tools for QGIS</h3>
                <span className="text-xs text-muted">Version 2.4.0 • Compatible with QGIS 3.22 - 3.36+ (LTR)</span>
              </div>
            </div>
            <a
              href="https://plugins.qgis.org"
              target="_blank"
              rel="noreferrer"
              className="btn btn-qgis btn-xs"
            >
              📥 QGIS Plugin Repo &rarr;
            </a>
          </div>

          {/* Plugin Feature Tabs */}
          <div className="qgis-feature-tabs">
            <button
              className={`qgis-tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('assistant');
                playCyberSound('click', soundEnabled);
              }}
            >
              💬 AI Prompt Assistant
            </button>
            <button
              className={`qgis-tab-btn ${activeTab === 'segment' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('segment');
                playCyberSound('click', soundEnabled);
              }}
            >
              🏢 1-Click Building Vectorizer
            </button>
            <button
              className={`qgis-tab-btn ${activeTab === 'potholes' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('potholes');
                playCyberSound('click', soundEnabled);
              }}
            >
              🕳️ Pothole Point Shapefiles
            </button>
            <button
              className={`qgis-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('code');
                playCyberSound('click', soundEnabled);
              }}
            >
              🐍 PyQGIS API
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="qgis-tab-body">
            {activeTab === 'assistant' && (
              <div className="tab-pane-content">
                <h4>Natural Language Geospatial Copilot</h4>
                <p className="text-sm text-secondary">
                  Command QGIS using plain English or Hindi. The Yantrikaran AI Agent loads layers, segments objects,
                  styles vectors, and outputs print-ready layouts automatically.
                </p>
                <div className="prompt-example-box">
                  <div className="prompt-bubble user">
                    <span>👤 You:</span> "Delineate all building footprints in Bengaluru Ward 14 from my active Google Satellite raster, and calculate total built-up area in m²."
                  </div>
                  <div className="prompt-bubble ai">
                    <QgisLogo width={18} height={18} />
                    <span>🤖 Yantrikaran Agent:</span> "Detected 1,842 building polygons. Added new vector layer 'yantrikaran_buildings_wgs84'. Calculated attribute 'floor_area_sqm' with 98.7% confidence."
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'segment' && (
              <div className="tab-pane-content">
                <h4>Zero-Manual Tracing Remote Sensing</h4>
                <p className="text-sm text-secondary">
                  Eliminate tedious manual digitizing. Click any polygon bounding box on drone or satellite tiles
                  (XYZ, WMS, or local GeoTIFFs), and Yantrikaran automatically returns smoothed, orthogonalized shapefiles.
                </p>
                <ul className="qgis-check-list">
                  <li>✅ Automatic right-angle squaring for modern architectural buildings</li>
                  <li>✅ Complex pitched, tin-shed, and multi-tier terrace roof recognition</li>
                  <li>✅ Attribute table automatically populated with roof type & height estimates</li>
                </ul>
              </div>
            )}

            {activeTab === 'potholes' && (
              <div className="tab-pane-content">
                <h4>Seamless PWD & NHAI Road Shapefiles</h4>
                <p className="text-sm text-secondary">
                  Export surveyed potholes directly into QGIS point layers with embedded attributes (severity, depth in cm,
                  repair volume in m³, timestamp, and geo-tagged preview photograph).
                </p>
                <ul className="qgis-check-list">
                  <li>✅ Automatic color-coding by severity: Critical (Red), High (Orange), Moderate (Yellow)</li>
                  <li>✅ Export directly as ESRI Shapefile (.shp), GeoPackage (.gpkg), or GeoJSON</li>
                  <li>✅ Generate heatmaps and density rasters using built-in QGIS kernel density estimation</li>
                </ul>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="tab-pane-content">
                <h4>Python (PyQGIS) Developer SDK</h4>
                <div className="code-wrapper">
                  <pre className="code-block font-mono text-xs"><code>{`from yantrikaran_qgis import GeoAIClient

# Initialize Yantrikaran client with your local or cloud endpoint
client = GeoAIClient(endpoint="http://localhost:8000")

# Segment buildings from active QGIS raster layer
layer = iface.activeLayer()
vector_layer = client.detect_buildings(
    raster_layer=layer,
    model="bharatnet-seg-v2",
    min_area_sqm=15.0
)

# Add result directly into QGIS project
QgsProject.instance().addMapLayer(vector_layer)`}</code></pre>
                </div>
              </div>
            )}
          </div>

          {/* Installation Steps */}
          <div className="qgis-install-steps">
            <span className="font-bold text-xs uppercase text-muted">How to Install in QGIS:</span>
            <div className="steps-row font-mono text-xs">
              <span>1. Plugins &rarr; Manage and Install Plugins</span>
              <span>2. Search <strong>"Yantrikaran"</strong></span>
              <span>3. Click <strong>Install Plugin</strong></span>
            </div>
          </div>
        </div>

        {/* Right: QGIS Desktop Mockup Card */}
        <div className="qgis-mockup-card card">
          <div className="qgis-window-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="window-title font-mono text-xs">
              QGIS Desktop 3.34-LTR — [Yantrikaran_Bengaluru_Survey.qgz]
            </div>
            <QgisLogo width={18} height={18} />
          </div>

          <div className="qgis-window-body">
            {/* Left Layers Panel */}
            <div className="qgis-layers-panel font-mono text-xs">
              <div className="layers-header">LAYERS</div>
              <div className="layer-entry active">
                <input type="checkbox" defaultChecked readOnly />
                <span className="layer-color-indicator red"></span>
                <span>potholes_critical (38)</span>
              </div>
              <div className="layer-entry active">
                <input type="checkbox" defaultChecked readOnly />
                <span className="layer-color-indicator orange"></span>
                <span>buildings_polygons (1,842)</span>
              </div>
              <div className="layer-entry active">
                <input type="checkbox" defaultChecked readOnly />
                <span className="layer-color-indicator cyan"></span>
                <span>nh44_road_centrelines</span>
              </div>
              <div className="layer-entry">
                <input type="checkbox" defaultChecked readOnly />
                <span className="layer-color-indicator gray"></span>
                <span>drone_orthomosaic_5cm.tif</span>
              </div>
            </div>

            {/* Canvas Viewport inside QGIS Mockup */}
            <div className="qgis-canvas-view">
              <img
                src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop"
                alt="QGIS Map Canvas"
                className="qgis-canvas-img"
              />

              {/* Simulated Vector Overlay in QGIS */}
              <div className="qgis-hud-stamp font-mono">
                <div>SCALE: 1:2500</div>
                <div>CRS: EPSG:4326</div>
                <div className="text-saffron">AI AGENT: READY</div>
              </div>
            </div>
          </div>

          <div className="qgis-window-footer font-mono text-xs">
            <span>Coordinate: 12.9716° N, 77.5946° E</span>
            <span className="text-qgis-green font-bold">✓ Yantrikaran QGIS Plugin Connected</span>
          </div>
        </div>
      </div>
    </section>
  );
}
