# 🛰️ Yantrikaran (यंत्रीकरण) — AI Geospatial Intelligence & QGIS Platform for Bharat 🇮🇳

> **Official Portal:** [www.yantrikaran.com](https://www.yantrikaran.com/)  
> **Reference GeoAI Architecture:** Inspired by [TerraLab AI](https://terra-lab.ai/) with deep **QGIS 3.x** native plugin integration and Indian infrastructure foundation models.

![Yantrikaran GeoAI](https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop)

---

## 🌟 Overview

**Yantrikaran** is a state-of-the-art **React 18 + Vite** geospatial intelligence platform engineered specifically for Indian cities, highways, and rural infrastructure.

The platform provides end-to-end computer vision and remote sensing tools for:
1. **Building Footprint Extraction (`BharatNet-Seg`)**: High-accuracy instance segmentation delineating roof boundaries, courtyard geometry, building counts, and municipal encroachment alerts.
2. **Road Distress & Pothole Auditing (`Marg-AI`)**: Sub-centimeter pavement condition auditing from vehicle dashcams, smartphones, and drone flyovers. Calculates Pavement Condition Index (PCI) and International Roughness Index (IRI).
3. **QGIS 3.x Certified Integration**: Seamless 1-click layer export directly to QGIS as Shapefiles (.shp), GeoJSON, and GeoPackage (.gpkg), plus a natural-language QGIS AI Copilot.
4. **Indian Infrastructure Solutions**: Tailored for Smart Cities Mission (Nagar Nigams), NHAI & PWD Highway Maintenance, SVAMITVA rural land mapping, and urban lake conservation.

---

## 🎨 Epic Visuals & GeoAI Animations

- **Geospatial Radar Canvas**: Interactive cosmic midnight grid with live latitude/longitude sweeps and pulsing Indian hub coordinates (Delhi, Bengaluru, Mumbai, Varanasi, Hyderabad).
- **Before / After Split Slider**: Real-time slider comparing raw drone orthomosaics with AI-segmented vector polygons.
- **Drone Vision Laser Sweep**: Neon cyan and saffron laser scanner sweep simulating active model inference.
- **Pothole Point Pins & Radar Pulses**: Interactive GPS-tagged road distress markers with depth, area, and remediation urgency metrics.
- **QGIS Desktop Mockup Window**: Interactive showcase showing layer trees, CRS attributes, and QGIS PyQGIS API bindings.
- **Web Audio API Sound Effects**: Acoustic feedback for scans, layer toggles, and API telemetry chimes.

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- **Node.js** (v18+)
- **npm**

### 2. Run React Frontend
```bash
# Clone the repository
git clone https://github.com/AnchitPandey02/frontend-website.git
cd frontend-website

# Install dependencies (already installed)
npm install

# Start Vite dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🐍 Backend Quickstart (FastAPI Python)

A full GeoAI backend with building extraction and pothole detection endpoints is provided in `backend_example.py`:

```bash
# Install Python dependencies
pip install fastapi uvicorn pydantic

# Start the GeoAI model server
uvicorn backend_example:app --reload --port 8000
```

Toggle off **Demo Simulation** in the top bar to route real-time inference directly to your FastAPI endpoints:
- `POST /api/v1/buildings/detect`
- `POST /api/v1/potholes/predict`

---

## 📁 Repository Structure

```
frontend-website/
├── index.html                           # Vite entry point
├── package.json                         # React 18, Vite & dependencies
├── backend_example.py                   # FastAPI GeoAI starter API
├── src/
│   ├── main.jsx                         # React root entry
│   ├── App.jsx                          # Main page assembly & state
│   ├── styles.css                       # Indian theme design system & animations
│   ├── utils/
│   │   ├── qgisLogo.jsx                 # Official QGIS SVG vector emblem
│   │   ├── geoMockData.js               # Indian city stats (BLR, DEL, MUM, VNS)
│   │   └── audioFx.js                   # Web Audio API radar sound effects
│   └── components/
│       ├── Navbar.jsx                   # Yantrikaran navbar & QGIS pill
│       ├── GeoRadarBackground.jsx       # Geospatial radar canvas background
│       ├── HeroSection.jsx              # Hero banner with India metrics
│       ├── GeoAIWorkbench.jsx           # Split-slider interactive model explorer
│       ├── PotholeRoadSection.jsx       # Dashcam & drone road distress scanner
│       ├── QgisIntegrationSection.jsx   # Dedicated QGIS plugin showcase
│       ├── IndianSolutionsSection.jsx   # Smart Cities, NHAI, SVAMITVA solutions
│       ├── MediaPlaceholdersSection.jsx # Slots for user drone videos & TIFFs
│       ├── BackendConnectionBar.jsx     # FastAPI / Flask API connector
│       ├── ContactSection.jsx           # Pilot booking form for municipalities
│       ├── Footer.jsx                   # Indian flag badge & portal links
│       └── ToastContainer.jsx           # Glassmorphic alert notifications
```

---

## 🛡️ License

MIT License &copy; 2026 [Yantrikaran Technologies](https://www.yantrikaran.com/). Proudly engineered in India 🇮🇳.
