import React from 'react';

// Official QGIS Brand Image provided by user
export default function QgisLogo({ width, height = 24, className = '' }) {
  return (
    <img
      src="/qgis-wordmark.avif"
      alt="QGIS"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '3px'
      }}
      className={`qgis-wordmark-img ${className}`}
      title="QGIS Integration"
    />
  );
}
