"""
=============================================================================
NeuroHub AI Studio — FastAPI Backend Template
=============================================================================
This starter server enables your custom Machine Learning and AI models
to communicate directly with your NeuroHub frontend website.

Requirements:
    pip install fastapi uvicorn pydantic

How to run:
    python backend_example.py
    (or: uvicorn backend_example:app --reload --port 8000)
=============================================================================
"""

import time
from typing import Dict, Any, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="NeuroHub AI Backend",
    description="Custom Machine Learning & Deep Learning Inference API",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# 1. Enable CORS (Cross-Origin Resource Sharing)
#    Required so your browser frontend (http://localhost:5500, file://, etc.)
#    can call your Python model backend without being blocked.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# 2. Health Check Endpoint
# ---------------------------------------------------------------------------
@app.get("/health")
def health_check():
    """Called by the frontend 'Ping Backend' button to test latency & status."""
    return {
        "status": "online",
        "service": "NeuroHub AI Backend",
        "timestamp": time.time()
    }


# ---------------------------------------------------------------------------
# 3. NLP & Chat / Text Generation Endpoint
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    prompt: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512
    system_prompt: Optional[str] = None

@app.post("/api/chat")
def chat_endpoint(payload: ChatRequest):
    """
    Connect your Hugging Face, PyTorch, llama.cpp, or Ollama model here!
    """
    user_prompt = payload.prompt
    
    # --- INSERT YOUR REAL MODEL INFERENCE HERE ---
    # e.g.:
    # output = my_nlp_pipeline(user_prompt, max_new_tokens=payload.max_tokens)
    # reply = output[0]['generated_text']

    reply = (
        f"[FastAPI Model Response]\n"
        f"Successfully processed your prompt: '{user_prompt}'\n"
        f"Inference parameters used: temp={payload.temperature}, max_tokens={payload.max_tokens}."
    )

    return {
        "reply": reply,
        "tokens": len(reply.split()),
        "status": "success"
    }


# ---------------------------------------------------------------------------
# 4. Computer Vision / Image Inference Endpoint
# ---------------------------------------------------------------------------
class VisionRequest(BaseModel):
    image: str  # Base64 encoded data URL or remote image URL

@app.post("/api/vision/predict")
def vision_endpoint(payload: VisionRequest):
    """
    Connect your YOLO, Torchvision, or OpenCV object detection/classification model here!
    """
    # In production, decode base64 string to PIL Image or numpy array:
    # import base64, io
    # from PIL import Image
    # header, encoded = payload.image.split(",", 1)
    # img_data = base64.b64decode(encoded)
    # img = Image.open(io.BytesIO(img_data))
    # results = yolo_model(img)

    return {
        "model": "YOLO-FastAPI-Server",
        "status": "success",
        "detections": [
            {"label": "Detected Subject", "confidence": 0.97, "box": [15, 20, 70, 65]},
            {"label": "Background Feature", "confidence": 0.81, "box": [5, 5, 40, 30]}
        ],
        "classes": [
            {"name": "Class A (Primary)", "score": 97.2},
            {"name": "Class B", "score": 81.4},
            {"name": "Class C", "score": 24.0}
        ]
    }


# ---------------------------------------------------------------------------
# 5. Tabular / Predictive ML Endpoint
# ---------------------------------------------------------------------------
class TabularRequest(BaseModel):
    features: Dict[str, Any]

@app.post("/api/tabular/predict")
def tabular_endpoint(payload: TabularRequest):
    """
    Connect your scikit-learn, XGBoost, LightGBM, or CatBoost model here!
    """
    features = payload.features

    # --- INSERT YOUR REAL MODEL INFERENCE HERE ---
    # e.g.:
    # import pandas as pd
    # df = pd.DataFrame([features])
    # pred = my_xgboost_model.predict(df)[0]

    return {
        "task": "prediction",
        "label": "MODEL PREDICTION SUCCESS",
        "isPositive": True,
        "prediction": "Confidence Score: 95.8%",
        "confidence": "High Certainty",
        "breakdown": [
            {"factor": "Primary Feature Weight", "contribution": "+68%"},
            {"factor": "Secondary Feature Weight", "contribution": "+27%"}
        ]
    }


# ---------------------------------------------------------------------------
# 6. Universal / Generic Inference Route
# ---------------------------------------------------------------------------
@app.post("/api/predict")
def generic_predict_endpoint(payload: Dict[str, Any]):
    """
    Universal receiver for arbitrary JSON model payloads.
    Used by the Universal API Console in the frontend website.
    """
    return {
        "status": "success",
        "service": "NeuroHub AI Backend",
        "timestamp": time.time(),
        "received_payload": payload,
        "prediction": {
            "output": "Model inference completed successfully",
            "confidence": 0.985,
            "classes": ["Class_A", "Class_B"]
        }
    }


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 Starting NeuroHub AI Backend Server on http://localhost:8000")
    print("💡 Open index.html in your browser and connect to this server!")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
