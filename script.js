/**
 * NeuroHub AI Studio — Client Application Script
 * Connects frontend UI to Machine Learning & Deep Learning model endpoints.
 */

// ==========================================
// 1. APPLICATION STATE & PERSISTENCE
// ==========================================

const DEFAULT_MODELS = [
  {
    id: 'custom-llm',
    name: 'NeuralChat 7B',
    type: 'nlp',
    endpoint: '/api/chat',
    method: 'POST',
    description: 'Fine-tuned conversational text generation model for chat, reasoning, and summarization.',
    status: 'online',
    lastPing: '< 5ms'
  },
  {
    id: 'sentiment-model',
    name: 'DistilBERT Sentiment',
    type: 'nlp',
    endpoint: '/api/sentiment',
    method: 'POST',
    description: 'Classifies text sentiment (Positive, Negative, Neutral) with emotion scores.',
    status: 'online',
    lastPing: '< 5ms'
  },
  {
    id: 'yolo-vision',
    name: 'YOLOv8 Vision Detector',
    type: 'vision',
    endpoint: '/api/vision/predict',
    method: 'POST',
    description: 'Real-time multi-class object detection and bounding box visualizer.',
    status: 'online',
    lastPing: '< 10ms'
  },
  {
    id: 'house-price-regressor',
    name: 'Real Estate Price Estimator',
    type: 'tabular',
    endpoint: '/api/tabular/predict',
    method: 'POST',
    description: 'Gradient boosted ensemble (XGBoost) for tabular housing regression.',
    status: 'online',
    lastPing: '< 2ms'
  },
  {
    id: 'churn-classifier',
    name: 'Customer Churn Predictor',
    type: 'tabular',
    endpoint: '/api/tabular/churn',
    method: 'POST',
    description: 'Random Forest classifier assessing customer churn probability.',
    status: 'online',
    lastPing: '< 2ms'
  }
];

const state = {
  theme: localStorage.getItem('theme') || 'dark',
  mockMode: localStorage.getItem('mockMode') !== 'false',
  baseUrl: localStorage.getItem('baseUrl') || 'http://localhost:8000',
  apiKey: localStorage.getItem('apiKey') || '',
  activeTab: 'models',
  models: JSON.parse(localStorage.getItem('registeredModels')) || DEFAULT_MODELS,
  currentVisionImage: null,
  activeLanguageSnippet: 'python',
  chatHistory: [],
  soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
  inferencesCount: parseInt(localStorage.getItem('inferencesCount') || '0', 10),
  isGenerating: false,
  activeStreamAbort: null
};

// ==========================================
// 2. DOM ELEMENT REFERENCES
// ==========================================

