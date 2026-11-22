import React, { useState } from 'react';
import { playCyberSound } from '../utils/audioFx';

export default function MediaPlaceholdersSection({ soundEnabled }) {
  const [customDroneVideo, setCustomDroneVideo] = useState(null);
  const [customOrthomosaic, setCustomOrthomosaic] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomDroneVideo(URL.createObjectURL(file));
      playCyberSound('success', soundEnabled);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomOrthomosaic(ev.target.result);
        playCyberSound('success', soundEnabled);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="media-section container" id="media-showcase">
      <div className="section-header-centered">
        <div className="badge-pill-bharat">
          <span>ड्रोन एवं उपग्रह मीडिया गैलरी</span>
          <span>•</span>
          <span>Drone & Satellite Media Center</span>
        </div>
        <h2 className="section-title">
          Ready for Your <span className="gradient-saffron">Drone Videos</span> &{' '}
          <span className="gradient-cyan">Orthomosaics</span>
        </h2>
        <p className="section-subtitle">
          Dedicated interactive media slots configured for high-res drone footage, satellite rasters, and GIS demo videos.
          Drop your files directly here or link your storage buckets.
        </p>
      </div>

      <div className="media-grid">
        {/* Slot 1: Drone Video Player */}
        <div className="media-card card">
          <div className="media-header">
            <span className="media-badge">Video Slot #1 • Drone Flyover</span>
            <span className="font-mono text-xs text-muted">4K 60FPS READY</span>
          </div>

          <div className="media-viewport">
            {customDroneVideo ? (
              <video
                src={customDroneVideo}
                controls
                autoPlay
                loop
                className="media-content-element"
              />
            ) : (
              <div className="placeholder-box">
                <div className="placeholder-icon">🛸</div>
                <h4>Drone Road & Building Survey Video</h4>
                <p className="text-xs text-muted">
                  Space reserved for your company drone footage. Click below to load your file or leave as interactive placeholder.
                </p>
                <label className="btn btn-saffron btn-xs mt-3 upload-label">
                  <span>📁 Load Your Drone Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="media-footer text-xs font-mono">
            <span>SURVEY: Western India Highway Corridor</span>
            <span className="text-cyan">Status: Video Ready</span>
          </div>
        </div>

        {/* Slot 2: High-Resolution Orthomosaic Image */}
        <div className="media-card card">
          <div className="media-header">
            <span className="media-badge badge-cyan">Raster Slot #2 • Satellite Orthomosaic</span>
            <span className="font-mono text-xs text-muted">5CM GSD RESOLUTION</span>
          </div>

          <div className="media-viewport">
            {customOrthomosaic ? (
              <img
                src={customOrthomosaic}
                alt="Custom Satellite Raster"
                className="media-content-element"
              />
            ) : (
              <div className="placeholder-box">
                <div className="placeholder-icon">🛰️</div>
                <h4>High-Resolution Satellite / Drone Orthomosaic</h4>
                <p className="text-xs text-muted">
                  Supports multi-gigabyte GeoTIFF, PNG, and JPEG imagery with georeferenced spatial tags.
                </p>
                <label className="btn btn-secondary btn-xs mt-3 upload-label">
                  <span>📁 Load Orthomosaic Image</span>
                  <input
                    type="file"
                    accept="image/*,.tif,.tiff"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="media-footer text-xs font-mono">
            <span>AREA: Indiranagar Ward 14, Bengaluru</span>
            <span className="text-green">Status: Raster Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
