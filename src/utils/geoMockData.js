// Geospatial & Infrastructure Mock Data for Indian Cities & Infrastructure

export const INDIAN_LOCATIONS = [
  {
    id: 'bengaluru',
    name: 'Bengaluru (ORR & Indiranagar)',
    state: 'Karnataka',
    coordinates: '12.9716° N, 77.5946° E',
    satelliteImg: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop',
    droneImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop',
    stats: {
      buildingsDetected: 1842,
      potholesCount: 38,
      potholeSeverityIndex: 7.4,
      roadCoverageKm: 46.2,
      encroachmentsFlagged: 12,
      greenCoverPct: 22.4
    },
    samplePotholes: [
      { id: 'BLR-P1', lat: 12.9782, lng: 77.6408, severity: 'Critical', depthCm: 7.2, road: '100ft Road Indiranagar' },
      { id: 'BLR-P2', lat: 12.9352, lng: 77.6245, severity: 'Moderate', depthCm: 4.1, road: 'Koramangala 80ft Road' },
      { id: 'BLR-P3', lat: 12.9165, lng: 77.6101, severity: 'High', depthCm: 5.8, road: 'Silk Board Junction Flyover Approach' }
    ]
  },
  {
    id: 'delhi',
    name: 'New Delhi (Ring Road & Dwarka Sector 12)',
    state: 'Delhi NCR',
    coordinates: '28.6139° N, 77.2090° E',
    satelliteImg: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&auto=format&fit=crop',
    droneImg: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop',
    stats: {
      buildingsDetected: 3210,
      potholesCount: 54,
      potholeSeverityIndex: 8.1,
      roadCoverageKm: 72.8,
      encroachmentsFlagged: 27,
      greenCoverPct: 18.2
    },
    samplePotholes: [
      { id: 'DEL-P1', lat: 28.5912, lng: 77.0421, severity: 'Critical', depthCm: 8.5, road: 'Dwarka Sector 12 Metro Underpass' },
      { id: 'DEL-P2', lat: 28.6328, lng: 77.2197, severity: 'Moderate', depthCm: 3.8, road: 'Barakhamba Road Outer Lane' },
      { id: 'DEL-P3', lat: 28.5678, lng: 77.2433, severity: 'High', depthCm: 6.4, road: 'Ring Road Lajpat Nagar Flyover' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai (Western Express Highway & Bandra)',
    state: 'Maharashtra',
    coordinates: '19.0760° N, 72.8777° E',
    satelliteImg: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop',
    droneImg: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1000&auto=format&fit=crop',
    stats: {
      buildingsDetected: 4120,
      potholesCount: 68,
      potholeSeverityIndex: 8.9,
      roadCoverageKm: 88.4,
      encroachmentsFlagged: 41,
      greenCoverPct: 14.8
    },
    samplePotholes: [
      { id: 'MUM-P1', lat: 19.0600, lng: 72.8361, severity: 'Critical', depthCm: 9.1, road: 'Bandra-Kurla Complex Connector' },
      { id: 'MUM-P2', lat: 19.1136, lng: 72.8697, severity: 'Critical', depthCm: 7.9, road: 'Andheri East WEH Junction' },
      { id: 'MUM-P3', lat: 19.0178, lng: 72.8478, severity: 'Moderate', depthCm: 4.5, road: 'Dadar TT Circle' }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Smart City Heritage & Ring Road)',
    state: 'Uttar Pradesh',
    coordinates: '25.3176° N, 82.9739° E',
    satelliteImg: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop',
    droneImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&auto=format&fit=crop',
    stats: {
      buildingsDetected: 2450,
      potholesCount: 31,
      potholeSeverityIndex: 6.8,
      roadCoverageKm: 38.6,
      encroachmentsFlagged: 19,
      greenCoverPct: 16.5
    },
    samplePotholes: [
      { id: 'VNS-P1', lat: 25.3216, lng: 82.9872, severity: 'Moderate', depthCm: 4.2, road: 'Godowlia Chowk Approach' },
      { id: 'VNS-P2', lat: 25.3541, lng: 82.9234, severity: 'Critical', depthCm: 6.7, road: 'Varanasi Ring Road Phase 1' }
    ]
  }
];

export const GEOAI_MODELS = [
  {
    id: 'building-extractor',
    title: 'Building Footprint Extractor (BharatNet-Seg)',
    category: 'Urban Planning & Municipal Tax',
    description: 'Deep learning instance segmentation trained on high-res Indian satellite & drone orthomosaics. Delineates complex roof shapes, encroachments, and density clusters.',
    accuracy: '98.7% IoU',
    latency: '115 ms',
    qgisExport: 'Shapefile, GeoJSON, GeoPackage',
    targetEndpoints: ['/api/v1/buildings/detect', '/api/v1/buildings/footprints']
  },
  {
    id: 'pothole-detector',
    title: 'Road Pothole & Distress Auditor (Marg-AI)',
    category: 'NHAI & PWD Infrastructure',
    description: 'YOLOv9 + Transformer model for automated road surface inspection. Detects potholes, alligator cracking, and rutting with cm-level depth estimation and GPS tagging.',
    accuracy: '97.4% mAP50',
    latency: '34 ms / frame',
    qgisExport: 'Point Layer Shapefile, Distress Heatmap WMS',
    targetEndpoints: ['/api/v1/potholes/predict', '/api/v1/roads/audit']
  },
  {
    id: 'green-canopy',
    title: 'Tree Canopy & Green Index (Vriksh-AI)',
    category: 'Environment & Smart Forest',
    description: 'Multi-spectral NDVI and canopy height modeler. Calculates tree density, urban heat island mitigation zones, and illegal felling alerts.',
    accuracy: '96.2%',
    latency: '140 ms',
    qgisExport: 'Raster GeoTIFF, Polygon Tree Vectors',
    targetEndpoints: ['/api/v1/green/canopy']
  },
  {
    id: 'water-encroachment',
    title: 'Water Body & Flood Inundation (Jal-Drishti)',
    category: 'Disaster Management & Water Resources',
    description: 'Monitors lake boundaries, seasonal shrinking, illegal buffer zone construction, and urban flood inundation levels during monsoon.',
    accuracy: '99.1%',
    latency: '180 ms',
    qgisExport: 'Hydrographic Vector Layer',
    targetEndpoints: ['/api/v1/water/lake-boundaries']
  }
];