const DOM = {
  // Theme & Global
  body: document.body,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  globalBaseUrl: document.getElementById('globalBaseUrl'),
  globalApiKey: document.getElementById('globalApiKey'),
  testConnectionBtn: document.getElementById('testConnectionBtn'),
  connectionSpinner: document.getElementById('connectionSpinner'),
  testConnectionLabel: document.getElementById('testConnectionLabel'),
  mockModeToggle: document.getElementById('mockModeToggle'),
  connectionStatusMsg: document.getElementById('connectionStatusMsg'),

  // Telemetry HUD
  hudEngineVal: document.getElementById('hudEngineVal'),
  hudSpeedVal: document.getElementById('hudSpeedVal'),
  hudLatencyVal: document.getElementById('hudLatencyVal'),
  hudCounterVal: document.getElementById('hudCounterVal'),
  telemetryWave: document.getElementById('telemetryWave'),

  // Navigation
  navLinks: document.querySelectorAll('.nav-link'),
  navLinksEl: document.getElementById('navLinks'),
  tabPanels: document.querySelectorAll('.tab-panel'),

  // Tab 1: Models
  modelsGrid: document.getElementById('modelsGrid'),
  refreshModelsBtn: document.getElementById('refreshModelsBtn'),
  openAddModelBtn: document.getElementById('openAddModelBtn'),
  quickAddBtn: document.getElementById('quickAddBtn'),
  addModelModal: document.getElementById('addModelModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  addModelForm: document.getElementById('addModelForm'),

  // Tab 2: NLP
  nlpModelSelect: document.getElementById('nlpModelSelect'),
  nlpEndpointDisplay: document.getElementById('nlpEndpointDisplay'),
  nlpCustomEndpoint: document.getElementById('nlpCustomEndpoint'),
  chatMessages: document.getElementById('chatMessages'),
  nlpForm: document.getElementById('nlpForm'),
  nlpPromptInput: document.getElementById('nlpPromptInput'),
  nlpSubmitBtn: document.getElementById('nlpSubmitBtn'),
  nlpSpinner: document.getElementById('nlpSpinner'),
  streamModeToggle: document.getElementById('streamModeToggle'),
  stopNlpBtn: document.getElementById('stopNlpBtn'),
  clearChatBtn: document.getElementById('clearChatBtn'),
  paramTemp: document.getElementById('paramTemp'),
  tempVal: document.getElementById('tempVal'),
  paramMaxTokens: document.getElementById('paramMaxTokens'),
  tokensVal: document.getElementById('tokensVal'),
  paramSystemPrompt: document.getElementById('paramSystemPrompt'),
  nlpLatencyStat: document.getElementById('nlpLatencyStat'),
  nlpTokensStat: document.getElementById('nlpTokensStat'),

  // Tab 3: Vision
  dropZone: document.getElementById('dropZone'),
  imageFileInput: document.getElementById('imageFileInput'),
  uploadIdle: document.getElementById('uploadIdle'),
  previewWrapper: document.getElementById('previewWrapper'),
  imagePreview: document.getElementById('imagePreview'),
  visionCanvas: document.getElementById('visionCanvas'),
  visionScanline: document.getElementById('visionScanline'),
  removeImgBtn: document.getElementById('removeImgBtn'),
  imageUrlInput: document.getElementById('imageUrlInput'),
  loadUrlBtn: document.getElementById('loadUrlBtn'),
  runVisionBtn: document.getElementById('runVisionBtn'),
  visionSpinner: document.getElementById('visionSpinner'),
  visionResults: document.getElementById('visionResults'),
  visionJsonRaw: document.getElementById('visionJsonRaw'),
  copyVisionJsonBtn: document.getElementById('copyVisionJsonBtn'),

  // Tab 4: Tabular
  featuresGrid: document.getElementById('featuresGrid'),
  tabularForm: document.getElementById('tabularForm'),
  tabularSpinner: document.getElementById('tabularSpinner'),
  runTabularBtn: document.getElementById('runTabularBtn'),
  resetFeaturesBtn: document.getElementById('resetFeaturesBtn'),
  addFeatureRowBtn: document.getElementById('addFeatureRowBtn'),
  tabularResultCard: document.getElementById('tabularResultCard'),

  // Tab 5: API Tester
  apiMethod: document.getElementById('apiMethod'),
  apiEndpointUrl: document.getElementById('apiEndpointUrl'),
  apiRequestBody: document.getElementById('apiRequestBody'),
  sendApiRequestBtn: document.getElementById('sendApiRequestBtn'),
  apiSpinner: document.getElementById('apiSpinner'),
  formatJsonBtn: document.getElementById('formatJsonBtn'),
  apiStatusCode: document.getElementById('apiStatusCode'),
  apiTimeElapsed: document.getElementById('apiTimeElapsed'),
  apiResponseBody: document.getElementById('apiResponseBody'),
  codeSnippetDisplay: document.getElementById('codeSnippetDisplay'),
  copyCodeSnippetBtn: document.getElementById('copyCodeSnippetBtn'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// 3. INITIALIZATION
// ==========================================

function initApp() {
  applyTheme(state.theme);
  DOM.globalBaseUrl.value = state.baseUrl;
  DOM.globalApiKey.value = state.apiKey;
  DOM.mockModeToggle.checked = state.mockMode;
  updateStatusIndicator();

  if (DOM.hudCounterVal) {
    DOM.hudCounterVal.textContent = state.inferencesCount;
  }
  updateSoundIcon();

  renderModelsGrid();
  renderTabularPreset('housing');
  setupEventListeners();
  updateCodeSnippet();

  // Initialize Epic UI Elements & FX
  initNeuralBackground();
  initTelemetryWave();
  init3DTilt();

  // Listen to hash changes in URL
  if (window.location.hash) {
    const tabName = window.location.hash.replace('#', '').replace('-playground', '');
    if (document.getElementById(`tab-${tabName}`)) {
      switchTab(tabName);
    }
  }
}

// ==========================================
// 4. THEME & GLOBAL CONNECTION LOGIC
// ==========================================

function applyTheme(theme) {
  DOM.body.setAttribute('data-theme', theme);
  DOM.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

function updateStatusIndicator() {
  if (state.mockMode) {
    DOM.statusDot.className = 'status-dot warning';
    DOM.statusText.textContent = 'Demo Simulation (Offline Ready)';
    DOM.connectionStatusMsg.innerHTML = '💡 Demo Simulation is <strong>ON</strong>. The UI generates realistic test outputs. Uncheck this when your local Python/FastAPI backend is running!';
  } else {
    DOM.statusDot.className = 'status-dot online';
    DOM.statusText.textContent = `Connected: ${state.baseUrl}`;
    DOM.connectionStatusMsg.innerHTML = `🚀 Routing requests directly to <code>${state.baseUrl}</code>. Ensure CORS is enabled on your server!`;
  }
}

// Test Connection with Backend
async function testBackendConnection() {
  const url = DOM.globalBaseUrl.value.trim().replace(/\/$/, '');
  state.baseUrl = url;
  localStorage.setItem('baseUrl', url);

  DOM.connectionSpinner.classList.remove('hidden');
  DOM.testConnectionLabel.textContent = 'Pinging...';
  DOM.testConnectionBtn.disabled = true;
  playCyberSound('ping');

  const startTime = performance.now();

  try {
    if (state.mockMode) {
      await new Promise(r => setTimeout(r, 350));
      const elapsed = Math.round(performance.now() - startTime);
      showToast(`⚡ Demo Simulation Active (${elapsed}ms latency simulated)`, 'success');
      DOM.statusDot.className = 'status-dot warning';
      DOM.statusText.textContent = 'Demo Simulation (Active)';
      if (DOM.hudLatencyVal) DOM.hudLatencyVal.textContent = `${elapsed} ms`;
      if (DOM.hudEngineVal) DOM.hudEngineVal.textContent = 'SIMULATION • ACTIVE';
      playCyberSound('success');
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Attempt health check or GET root
      const res = await fetch(`${url}/health`, {
        method: 'GET',
        headers: getRequestHeaders(),
        signal: controller.signal
      }).catch(async () => {
        // Fallback probe
        return await fetch(url, { method: 'GET', signal: controller.signal });
      });

      clearTimeout(timeoutId);
      const elapsed = Math.round(performance.now() - startTime);

      if (res && res.ok) {
        showToast(`✅ Backend Online! Connected to ${url} in ${elapsed}ms`, 'success');
        DOM.statusDot.className = 'status-dot online';
        DOM.statusText.textContent = `Online (${elapsed}ms)`;
        if (DOM.hudLatencyVal) DOM.hudLatencyVal.textContent = `${elapsed} ms`;
        if (DOM.hudEngineVal) DOM.hudEngineVal.textContent = 'FASTAPI • LIVE';
        playCyberSound('success');
      } else {
        showToast(`⚠️ Server responded with HTTP status ${res ? res.status : 'Error'}`, 'error');
        DOM.statusDot.className = 'status-dot warning';
        DOM.statusText.textContent = `Warning: HTTP ${res ? res.status : 'ERR'}`;
        playCyberSound('error');
      }
    }
  } catch (err) {
    showToast(`❌ Could not reach ${url}. Check if your backend is running & CORS is enabled.`, 'error');
    DOM.statusDot.className = 'status-dot offline';
    DOM.statusText.textContent = 'Backend Offline';
    if (DOM.hudEngineVal) DOM.hudEngineVal.textContent = 'OFFLINE';
    playCyberSound('error');
  } finally {
    DOM.connectionSpinner.classList.add('hidden');
    DOM.testConnectionLabel.textContent = '⚡ Ping Backend';
    DOM.testConnectionBtn.disabled = false;
  }
}

function getRequestHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.apiKey) {
    headers['Authorization'] = state.apiKey.startsWith('Bearer ') ? state.apiKey : `Bearer ${state.apiKey}`;
  }
  return headers;
}

// ==========================================
// 5. NAVIGATION & TAB SWITCHING
// ==========================================

function switchTab(tabId) {
  DOM.tabPanels.forEach(panel => {
    panel.classList.remove('active');
  });

  DOM.navLinks.forEach(link => {
    link.classList.remove('active');
  });

  const targetPanel = document.getElementById(`tab-${tabId}`);
  const targetLink = document.querySelector(`[data-tab-nav="${tabId}"]`);

  if (targetPanel) targetPanel.classList.add('active');
  if (targetLink) targetLink.classList.add('active');

  state.activeTab = tabId;
  window.history.replaceState(null, null, `#${tabId}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 6. TAB 1: MODELS MANAGEMENT
// ==========================================

function renderModelsGrid() {
  DOM.modelsGrid.innerHTML = '';

  state.models.forEach((model, index) => {
    const card = document.createElement('div');
    card.className = 'model-card';

    const badgeClass = model.type === 'vision' ? 'vision' : model.type === 'tabular' ? 'tabular' : '';

    card.innerHTML = `
      <div class="model-card-header">
        <span class="model-badge ${badgeClass}">${model.type}</span>
        <div class="model-status-indicator">
          <span class="status-dot ${model.status === 'online' ? 'online' : 'offline'}"></span>
          <span>${model.status}</span>
        </div>
      </div>
      <h3 class="model-name">${escapeHTML(model.name)}</h3>
      <p class="model-desc">${escapeHTML(model.description)}</p>
      <div class="model-meta">
        <span>Route: <code>${escapeHTML(model.endpoint)}</code></span>
        <span>${escapeHTML(model.method || 'POST')}</span>
      </div>
      <div class="model-card-actions">
        <button class="btn btn-primary btn-sm flex-1 open-model-btn" data-type="${model.type}" data-id="${model.id}">
          Launch Playground &rarr;
        </button>
        <button class="btn btn-outline btn-sm delete-model-btn" data-index="${index}" title="Remove Model">
          🗑️
        </button>
      </div>
    `;

    DOM.modelsGrid.appendChild(card);
  });

  // Attach buttons
  document.querySelectorAll('.open-model-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-type');
      if (type === 'nlp') switchTab('nlp');
      else if (type === 'vision') switchTab('vision');
      else if (type === 'tabular') switchTab('tabular');
      else switchTab('tester');
    });
  });

  document.querySelectorAll('.delete-model-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      state.models.splice(idx, 1);
      localStorage.setItem('registeredModels', JSON.stringify(state.models));
      renderModelsGrid();
      showToast('Model removed from registry', 'success');
    });
  });
}

function handleAddModelSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modelName').value.trim();
  const type = document.getElementById('modelType').value;
  const method = document.getElementById('modelMethod').value;
  const endpoint = document.getElementById('modelEndpoint').value.trim();
  const desc = document.getElementById('modelDescription').value.trim();

  if (!name || !endpoint) {
    showToast('Please provide both Model Name and Endpoint Path', 'error');
    return;
  }

  const newModel = {
    id: `custom-${Date.now()}`,
    name,
    type,
    method,
    endpoint: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
    description: desc || 'Custom connected AI endpoint.',
    status: 'online',
    lastPing: 'new'
  };

  state.models.unshift(newModel);
  localStorage.setItem('registeredModels', JSON.stringify(state.models));
  renderModelsGrid();

  DOM.addModelModal.classList.add('hidden');
  DOM.addModelForm.reset();
  showToast(`Registered "${name}" successfully!`, 'success');
}

// ==========================================
// 7. TAB 2: NLP & CHAT PLAYGROUND
// ==========================================

async function handleNlpSubmit(e) {
  e.preventDefault();
  const prompt = DOM.nlpPromptInput.value.trim();
  if (!prompt) return;

  playCyberSound('click');

  // Add User Message to Chat
  appendChatMessage('user', prompt);
  DOM.nlpPromptInput.value = '';

  // UI loading
  DOM.nlpSubmitBtn.disabled = true;
  DOM.nlpSpinner.classList.remove('hidden');
  state.isGenerating = true;

  const startTime = performance.now();
  const endpoint = DOM.nlpCustomEndpoint.value.trim() || '/api/chat';
  const temperature = parseFloat(DOM.paramTemp.value);
  const maxTokens = parseInt(DOM.paramMaxTokens.value, 10);
  const systemPrompt = DOM.paramSystemPrompt.value.trim();

  try {
    let responseText = '';
    let tokenCount = 0;

    if (state.mockMode) {
      // Realistic simulated AI response
      await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
      responseText = generateMockNlpResponse(prompt);
      tokenCount = Math.round(responseText.split(' ').length * 1.3);
    } else {
      const url = `${state.baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const payload = {
        prompt,
        temperature,
        max_tokens: maxTokens,
        system_prompt: systemPrompt
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      responseText = data.reply || data.output || data.response || data.text || JSON.stringify(data, null, 2);
      tokenCount = data.tokens || data.token_count || Math.round(responseText.length / 4);
    }

    const elapsed = Math.round(performance.now() - startTime);
    DOM.nlpLatencyStat.textContent = `Latency: ${elapsed}ms`;
    DOM.nlpTokensStat.textContent = `Tokens: ~${tokenCount}`;
    incrementInferences(elapsed);

    if (DOM.streamModeToggle && DOM.streamModeToggle.checked) {
      await streamChatMessage('model', responseText);
    } else {
      appendChatMessage('model', responseText);
      playCyberSound('success');
    }
  } catch (err) {
    appendChatMessage('model', `⚠️ Error communicating with model endpoint: ${err.message}. \n\nTip: If testing locally, make sure your server is running and has CORS enabled, or enable 'Demo Simulation' in the top bar.`);
    showToast('Failed to reach NLP endpoint', 'error');
    playCyberSound('error');
  } finally {
    DOM.nlpSubmitBtn.disabled = false;
    DOM.nlpSpinner.classList.add('hidden');
    state.isGenerating = false;
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }
}

let activeStreamInterval = null;

function streamChatMessage(sender, text) {
  return new Promise((resolve) => {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}-msg`;
    const avatar = sender === 'user' ? '👤' : '🤖';

    msgEl.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-body">
        <p class="stream-text"></p><span class="streaming-cursor"></span>
      </div>
    `;

    DOM.chatMessages.appendChild(msgEl);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;

    const streamP = msgEl.querySelector('.stream-text');
    const cursor = msgEl.querySelector('.streaming-cursor');
    const words = text.split(' ');
    let wordIdx = 0;

    if (DOM.stopNlpBtn) DOM.stopNlpBtn.classList.remove('hidden');

    function cleanup() {
      if (activeStreamInterval) {
        clearInterval(activeStreamInterval);
        activeStreamInterval = null;
      }
      if (cursor) cursor.remove();
      if (DOM.stopNlpBtn) DOM.stopNlpBtn.classList.add('hidden');
      state.activeStreamAbort = null;
      playCyberSound('success');
      resolve();
    }

    state.activeStreamAbort = cleanup;

    activeStreamInterval = setInterval(() => {
      if (wordIdx < words.length) {
        streamP.innerHTML += (wordIdx > 0 ? ' ' : '') + escapeHTML(words[wordIdx]).replace(/\n/g, '<br>');
        wordIdx++;
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
        if (wordIdx % 4 === 0) playCyberSound('stream');
      } else {
        cleanup();
      }
    }, 28);
  });
}

function appendChatMessage(sender, text) {
  const msgEl = document.createElement('div');
  msgEl.className = `message ${sender}-msg`;

  const avatar = sender === 'user' ? '👤' : '🤖';

  msgEl.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-body">
      <p>${escapeHTML(text).replace(/\n/g, '<br>')}</p>
    </div>
  `;

  DOM.chatMessages.appendChild(msgEl);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function generateMockNlpResponse(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('sentiment')) {
    return `Analysis Result:\n• Predicted Sentiment: POSITIVE (Confidence: 96.8%)\n• Emotion Vector: Joy (0.84), Optimism (0.71), Neutral (0.12)\n• Key Highlights: Strong descriptive terminology with constructive tone.`;
  }
  if (lower.includes('attention') || lower.includes('transformer')) {
    return `Transformer attention mechanisms dynamically weigh the relationship between every pair of tokens in a sequence regardless of distance. This enables the model to focus on the most contextually relevant words during generation.`;
  }
  if (lower.includes('extract') || lower.includes('entity')) {
    return `Extracted Entities:\n- Organization: Google DeepMind\n- Location: London\n- Date: Monday\n- Topic: AI Benchmarks`;
  }
  return `This is a simulated model output for: "${prompt}".\n\nYour custom AI model pipeline processed this input successfully. To connect your live weights, run your FastAPI or Flask script and toggle off "Demo Simulation" above!`;
}

// ==========================================
// 8. TAB 3: COMPUTER VISION PLAYGROUND
// ==========================================

function handleImageUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please upload a valid image file (JPG, PNG, WEBP)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    displayPreviewImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function displayPreviewImage(src) {
  state.currentVisionImage = src;
  DOM.imagePreview.src = src;
  DOM.uploadIdle.classList.add('hidden');
  DOM.previewWrapper.classList.remove('hidden');
  DOM.runVisionBtn.disabled = false;

  // Clear canvas
  const canvas = DOM.visionCanvas;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  DOM.visionJsonRaw.textContent = '{"status": "image_loaded", "action": "Click Run Inference"}';
}

function removePreviewImage() {
  state.currentVisionImage = null;
  DOM.imagePreview.src = '';
  DOM.uploadIdle.classList.remove('hidden');
  DOM.previewWrapper.classList.add('hidden');
  DOM.runVisionBtn.disabled = true;
  DOM.imageUrlInput.value = '';
  DOM.visionResults.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>Upload an image and run inference to see predicted classes, confidence scores, and detection boxes.</p>
    </div>
  `;
  DOM.visionJsonRaw.textContent = '{"status": "waiting_for_input"}';
}

async function runVisionInference() {
  if (!state.currentVisionImage) return;

  DOM.runVisionBtn.disabled = true;
  DOM.visionSpinner.classList.remove('hidden');
  if (DOM.visionScanline) DOM.visionScanline.classList.remove('hidden');
  state.isGenerating = true;
  playCyberSound('ping');

  const startTime = performance.now();

  try {
    let resultData = null;

    if (state.mockMode) {
      await new Promise(r => setTimeout(r, 850));
      resultData = generateMockVisionPredictions();
    } else {
      const url = `${state.baseUrl.replace(/\/$/, '')}/api/vision/predict`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ image: state.currentVisionImage })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      resultData = await res.json();
    }

    const elapsed = Math.round(performance.now() - startTime);
    renderVisionResults(resultData);
    drawBoundingBoxes(resultData.detections || []);
    incrementInferences(resultData.inference_time_ms || elapsed);
    playCyberSound('success');
    showToast('Vision inference completed!', 'success');
  } catch (err) {
    showToast(`Vision inference error: ${err.message}`, 'error');
    playCyberSound('error');
  } finally {
    DOM.runVisionBtn.disabled = false;
    DOM.visionSpinner.classList.add('hidden');
    if (DOM.visionScanline) DOM.visionScanline.classList.add('hidden');
    state.isGenerating = false;
  }
}

