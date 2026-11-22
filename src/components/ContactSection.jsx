import React, { useState } from 'react';
import { playCyberSound } from '../utils/audioFx';

export default function ContactSection({ soundEnabled }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    interest: 'buildings_potholes',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    playCyberSound('success', soundEnabled);
  };

  return (
    <section className="contact-section container" id="contact">
      <div className="contact-card card glowing-card">
        <div className="contact-grid">
          {/* Left Info */}
          <div className="contact-info">
            <div className="badge-pill-bharat">
              <span>Contact Us</span>
              <span>•</span>
              <span>Connect With Yantrikaran</span>
            </div>
            <h2 className="text-2xl font-bold mt-2">
              Transform Your Spatial Intelligence with <span className="gradient-saffron">Yantrikaran AI</span>
            </h2>
            <p className="text-secondary mt-3">
              Deploy our pre-trained foundation models for building footprint vectorization, automated pothole road inspections,
              or integrate directly into your enterprise <strong>QGIS</strong> workstations.
            </p>

            <div className="contact-highlights mt-4">
              <div className="highlight-item">
                <span className="highlight-icon">🏢</span>
                <div>
                  <strong>Enterprise & Municipal Pilot Programs</strong>
                  <p className="text-xs text-muted">Proof of concept pilots for Municipal Corporations, PWD & Highway authorities</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">🗺️</span>
                <div>
                  <strong>QGIS Custom Plugin Development</strong>
                  <p className="text-xs text-muted">Bespoke GIS algorithms, model training on your regional drone datasets</p>
                </div>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">🌐</span>
                <div>
                  <strong>Official Website</strong>
                  <p className="text-xs text-muted">
                    <a href="https://www.yantrikaran.com/" target="_blank" rel="noreferrer" className="text-saffron">
                      www.yantrikaran.com &rarr;
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="submitted-success-box">
                <div className="success-icon">✓</div>
                <h3>Your Pilot Request Has Been Received.</h3>
                <p className="text-sm text-secondary mt-2">
                  Our geospatial engineering team at <strong>Yantrikaran</strong> will review your survey requirements and connect with your team within 24 hours.
                </p>
                <button
                  className="btn btn-saffron btn-sm mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="yantrikaran-form">
                <div className="form-row">
                  <label>Your Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Alex Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <label>Work Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="alex@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <label>Organization / Department</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. City Planning / Highway Authority / Survey Firm"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <label>Primary AI Focus</label>
                  <select
                    className="form-select"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  >
                    <option value="buildings_potholes">Building Footprints & Pothole Audits (Combined)</option>
                    <option value="potholes_only">Pothole & Road Distress Scanner</option>
                    <option value="buildings_only">Municipal Building Footprint & Tax Mapping</option>
                    <option value="qgis_plugin">QGIS Plugin Enterprise Deployment</option>
                    <option value="custom_model">Custom Model Training on Drone Data</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Project Details / Survey Area (Optional)</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Tell us about your city, kilometer coverage, or specific drone sensors..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-saffron btn-block glowing-border-btn">
                  <span>Schedule GeoAI Pilot</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
