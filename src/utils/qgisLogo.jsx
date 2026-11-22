import React from 'react';

// Official QGIS Vector Logo SVG
export default function QgisLogo({ width = 32, height = 32, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      title="QGIS Official Integration"
    >
      {/* Background circle badge */}
      <circle cx="60" cy="60" r="58" fill="#1b2519" stroke="#589632" strokeWidth="3" />
      {/* QGIS Green Top Arc */}
      <path
        d="M60 18C41.2223 18 25.5 31.8431 22.4219 50H43.0859C45.698 43.1537 52.2743 38.3125 60 38.3125C67.7257 38.3125 74.302 43.1537 76.9141 50H97.5781C94.5 31.8431 78.7777 18 60 18Z"
        fill="#589632"
      />
      {/* QGIS Yellow-Green Bottom Arc */}
      <path
        d="M22.4219 70C25.5 88.1569 41.2223 102 60 102C78.7777 102 94.5 88.1569 97.5781 70H76.9141C74.302 76.8463 67.7257 81.6875 60 81.6875C52.2743 81.6875 45.698 76.8463 43.0859 70H22.4219Z"
        fill="#93b023"
      />
      {/* QGIS Arrow / Tail */}
      <path
        d="M48 48L78 78M78 78H58M78 78V58"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center glowing dot */}
      <circle cx="60" cy="60" r="8" fill="#ffffff" />
    </svg>
  );
}