function generateMockVisionPredictions() {
  return {
    model: "YOLOv8-Custom-Detector",
    status: "success",
    inference_time_ms: 38,
    detections: [
      { label: "Golden Retriever / Pet", confidence: 0.96, box: [12, 18, 75, 70] },
      { label: "Collar / Accessory", confidence: 0.84, box: [38, 48, 22, 16] }
    ],
    classes: [
      { name: "Domestic Dog (Canis lupus)", score: 96.4 },
      { name: "Golden Retriever", score: 88.2 },
      { name: "Outdoor Grass", score: 45.1 }
    ]
  };
}

function renderVisionResults(data) {
  DOM.visionJsonRaw.textContent = JSON.stringify(data, null, 2);

  const classes = data.classes || (data.detections || []).map(d => ({ name: d.label, score: Math.round(d.confidence * 100) }));

  if (!classes.length) {
    DOM.visionResults.innerHTML = '<p class="text-muted text-sm">No confident detections found.</p>';
    return;
  }

  let html = '';
  classes.forEach(c => {
    const score = c.score || Math.round((c.confidence || 0) * 100);
    html += `
      <div class="prediction-item">
        <div class="prediction-label-row">
          <span>${escapeHTML(c.name || c.label)}</span>
          <span class="font-mono text-muted">${score}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${score}%"></div>
        </div>
      </div>
    `;
  });

  DOM.visionResults.innerHTML = html;
}

