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
    { label: 'Building AI', href: '#workbench' },
    { label: 'Road & Potholes', href: '#potholes' },
    { label: 'QGIS Integration', href: '#qgis' },
    { label: 'Solutions', href: '#infrastructure' },
    { label: 'Backend API', href: '#backend' }
  ];

  return (
    <header className="navbar yantrikaran-navbar">
      {/* Brand Logo & Wordmark using provided icon & font */}
      <div
        className="nav-brand"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <img
          src="/yantrikaran-icon.png"
          alt="Yantrikaran Icon"
          className="brand-icon-img"
        />
        <div className="brand-text">
          <span className="brand-wordmark-text">YANTRIKARAN</span>
          <span className="brand-tagline">Geospatial AI & Infrastructure Intelligence</span>
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
          title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
        </button>

        {/* Action Button */}
        <button className="btn btn-saffron btn-sm glowing-border-btn" onClick={onOpenContact}>
          <span>Schedule Pilot</span>
        </button>
      </div>
    </header>
  );
}
