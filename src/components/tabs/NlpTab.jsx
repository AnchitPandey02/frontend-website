import React, { useState, useRef, useEffect } from 'react';
import { simulateNlpResponse } from '../../utils/mockBackend';
import { playCyberSound } from '../../utils/audioFx';

export default function NlpTab({
  baseUrl,
  apiKey,
  mockMode,
  soundEnabled,
  onInferenceSuccess,
  setIsGeneratingTelemetry
}) {
  const [selectedModel, setSelectedModel] = useState('custom-llm');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome! Type a prompt below or pick a preset to test your NLP model. If your Python backend is active, queries will reach your model endpoint.'
    }
  ]);
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [latencyStat, setLatencyStat] = useState('--');
  const [tokensStat, setTokensStat] = useState('--');

  // Parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [customRoute, setCustomRoute] = useState('/api/chat');

  const streamAbortRef = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStop = () => {
    streamAbortRef.current = true;
    setIsGenerating(false);
    setIsGeneratingTelemetry(false);
  };

  const handleClear = () => {
    setMessages([]);
    playCyberSound('click', soundEnabled);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isGenerating) return;

    playCyberSound('click', soundEnabled);

    // Append user message
    const newMessages = [...messages, { sender: 'user', text: cleanPrompt }];
    setMessages(newMessages);
    setPrompt('');
    setIsGenerating(true);
    setIsGeneratingTelemetry(true);
    streamAbortRef.current = false;

    const startTime = performance.now();

    try {
      if (mockMode) {
        // Mock demo simulation
        await new Promise((r) => setTimeout(r, 200));
        const sim = simulateNlpResponse(cleanPrompt, selectedModel);
        const elapsed = Math.round(performance.now() - startTime);
        setLatencyStat(`${elapsed} ms`);
        setTokensStat(`${sim.tokens} tok`);
        onInferenceSuccess(elapsed);

        if (streamEnabled) {
          // Stream word by word
          let accumulatedText = '';
          const tempMsgIndex = newMessages.length;
          setMessages([...newMessages, { sender: 'assistant', text: '', isStreaming: true }]);

          for (let i = 0; i < sim.words.length; i++) {
            if (streamAbortRef.current) break;
            accumulatedText += (i === 0 ? '' : ' ') + sim.words[i];
            
            setMessages((prev) => {
              const updated = [...prev];
              updated[tempMsgIndex] = {
                sender: 'assistant',
                text: accumulatedText,
                isStreaming: true
              };
              return updated;
            });

            if (i % 2 === 0) playCyberSound('stream', soundEnabled);
            await new Promise((r) => setTimeout(r, 25));
          }

          // Complete streaming
          setMessages((prev) => {
            const updated = [...prev];
            updated[tempMsgIndex] = {
              sender: 'assistant',
              text: accumulatedText,
              isStreaming: false
            };
            return updated;
          });
          playCyberSound('success', soundEnabled);
        } else {
          // Instant append
          setMessages([...newMessages, { sender: 'assistant', text: sim.reply }]);
          playCyberSound('success', soundEnabled);
        }
      } else {
        // Real Backend Call
        const endpoint = `${baseUrl.replace(/\/$/, '')}${customRoute.startsWith('/') ? customRoute : `/${customRoute}`}`;
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            prompt: cleanPrompt,
            model: selectedModel,
            temperature: parseFloat(temperature),
            max_tokens: parseInt(maxTokens, 10),
            system_prompt: systemPrompt
          })
        });

        const elapsed = Math.round(performance.now() - startTime);
        setLatencyStat(`${elapsed} ms`);
        onInferenceSuccess(elapsed);

        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const replyText = data.reply || data.response || data.output || data.text || JSON.stringify(data, null, 2);
        setTokensStat(`${data.tokens || Math.round(replyText.length / 4)} tok`);

        setMessages([...newMessages, { sender: 'assistant', text: replyText }]);
        playCyberSound('success', soundEnabled);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: `⚠️ Inference Error: ${err.message}\nMake sure your backend is running at ${baseUrl} with CORS enabled, or enable Demo Simulation mode.`
        }
      ]);
      playCyberSound('error', soundEnabled);
    } finally {
      setIsGenerating(false);
      setIsGeneratingTelemetry(false);
    }
  };

  const quickPrompts = [
    { label: 'Sentiment Test', text: "Analyze the sentiment: 'The new inference pipeline delivers astounding 10x throughput and low latency!'" },
    { label: 'Explain Attention', text: "Explain how transformer attention heads work in 2 simple sentences." },
    { label: 'Entity Extraction', text: "Extract named entities and sentiment from: 'Google DeepMind announced new AI benchmarks in London on Monday.'" }
  ];

  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">NLP & Conversational Playground</h2>
          <p className="section-subtitle">Interact with LLMs, Sentiment Analyzers, Summarizers, or Custom Text Models.</p>
        </div>
        <div className="endpoint-badge">
          <span>Target:</span>
          <code>POST {customRoute}</code>
        </div>
      </div>

      <div className="playground-layout">
        {/* Chat & Prompt View */}
        <div className="playground-main card">
          <div className="chat-header">
            <div className="chat-model-select">
              <label>Active Model:</label>
              <select
                className="form-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="custom-llm">Custom LLM / Chatbot (FastAPI)</option>
                <option value="sentiment-model">Sentiment & Emotion Classifier</option>
                <option value="text-summarizer">Document Summarizer</option>
              </select>
            </div>
            <div className="chat-stats">
              <span className="stat-item">Latency: {latencyStat}</span>
              <span className="stat-item">Tokens: {tokensStat}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                <div className="msg-avatar">{msg.sender === 'user' ? '👤' : '🤖'}</div>
                <div className="msg-body">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  {msg.isStreaming && <span className="streaming-cursor"></span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="prompt-chips">
            <span className="chip-label">Quick Prompts:</span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                className="chip"
                onClick={() => setPrompt(qp.text)}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <textarea
              className="form-textarea"
              placeholder="Type a message or input text for your AI model... (Shift+Enter for new line)"
              rows="2"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              required
            />
            <div className="chat-input-actions">
              <label className="toggle-switch-sm" title="Streams token responses with realistic cyber typing animation">
                <input
                  type="checkbox"
                  checked={streamEnabled}
                  onChange={(e) => setStreamEnabled(e.target.checked)}
                />
                <span className="toggle-slider-sm"></span>
                <span className="toggle-label-sm">Streaming</span>
              </label>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleClear}
                title="Clear conversation"
              >
                Clear
              </button>

              {isGenerating && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleStop}
                  title="Halt generation"
                >
                  ⏹️ Stop
                </button>
              )}

              <button type="submit" className="btn btn-primary" disabled={isGenerating}>
                {isGenerating && <span className="btn-spinner"></span>}
                <span>Send to Model 🚀</span>
              </button>
            </div>
          </form>
        </div>

        {/* Hyperparameters Sidebar */}
        <aside className="playground-sidebar card">
          <h3 className="sidebar-title">Model Parameters</h3>

          <div className="param-group">
            <div className="param-header">
              <label>Temperature</label>
              <span className="param-val">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="form-range"
            />
            <span className="param-hint">Controls randomness (0 = deterministic, 1 = creative)</span>
          </div>

          <div className="param-group">
            <div className="param-header">
              <label>Max Output Tokens</label>
              <span className="param-val">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="64"
              max="2048"
              step="64"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
              className="form-range"
            />
            <span className="param-hint">Maximum length of the model output</span>
          </div>

          <div className="param-group">
            <label>System Prompt / Instructions</label>
            <textarea
              className="form-textarea text-xs"
              rows="3"
              placeholder="You are an expert, concise AI assistant."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          <div className="param-group">
            <label>Custom Route Override</label>
            <input
              type="text"
              className="form-input text-xs"
              value={customRoute}
              onChange={(e) => setCustomRoute(e.target.value)}
              placeholder="/api/chat or /predict"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