function drawBoundingBoxes(detections) {
  const img = DOM.imagePreview;
  const canvas = DOM.visionCanvas;
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  detections.forEach((det, i) => {
    if (!det.box) return;
    const [xPct, yPct, wPct, hPct] = det.box;
    const x = (xPct / 100) * canvas.width;
    const y = (yPct / 100) * canvas.height;
    const w = (wPct / 100) * canvas.width;
    const h = (hPct / 100) * canvas.height;

    // Box stroke
    ctx.strokeStyle = i === 0 ? '#6366f1' : '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Label tag
    ctx.fillStyle = i === 0 ? '#6366f1' : '#06b6d4';
    const labelText = `${det.label} (${Math.round(det.confidence * 100)}%)`;
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(labelText).width;
    ctx.fillRect(x, Math.max(0, y - 22), textWidth + 10, 22);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(labelText, x + 5, Math.max(15, y - 6));
  });
}

// ==========================================
// 9. TAB 4: TABULAR ML PLAYGROUND
// ==========================================

const TABULAR_PRESETS = {
  housing: [
    { name: 'SquareFootage', label: 'Square Footage (sq ft)', type: 'number', value: 2400 },
    { name: 'Bedrooms', label: 'Bedrooms Count', type: 'number', value: 4 },
    { name: 'Bathrooms', label: 'Bathrooms Count', type: 'number', value: 3 },
    { name: 'YearBuilt', label: 'Year Built', type: 'number', value: 2018 },
    { name: 'NeighborhoodQuality', label: 'Neighborhood Rating (1-10)', type: 'number', value: 8 },
    { name: 'GarageCars', label: 'Garage Capacity', type: 'number', value: 2 }
  ],
  churn: [
    { name: 'MonthlyCharges', label: 'Monthly Charges ($)', type: 'number', value: 65.5 },
    { name: 'TenureMonths', label: 'Tenure (Months)', type: 'number', value: 24 },
    { name: 'SupportTickets', label: 'Support Tickets Logged', type: 'number', value: 1 },
    { name: 'ContractType', label: 'Contract (0=Month, 1=Annual)', type: 'number', value: 1 }
  ],
  credit: [
    { name: 'AnnualIncome', label: 'Annual Income ($)', type: 'number', value: 85000 },
    { name: 'CreditScore', label: 'Credit Score (300-850)', type: 'number', value: 740 },
    { name: 'DebtToIncome', label: 'Debt-to-Income Ratio', type: 'number', value: 0.22 },
    { name: 'EmploymentYears', label: 'Years Employed', type: 'number', value: 6 }
  ]
};

