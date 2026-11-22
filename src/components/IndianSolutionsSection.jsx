import React from 'react';

export default function IndianSolutionsSection() {
  const solutions = [
    {
      icon: '🏛️',
      tag: 'Smart Cities & Municipal Corporations',
      title: 'Municipal Property Tax & Building Survey',
      desc: 'Automate GIS property tax mapping across urban local bodies. Detect unassessed building floors, illegal horizontal extensions, and terrace encroachments using high-res drone orthomosaics.',
      stats: '35% Average Increase in Property Tax Yield'
    },
    {
      icon: '🛣️',
      tag: 'Highway & Road Authorities',
      title: 'Automated Highway & Pothole Auditing',
      desc: 'Mount camera units on inspection vehicles. Run automated YOLOv9 frame inference to log every pothole, alligator crack, and pavement distress with GPS accuracy to verify maintenance compliance.',
      stats: '10x Faster Road Condition Inspections'
    },
    {
      icon: '🌾',
      tag: 'Rural & Village Infrastructure',
      title: 'Village & Abadi Land Drone Mapping',
      desc: 'Supports drone survey workflows for land demarcation. Automatically digitize home boundaries, open courtyards, and road access corridors for digital property verification.',
      stats: 'Sub-5cm Ground Sample Distance (GSD)'
    },
    {
      icon: '🌊',
      tag: 'Disaster Management & Water Bodies',
      title: 'Lake Encroachment & Flood Modeling',
      desc: 'Protect lakes, canals, and natural drainage paths. Monitor seasonal water body shrinkage, buffer zone construction violations, and predict urban waterlogging zones.',
      stats: 'Continuous Multi-Temporal Satellite Monitoring'
    }
  ];

  return (
    <section className="solutions-section container" id="infrastructure">
      <div className="section-header-centered">
        <div className="badge-pill-bharat">
          <span>Infrastructure Intelligence</span>
          <span>•</span>
          <span>Scalable Geospatial Solutions</span>
        </div>
        <h2 className="section-title">
          Mission-Ready GeoAI for <span className="gradient-saffron">Smart Cities</span> &{' '}
          <span className="gradient-cyan">Highways</span>
        </h2>
        <p className="section-subtitle">
          From metropolitan municipal corporations to regional roadways, Yantrikaran automates
          large-scale spatial data analysis with state-of-the-art vision models.
        </p>
      </div>

      <div className="solutions-grid">
        {solutions.map((s, idx) => (
          <div key={idx} className="solution-card card glowing-card">
            <div className="solution-icon-wrap">{s.icon}</div>
            <span className="solution-tag">{s.tag}</span>
            <h3 className="solution-title">{s.title}</h3>
            <p className="solution-desc">{s.desc}</p>
            <div className="solution-stats font-mono text-xs">
              <span className="stat-bullet">⚡</span>
              <span>{s.stats}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
