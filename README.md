# 🧠 NeuroHub AI Studio — React Edition

A sleek, cybernetic, production-ready **React 18 + Vite** frontend web dashboard designed to connect, test, benchmark, and showcase custom Machine Learning (ML) & Deep Learning (DL) models.

![NeuroHub AI Studio](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop)

---

## ⚡ Highlights & Features

### 🎨 Visuals & Epic Animations
- **Interactive Neural Background Canvas**: Real-time particle constellation with physics, synaptic connections, and interactive mouse gravity attraction.
- **Signal Oscilloscope Canvas**: Live waveform visualizer that pulses with increased frequency during active model inference.
- **3D Perspective Tilt Cards**: Interactive 3D gyroscopic rotation responding to cursor physics on model registry cards.
- **Typewriter Token Streaming**: Simulated token-by-token streaming with blinking cyan neon cursor (`⏹️ Stop` button included).
- **Computer Vision Laser Sweep**: Neon cyan laser scanline sweeping across preview images during vision inference.
- **Cybernetic Audio Synthesizer**: Web Audio API sci-fi synthesizer providing real-time acoustic feedback for clicks, token streams, success chimes, ping pings, and errors.
- **Theme Switcher**: Dark and Light themes with fluid CSS variables and state persistence.

### 🧪 Model Playgrounds & Workbenches
1. **Model Registry (`ModelsTab`)**: Register, monitor, launch, and manage custom endpoints with status indicators.
2. **NLP & Chat (`NlpTab`)**: Chat interface supporting streaming responses, quick prompt presets, system prompts, temperature and token controls, and endpoint overrides.
3. **Computer Vision (`VisionTab`)**: Drag-and-drop image uploader, sample image loader, URL fetcher, dynamic bounding box visualizer with confidence scores, and raw JSON inspector.
4. **Tabular Predictor (`TabularTab`)**: Interactive feature form with presets for Real Estate Pricing, Customer Churn, and Credit Scoring, plus dynamic field creation and probability gauges.
5. **Universal API Console (`ApiConsoleTab`)**: REST request runner supporting POST/GET/PUT, payload formatting, latency metrics, and one-click code generation for **Python**, **cURL**, and **JavaScript (fetch)**.
6. **Backend Integration Guide (`BackendGuideTab`)**: Ready-to-copy boilerplate templates for **FastAPI**, **Flask**, and local LLMs (**Ollama** & **LM Studio**).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/AnchitPandey02/frontend-website.git
cd frontend-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🐍 Backend Quickstart (FastAPI Example)

A complete FastAPI starter is included in `backend_example.py`.

```bash
# Install Python backend dependencies
pip install fastapi uvicorn pydantic

# Run the backend server
uvicorn backend_example:app --reload --port 8000
```

When your server is running, uncheck **Demo Simulation** in the top bar to route live requests directly to your backend!

---

## 📁 Project Architecture

```
frontend-website/
├── index.html                 # Vite HTML entry point
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── backend_example.py         # Complete FastAPI backend template
├── src/
│   ├── main.jsx               # React DOM entry
│   ├── App.jsx                # Main application state & tab routing
│   ├── styles.css             # Cyberpunk design system & keyframe animations
│   ├── components/
│   │   ├── Navbar.jsx             # Top bar navigation, sound & theme toggles
│   │   ├── HeroConnectionBar.jsx  # Connection inputs & backend presets
│   │   ├── TelemetryRibbon.jsx    # Real-time oscilloscope HUD & metrics
│   │   ├── NeuralBackground.jsx   # Interactive canvas particle network
│   │   ├── AddModelModal.jsx      # Modal for registering custom models
│   │   ├── ToastContainer.jsx     # Floating glassmorphic notifications
│   │   └── tabs/
│   │       ├── ModelsTab.jsx          # Model cards with 3D tilt
│   │       ├── NlpTab.jsx             # Chat & token streaming playground
│   │       ├── VisionTab.jsx          # Bounding box & laser scanner
│   │       ├── TabularTab.jsx         # Feature predictor & gauges
│   │       ├── ApiConsoleTab.jsx      # REST API tester & code exporter
│   │       └── BackendGuideTab.jsx    # Step-by-step backend instructions
│   └── utils/
│       ├── audioFx.js         # Web Audio API synthesizer
│       └── mockBackend.js     # Realistic offline simulation engine
└── dist/                      # Production build output
```

---

## 🛡️ License

MIT License &copy; 2026 Anchit Pandey.