let currentTabularPreset = 'housing';

function renderTabularPreset(presetKey) {
  currentTabularPreset = presetKey;
  const fields = TABULAR_PRESETS[presetKey] || TABULAR_PRESETS.housing;
  DOM.featuresGrid.innerHTML = '';

  fields.forEach(f => {
    addTabularFieldRow(f.name, f.label, f.value, f.type);
  });
}

function addTabularFieldRow(name, label, value, type = 'number') {
  const div = document.createElement('div');
  div.className = 'feature-field';
  div.innerHTML = `
    <label>${escapeHTML(label || name)}</label>
    <button type="button" class="feature-remove-btn" title="Remove field">&times;</button>
    <input type="${type}" name="${escapeHTML(name)}" value="${value !== undefined ? value : ''}" class="form-input" required>
  `;

  div.querySelector('.feature-remove-btn').addEventListener('click', () => {
    div.remove();
  });

  DOM.featuresGrid.appendChild(div);
}

async function handleTabularSubmit(e) {
  e.preventDefault();
  const formData = new FormData(DOM.tabularForm);
  const features = {};
  formData.forEach((val, key) => {
    features[key] = isNaN(val) ? val : parseFloat(val);
  });

  DOM.runTabularBtn.disabled = true;
  DOM.tabularSpinner.classList.remove('hidden');
  state.isGenerating = true;
  playCyberSound('click');

  const startTime = performance.now();

  try {
    let result = null;

    if (state.mockMode) {
      await new Promise(r => setTimeout(r, 550));
      result = generateMockTabularPrediction(currentTabularPreset, features);
    } else {
      const url = `${state.baseUrl.replace(/\/$/, '')}/api/tabular/predict`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ features })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      result = await res.json();
    }

    const elapsed = Math.round(performance.now() - startTime);
    renderTabularResult(result);
    incrementInferences(elapsed);
    playCyberSound('success');
    showToast('Prediction generated successfully!', 'success');
  } catch (err) {
    showToast(`Prediction failed: ${err.message}`, 'error');
    playCyberSound('error');
  } finally {
    DOM.runTabularBtn.disabled = false;
    DOM.tabularSpinner.classList.add('hidden');
    state.isGenerating = false;
  }
}

