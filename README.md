# 🧠 NeuroHub — AI Model Studio & Frontend Dashboard

A modern, responsive, developer-friendly frontend website designed specifically for connecting, showcasing, testing, and interacting with your custom Machine Learning and Deep Learning models.

Repository: [https://github.com/AnchitPandey02/frontend-website](https://github.com/AnchitPandey02/frontend-website)

---

## 🌟 Key Features

- **Interactive Neural Constellation Canvas**: Real-time particle network background that magnetically responds to cursor movement with dynamic synapse links and electric pulses.
- **Cybernetic HUD Telemetry Ribbon**: Displays live model engine state, real-time signal oscilloscope canvas waveform, throughput (~54 tokens/sec), latency stats, and total inference counters.
- **Sci-Fi Audio FX Synthesizer**: Zero-dependency procedural sound effects generated via browser Web Audio API (tactile clicks, streaming blips, success chords, and error alerts with mute toggle).
- **Streaming Typewriter Effect**: Natural word-by-word streaming animation with a glowing cyber cursor `▌` and real-time generation halt button (`⏹️ Stop`).
- **3D Card Perspective Tilt**: Interactive 3D physics tilt on model cards that tracks mouse motion with smooth spring-back.
- **Computer Vision Scanner Sweep**: Visual neon laser beam that scans uploaded images before drawing confidence bounding boxes and detection tags.
- **One-Click Backend Presets**: Instant configuration for FastAPI (:8000), Flask (:5000), Ollama (:11434), LM Studio (:1234), and vLLM (:8080).
- **Model Registry & Hub**: Register, organize, and monitor all your deployed model endpoints with live uptime pings and latency statistics.
- **NLP & Chat Playground**: Interactive conversational interface with parameter tuning (Temperature, Max Output Tokens, System Prompts), token counts, and latency tracking.
- **Tabular Feature Predictor**: Input dynamic features for scikit-learn, XGBoost, or regression/classification models (includes presets for Housing, Churn, and Credit).
- **Universal API Console**: Built-in REST / cURL tester to send custom JSON payloads to any ML endpoint, with live latency timers, status badges, and code snippet exports for Python, cURL, and JavaScript.
- **Demo Simulation Mode**: Includes a built-in offline simulation mode so the UI works out-of-the-box before your backend server is started.
- **Dark & Light Mode**: Sleek glassmorphism dark theme with neon purple/cyan accents and instant light mode toggle.
- **Zero Heavy Frontend Dependencies**: Written in clean semantic HTML5, modern CSS3, and ES6 JavaScript.

---

## 📁 Project Structure

```text
frontend-website/
├── index.html           # Main frontend interface & playgrounds
├── styles.css           # Glassmorphism design system & responsive styling
├── script.js            # Model state management, API requests, & simulation
├── backend_example.py   # Complete ready-to-run FastAPI Python backend
└── README.md            # Documentation & setup guide
```

---

## 🚀 How to Run the Frontend

You can run `index.html` directly:
1. Double-click `index.html` in your file explorer, OR
2. Right-click `index.html` in VS Code and select **Open with Live Server** (or open it with your favorite browser).

The website will load immediately in **Demo Simulation Mode**, allowing you to test every feature without any setup.

---

## 🔌 Connecting Your Real AI Models

### 1. Run the Included Python Starter Backend

A starter FastAPI backend is provided in `backend_example.py`.

```powershell
# 1. Install FastAPI & Uvicorn
pip install fastapi uvicorn pydantic

# 2. Run the server
python backend_example.py
```
Your backend will start on `http://localhost:8000`.

### 2. Connect in the Website

1. In the top bar of the website, confirm the **API BASE URL** is set to `http://localhost:8000`.
2. Click **⚡ Ping Backend** to verify the connection.
3. Uncheck the **Demo Simulation** toggle so your requests are routed directly to your Python backend!

### 3. Exposing Your Own Models (FastAPI Example)

To hook up your existing PyTorch, TensorFlow, Hugging Face, or scikit-learn models, add an endpoint with CORS enabled:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Required so the browser can make requests to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptInput(BaseModel):
    prompt: str

@app.post("/api/chat")
def generate_text(data: PromptInput):
    # Pass data.prompt into your AI model here:
    prediction = my_ai_model.generate(data.prompt)
    return {"reply": prediction}
```

---

## 🐙 Push to Your GitHub Repository

To commit your new frontend and push it to [https://github.com/AnchitPandey02/frontend-website](https://github.com/AnchitPandey02/frontend-website):

```powershell
# Navigate into the frontend-website directory
cd frontend-website

# Stage all files
git add .

# Commit changes
git commit -m "feat: implement AI Model Studio frontend with interactive playgrounds"

# Push to your main branch
git push origin main
```

---

## 🛠️ Supported Model Types
- **Large Language Models (LLMs)**: LLaMA, Mistral, Gemma, GPT, Falcon, custom transformers
- **Computer Vision**: YOLOv8/v9/v10, ResNet, EfficientNet, ViT, OpenCV pipelines
- **Tabular & Classical ML**: Scikit-learn, XGBoost, LightGBM, CatBoost, Random Forests
- **Speech & Audio**: Whisper, Speech-to-text, Audio classifiers
