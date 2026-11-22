import React, { useState } from 'react';
import QgisLogo from '../utils/qgisLogo';

export default function Navbar({
  mockMode,
  baseUrl,
  soundEnabled,
  onToggleSound,
  onOpenContact
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'GeoAI Workbench', href: '#workbench' },
    { label: 'Building AI', href: '#buildings' },
    { label: 'Road & Potholes', href: '#potholes' },
    { label: 'QGIS Integration', href: '#qgis' },
    { label: 'Bharat Infrastructure', href: '#infrastructure' },
    { label: 'Backend API', href: '#backend' }
  ];

  return (
    <header className="navbar yantrikaran-navbar">
      {/* Brand Logo */}
      <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
        <div className="brand-icon-yantrikaran">
          {/* Indian Chakra / Sacred Geometry + Sat Vector Emblem */}
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#ff9933" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="20" cy="20" r="12" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
            <line x1="20" y1="2" x2="20" y2="38" stroke="rgba(255,153,51,0.5)" strokeWidth="1" />
            <line x1="2" y1="20" x2="38" y2="20" stroke="rgba(255,153,51,0.5)" strokeWidth="1" />
            <polygon points="20,8 24,18 32,20 24,22 20,32 16,22 8,20 16,18" fill="url(#saffronGlow)" />
            <defs>
              <linearGradient id="saffronGlow" x1="8" y1="8" x2="32" y2="32">
                <stop offset="0%" stopColor="#ff9933" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="brand-text">
          <div className="brand-main">
            <span className="brand-title-saffron">Yantrikaran</span>
            <span className="brand-hindi">यंत्रीकरण</span>
          </div>
          <span className="brand-tagline">AI Geospatial & Infrastructure Intelligence</span>
        </div>
      </div>

      {/* QGIS Official Partner Pill */}
      <div className="qgis-nav-badge" title="Official QGIS Plugin & Integration Partner">
        <QgisLogo width={20} height={20} />
        <span className="qgis-text">QGIS 3.x Certified</span>
      </div>

      {/* Mobile Menu Button */}
      <button
        className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* Connection status badge */}
        <div className="backend-status-pill" title="Connection status with your model backend">
          <span className={`status-dot ${mockMode ? 'warning' : 'online'}`}></span>
          <span className="status-text">{mockMode ? 'GeoAI Simulation' : `Live: ${baseUrl}`}</span>
        </div>

        {/* Audio FX Toggle */}
        <button
          className="btn icon-btn"
          onClick={onToggleSound}
          aria-label="Toggle Audio Feedback"
          title={soundEnabled ? 'Mute Radar Audio' : 'Enable Radar Audio'}
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
        </button>

        {/* Action Button */}
        <button className="btn btn-saffron btn-sm glowing-border-btn" onClick={onOpenContact}>
          <span>Schedule Pilot 🇮🇳</span>
        </button>
      </div>
    </header>
  );
}
