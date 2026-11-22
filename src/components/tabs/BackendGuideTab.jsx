import React from 'react';

export default function BackendGuideTab() {
  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">Backend Connection Guide</h2>
          <p className="section-subtitle">How to expose your Python AI/ML models so this frontend website can communicate with them.</p>
        </div>
      </div>

      <div className="guide-grid">
        {/* Option 1: FastAPI */}
        <div className="guide-card card">
          <div className="guide-header">
            <div className="guide-badge">Option 1 • Recommended</div>
            <h3>FastAPI Python Backend (Async & Fast)</h3>
          </div>
          <p className="guide-desc">FastAPI with CORSMiddleware makes connecting any PyTorch, Hugging Face, or scikit-learn model effortless.</p>
          <div className="code-wrapper">
            <pre className="code-block font-mono text-xs"><code>{`# 1. Install dependencies:
# pip install fastapi uvicorn pydantic

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="My AI Model API")

# Enable CORS for the frontend website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Or your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str
    temperature: float = 0.7

@app.get("/health")
def health_check():
    return {"status": "online", "model": "ready"}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    # Call your PyTorch / Transformers / Ollama model here!
    ai_response = f"Model received: '{req.prompt}'. Response generated."
    return {"reply": ai_response, "tokens": 42}

# Run with: uvicorn backend_example:app --reload --port 8000`}</code></pre>
          </div>
        </div>

        {/* Option 2: Flask */}
        <div className="guide-card card">
          <div className="guide-header">
            <div className="guide-badge badge-alt">Option 2</div>
            <h3>Flask Python Backend</h3>
          </div>
          <p className="guide-desc">Using classic Flask? Just add <code>flask-cors</code> to enable cross-origin requests from this web frontend.</p>
          <div className="code-wrapper">
            <pre className="code-block font-mono text-xs"><code>{`# 1. Install dependencies:
# pip install flask flask-cors

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    user_prompt = data.get('prompt', '')
    
    # Run your ML prediction logic
    return jsonify({
        "reply": f"Flask AI Response to: {user_prompt}",
        "confidence": 0.98
    })

if __name__ == '__main__':
    app.run(port=8000, debug=True)`}</code></pre>
          </div>
        </div>

        {/* Option 3: Ollama & LM Studio */}
        <div className="guide-card card">
          <div className="guide-header">
            <div className="guide-badge badge-alt" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              Option 3
            </div>
            <h3>Ollama & LM Studio (Local LLMs)</h3>
          </div>
          <p className="guide-desc">Run open-source weights (Llama 3, Mistral, DeepSeek, Gemma, Qwen) on your GPU with zero Python code needed!</p>
          <div className="code-wrapper">
            <pre className="code-block font-mono text-xs"><code>{`# 1. Start Ollama with CORS allowed:
# PowerShell:
$env:OLLAMA_ORIGINS="*"
ollama serve

# 2. In another terminal, pull any model:
ollama pull llama3
# (or mistral, phi3, deepseek-coder, etc.)

# 3. In NeuroHub Top Bar:
# Set Base URL: http://localhost:11434
# Set Route in NLP Playground: /api/generate
# Payload will route directly to Ollama!`}</code></pre>
          </div>
        </div>
      </div>

      {/* Common Pitfalls Card */}
      <div className="card tip-card">
        <h3>💡 Top Tips for Connecting Your AI Models:</h3>
        <ul className="tip-list">
          <li><strong>CORS (Cross-Origin Resource Sharing):</strong> Web browsers block cross-origin calls by default unless your backend includes the <code>Access-Control-Allow-Origin</code> header. Both code examples above already include CORS!</li>
          <li><strong>Localhost vs IP:</strong> If testing from mobile or another device, change <code>http://localhost:8000</code> in the top bar to your machine's local IP (e.g. <code>http://192.168.1.100:8000</code>).</li>
          <li><strong>Demo Simulation Mode:</strong> Leave the "Demo Simulation" toggle checked while tweaking your UI, then flip it off when your Python script is running!</li>
        </ul>
      </div>
    </section>
  );
}
