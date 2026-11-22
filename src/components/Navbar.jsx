import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  onSelectTab,
  mockMode,
  baseUrl,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  onOpenAddModel
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'models', label: 'My Models' },
    { id: 'nlp', label: 'NLP & Chat' },
    { id: 'vision', label: 'Computer Vision' },
    { id: 'tabular', label: 'Predictions' },
    { id: 'tester', label: 'API Console' },
    { id: 'guide', label: 'Backend Guide' }
  ];

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => onSelectTab('models')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-title">NeuroHub</span>
          <span className="brand-tag">AI Studio</span>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectTab(item.id);
              setMobileMenuOpen(false);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        {/* Connection status badge */}
        <div className="backend-status-pill" title="Connection status with your model backend">
          <span className={`status-dot ${mockMode ? 'warning' : 'online'}`}></span>
          <span className="status-text">{mockMode ? 'Demo / Mock Mode' : `Connected: ${baseUrl}`}</span>
        </div>

        {/* Audio FX Toggle */}
        <button
          className="btn icon-btn"
          onClick={onToggleSound}
          aria-label="Toggle Cyber Sound Effects"
          title={soundEnabled ? 'Mute Sci-Fi Audio FX' : 'Enable Sci-Fi Audio FX'}
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle dark/light theme"
          title="Toggle Theme"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {/* Open Add Model Modal */}
        <button className="btn btn-primary btn-sm glowing-border-btn" onClick={onOpenAddModel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Model</span>
        </button>
      </div>
    </header>
  );
}
