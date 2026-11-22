import React from 'react';
import QgisLogo from '../utils/qgisLogo';

export default function Footer() {
  return (
    <footer className="footer yantrikaran-footer">
      <div className="container footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <img
              src="/yantrikaran-icon.png"
              alt="Yantrikaran Icon"
              className="footer-icon-img"
            />
            <span className="brand-wordmark-text">YANTRIKARAN</span>
          </div>
          <p className="footer-tagline">
            Automating Geospatial Intelligence & Infrastructure Vision
          </p>
          <div className="footer-company-link">
            <span>Official Portal: </span>
            <a href="https://www.yantrikaran.com/" target="_blank" rel="noreferrer" className="text-saffron">
              https://www.yantrikaran.com/
            </a>
          </div>
        </div>

        <div className="footer-qgis-badge">
          <QgisLogo width={28} height={28} />
          <div>
            <strong>QGIS Ecosystem Partner</strong>
            <div className="text-xs text-muted">Compatible with QGIS 3.22 - 3.36+ LTR</div>
          </div>
        </div>

        <div className="footer-right">
          <span className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Yantrikaran Technologies. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