function generateMockTabularPrediction(preset, features) {
  if (preset === 'housing') {
    const sqft = features.SquareFootage || 2000;
    const base = sqft * 210 + (features.NeighborhoodQuality || 5) * 15000;
    return {
      task: 'regression',
      label: 'Estimated Market Value',
      prediction: `$${Math.round(base).toLocaleString()}`,
      confidence: 'R² 0.92 Model Fit',
      breakdown: [
        { factor: 'Base Size', contribution: '+72%' },
        { factor: 'Neighborhood Score', contribution: '+18%' },
        { factor: 'Rooms', contribution: '+10%' }
      ]
    };
  } else if (preset === 'churn') {
    const tickets = features.SupportTickets || 0;
    const churnProb = tickets > 3 ? 0.82 : 0.18;
    return {
      task: 'classification',
      label: churnProb > 0.5 ? 'HIGH CHURN RISK' : 'LOYAL / LOW RISK',
      isPositive: churnProb <= 0.5,
      prediction: `${Math.round(churnProb * 100)}% Churn Probability`,
      confidence: 'Confidence: 94.2%',
      breakdown: [
        { factor: 'Contract Type', contribution: 'Strong retention factor' },
        { factor: 'Support Volume', contribution: `${tickets} open tickets observed` }
      ]
    };
  } else {
    return {
      task: 'classification',
      label: 'LOAN APPROVED',
      isPositive: true,
      prediction: 'A+ Grade (Low Default Risk)',
      confidence: 'Confidence: 98.1%',
      breakdown: [
        { factor: 'Credit Rating', contribution: 'Optimal bracket (>700)' },
        { factor: 'DTI Ratio', contribution: 'Well below 0.36 threshold' }
      ]
    };
  }
}

function renderTabularResult(res) {
  const isPos = res.isPositive !== false;
  let html = `
    <div class="decision-badge ${isPos ? 'positive' : 'negative'}">
      ${escapeHTML(res.label || 'PREDICTION RESULT')}
    </div>
    <h2 style="margin: 0.5rem 0;">${escapeHTML(res.prediction)}</h2>
    <div class="confidence-metric">${escapeHTML(res.confidence || '')}</div>
  `;

  if (res.breakdown && res.breakdown.length) {
    html += '<div style="width: 100%; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; text-align: left;">';
    html += '<span class="text-xs uppercase font-bold text-muted">Feature Importance:</span>';
    res.breakdown.forEach(b => {
      html += `<div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-top: 0.3rem;">
        <span>${escapeHTML(b.factor)}</span>
        <strong class="font-mono text-muted">${escapeHTML(b.contribution)}</strong>
      </div>`;
    });
    html += '</div>';
  }

  DOM.tabularResultCard.innerHTML = html;
}

// ==========================================
// 10. TAB 5: UNIVERSAL API CONSOLE
// ==========================================

async function handleApiConsoleSubmit() {
  const method = DOM.apiMethod.value;
  const url = DOM.apiEndpointUrl.value.trim();
  const rawBody = DOM.apiRequestBody.value.trim();

  if (!url) {
    showToast('Please specify a valid endpoint URL', 'error');
    playCyberSound('error');
    return;
  }

  DOM.sendApiRequestBtn.disabled = true;
  DOM.apiSpinner.classList.remove('hidden');
  state.isGenerating = true;
  playCyberSound('click');

  const startTime = performance.now();

  try {
    let responseData = null;
    let statusCode = 200;

    if (state.mockMode) {
      await new Promise(r => setTimeout(r, 450));
      statusCode = 200;
      responseData = {
        mock_mode: true,
        endpoint_requested: url,
        method,
        timestamp: new Date().toISOString(),
        parsed_body: rawBody ? JSON.parse(rawBody) : null,
        message: "Request successfully simulated by NeuroHub AI Studio."
      };
    } else {
      const options = {
        method,
        headers: getRequestHeaders()
      };

      if (method !== 'GET' && rawBody) {
        options.body = rawBody;
      }

      const res = await fetch(url, options);
      statusCode = res.status;
      responseData = await res.json().catch(() => ({ raw: 'Non-JSON response received' }));
    }

    const elapsed = Math.round(performance.now() - startTime);

    DOM.apiStatusCode.className = `status-code ${statusCode >= 200 && statusCode < 300 ? 'badge-success' : 'badge-danger'}`;
    DOM.apiStatusCode.textContent = `Status: ${statusCode}`;
    DOM.apiTimeElapsed.textContent = `Time: ${elapsed}ms`;
    DOM.apiResponseBody.innerHTML = `<code>${escapeHTML(JSON.stringify(responseData, null, 2))}</code>`;

    incrementInferences(elapsed);
    playCyberSound(statusCode < 400 ? 'success' : 'error');
    showToast(`Request completed with HTTP ${statusCode}`, statusCode < 400 ? 'success' : 'error');
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime);
    DOM.apiStatusCode.className = 'status-code badge-danger';
    DOM.apiStatusCode.textContent = 'Status: Network Error';
    DOM.apiTimeElapsed.textContent = `Time: ${elapsed}ms`;
    DOM.apiResponseBody.innerHTML = `<code>Error: ${escapeHTML(err.message)}\n\nCheck browser DevTools console or verify your backend has CORS enabled.</code>`;
    playCyberSound('error');
    showToast('Network request failed', 'error');
  } finally {
    DOM.sendApiRequestBtn.disabled = false;
    DOM.apiSpinner.classList.add('hidden');
    state.isGenerating = false;
    updateCodeSnippet();
  }
}

function updateCodeSnippet() {
  const method = DOM.apiMethod.value;
  const url = DOM.apiEndpointUrl.value.trim() || 'http://localhost:8000/api/predict';
  const body = DOM.apiRequestBody.value.trim();

  let code = '';

  if (state.activeLanguageSnippet === 'python') {
    code = `import requests

url = "${url}"
headers = {"Content-Type": "application/json"}
payload = ${body || '{}'}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)
print(response.json())`;
  } else if (state.activeLanguageSnippet === 'curl') {
    code = `curl -X ${method} "${url}" \\
  -H "Content-Type: application/json" \\
  -d '${body.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
  } else {
    code = `const response = await fetch("${url}", {
  method: "${method}",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${body || '{}'})
});
const data = await response.json();
console.log(data);`;
  }

  DOM.codeSnippetDisplay.textContent = code;
}

// ==========================================
// 11. EVENT LISTENERS
// ==========================================

function setupEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    applyTheme(nextTheme);
    playCyberSound('click');
    showToast(`Switched to ${nextTheme} mode`);
  });

  // Sound FX Toggle
  if (DOM.soundToggleBtn) {
    DOM.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('soundEnabled', state.soundEnabled);
      updateSoundIcon();
      if (state.soundEnabled) playCyberSound('success');
      showToast(state.soundEnabled ? '🔊 Cyber Audio FX Enabled' : '🔇 Audio Muted');
    });
  }

  // Mobile Menu Toggle
  if (DOM.mobileMenuBtn && DOM.navLinksEl) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.mobileMenuBtn.classList.toggle('open');
      DOM.navLinksEl.classList.toggle('mobile-open');
      playCyberSound('click');
    });
  }

  // Stop NLP Generation Button
  if (DOM.stopNlpBtn) {
    DOM.stopNlpBtn.addEventListener('click', () => {
      if (state.activeStreamAbort) {
        state.activeStreamAbort();
        showToast('Generation halted by user');
      }
    });
  }

  // Quick Preset Backend Buttons
  document.querySelectorAll('.preset-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const url = pill.getAttribute('data-preset-url');
      const name = pill.getAttribute('data-preset-name');
      DOM.globalBaseUrl.value = url;
      state.baseUrl = url;
      localStorage.setItem('baseUrl', url);
      DOM.apiEndpointUrl.value = `${url}/api/predict`;
      updateCodeSnippet();
      playCyberSound('click');
      showToast(`Preset: Switched target to ${name} (${url})`);
      testBackendConnection();
    });
  });

  // Mock Mode Switcher
  DOM.mockModeToggle.addEventListener('change', (e) => {
    state.mockMode = e.target.checked;
    localStorage.setItem('mockMode', state.mockMode);
    updateStatusIndicator();
    playCyberSound('click');
    showToast(state.mockMode ? 'Demo Simulation Enabled' : 'Live Backend Mode Enabled');
  });

  // Ping Backend Button
  DOM.testConnectionBtn.addEventListener('click', testBackendConnection);

  // Global inputs change
  DOM.globalBaseUrl.addEventListener('change', (e) => {
    state.baseUrl = e.target.value.trim();
    localStorage.setItem('baseUrl', state.baseUrl);
    DOM.apiEndpointUrl.value = `${state.baseUrl}/api/predict`;
    updateCodeSnippet();
  });

  DOM.globalApiKey.addEventListener('change', (e) => {
    state.apiKey = e.target.value.trim();
    localStorage.setItem('apiKey', state.apiKey);
  });

  // Navigation Links
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab-nav');
      switchTab(tabId);
      playCyberSound('click');
      if (DOM.navLinksEl && DOM.navLinksEl.classList.contains('mobile-open')) {
        DOM.navLinksEl.classList.remove('mobile-open');
        DOM.mobileMenuBtn.classList.remove('open');
      }
    });
  });

  // Modal handlers
  DOM.openAddModelBtn.addEventListener('click', () => {
    DOM.addModelModal.classList.remove('hidden');
    playCyberSound('click');
  });
  DOM.quickAddBtn.addEventListener('click', () => {
    DOM.addModelModal.classList.remove('hidden');
    playCyberSound('click');
  });
  DOM.closeModalBtn.addEventListener('click', () => DOM.addModelModal.classList.add('hidden'));
  DOM.cancelModalBtn.addEventListener('click', () => DOM.addModelModal.classList.add('hidden'));
  DOM.addModelModal.addEventListener('click', (e) => {
    if (e.target === DOM.addModelModal) DOM.addModelModal.classList.add('hidden');
  });
  DOM.addModelForm.addEventListener('submit', handleAddModelSubmit);

  // NLP Form
  DOM.nlpForm.addEventListener('submit', handleNlpSubmit);
  DOM.clearChatBtn.addEventListener('click', () => {
    DOM.chatMessages.innerHTML = `
      <div class="message system-msg">
        <div class="msg-avatar">🤖</div>
        <div class="msg-body">
          <strong>Chat cleared.</strong> Ready for new queries.
        </div>
      </div>
    `;
    playCyberSound('click');
    showToast('Conversation cleared');
  });

  // NLP Sliders
  DOM.paramTemp.addEventListener('input', (e) => DOM.tempVal.textContent = e.target.value);
  DOM.paramMaxTokens.addEventListener('input', (e) => DOM.tokensVal.textContent = e.target.value);

  // Prompt chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.nlpPromptInput.value = chip.getAttribute('data-prompt');
      DOM.nlpPromptInput.focus();
      playCyberSound('click');
    });
  });

  // Vision File Drop & Upload
  DOM.imageFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  });

  DOM.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.add('drag-active');
  });

  DOM.dropZone.addEventListener('dragleave', () => {
    DOM.dropZone.classList.remove('drag-active');
  });

  DOM.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.remove('drag-active');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  });

  // Sample image buttons
  document.querySelectorAll('.sample-img-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playCyberSound('click');
      const url = btn.getAttribute('data-url');
      displayPreviewImage(url);
    });
  });

  DOM.loadUrlBtn.addEventListener('click', () => {
    const url = DOM.imageUrlInput.value.trim();
    if (url) {
      playCyberSound('click');
      displayPreviewImage(url);
    }
  });

  DOM.removeImgBtn.addEventListener('click', () => {
    removePreviewImage();
    playCyberSound('click');
  });
  DOM.runVisionBtn.addEventListener('click', runVisionInference);

  DOM.copyVisionJsonBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(DOM.visionJsonRaw.textContent);
    playCyberSound('click');
    showToast('Vision JSON copied to clipboard', 'success');
  });

  // Tabular Presets
  document.querySelectorAll('[data-tabular-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playCyberSound('click');
      renderTabularPreset(e.target.getAttribute('data-tabular-preset'));
    });
  });

  DOM.addFeatureRowBtn.addEventListener('click', () => {
    playCyberSound('click');
    const fieldName = prompt('Enter new feature field name:', 'CustomFeature');
    if (fieldName) {
      addTabularFieldRow(fieldName, fieldName, 0, 'number');
    }
  });

  DOM.resetFeaturesBtn.addEventListener('click', () => {
    playCyberSound('click');
    renderTabularPreset(currentTabularPreset);
  });

  DOM.tabularForm.addEventListener('submit', handleTabularSubmit);

  // API Console
  DOM.sendApiRequestBtn.addEventListener('click', handleApiConsoleSubmit);
  DOM.apiMethod.addEventListener('change', updateCodeSnippet);
  DOM.apiEndpointUrl.addEventListener('input', updateCodeSnippet);
  DOM.apiRequestBody.addEventListener('input', updateCodeSnippet);

  DOM.formatJsonBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(DOM.apiRequestBody.value);
      DOM.apiRequestBody.value = JSON.stringify(parsed, null, 2);
      updateCodeSnippet();
      playCyberSound('click');
      showToast('JSON formatted');
    } catch (err) {
      showToast('Invalid JSON syntax', 'error');
      playCyberSound('error');
    }
  });

  document.querySelectorAll('.snippet-lang-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.snippet-lang-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.activeLanguageSnippet = e.target.getAttribute('data-lang');
      updateCodeSnippet();
      playCyberSound('click');
    });
  });

  DOM.copyCodeSnippetBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(DOM.codeSnippetDisplay.textContent);
    playCyberSound('click');
    showToast('Snippet copied to clipboard!', 'success');
  });
}

// ==========================================
// 12. EPIC AUDIO, CANVAS & UI ANIMATION HELPERS
// ==========================================

function updateSoundIcon() {
  if (DOM.soundIcon) {
    DOM.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
  }
}

function incrementInferences(latencyMs = 0) {
  state.inferencesCount++;
  localStorage.setItem('inferencesCount', state.inferencesCount);
  if (DOM.hudCounterVal) {
    DOM.hudCounterVal.textContent = state.inferencesCount;
  }
  if (latencyMs && DOM.hudLatencyVal) {
    DOM.hudLatencyVal.textContent = `${latencyMs} ms`;
  }
}

// Web Audio API Sci-Fi Sound Synthesizer
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCyberSound(type = 'click') {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'stream') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1350 + Math.random() * 300, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.05, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } else if (type === 'ping') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (e) {
    // Autoplay restrictions or audio policy handled
  }
}

// Interactive Neural Background Particle Constellation
function initNeuralBackground() {
  const canvas = document.getElementById('bgNeuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  const numParticles = Math.min(60, Math.floor((width * height) / 24000));
  const particles = [];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2,
      color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#06b6d4' : '#a855f7'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      else if (p.y > height) p.y = 0;

      // Mouse proximity interaction
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          p.x += dx * 0.012;
          p.y += dy * 0.012;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 130) * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect neighboring particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 105) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 105) * 0.22;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// Live Signal Oscilloscope on HUD Telemetry
function initTelemetryWave() {
  const canvas = DOM.telemetryWave;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let step = 0;

  function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = state.isGenerating ? '#06b6d4' : '#6366f1';

    const amplitude = state.isGenerating ? 7 : 3;
    const speed = state.isGenerating ? 0.22 : 0.07;
    step += speed;

    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.08 + step) * amplitude * Math.cos(x * 0.03 + step * 0.5);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.shadowBlur = state.isGenerating ? 8 : 4;
    ctx.shadowColor = state.isGenerating ? '#06b6d4' : '#6366f1';
    ctx.stroke();
    ctx.shadowBlur = 0;

    requestAnimationFrame(drawWave);
  }

  drawWave();
}

// 3D Card Tilt on Mouse Movement
function init3DTilt() {
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.model-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.model-card');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  });
}

// ==========================================
// 13. UTILITY HELPERS
// ==========================================

function showToast(message, type = 'normal') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);
