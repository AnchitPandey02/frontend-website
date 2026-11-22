import React, { useState, useEffect } from 'react';
import NeuralBackground from './components/NeuralBackground';
import Navbar from './components/Navbar';
import HeroConnectionBar from './components/HeroConnectionBar';
import TelemetryRibbon from './components/TelemetryRibbon';
import ModelsTab from './components/tabs/ModelsTab';
import NlpTab from './components/tabs/NlpTab';
import VisionTab from './components/tabs/VisionTab';
import TabularTab from './components/tabs/TabularTab';
import ApiConsoleTab from './components/tabs/ApiConsoleTab';
import BackendGuideTab from './components/tabs/BackendGuideTab';
import AddModelModal from './components/AddModelModal';
import ToastContainer from './components/ToastContainer';
import { DEFAULT_MODELS } from './utils/mockBackend';
import { playCyberSound } from './utils/audioFx';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [mockMode, setMockMode] = useState(() => localStorage.getItem('mockMode') !== 'false');
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('baseUrl') || 'http://localhost:8000');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [activeTab, setActiveTab] = useState('models');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [inferencesCount, setInferencesCount] = useState(() => parseInt(localStorage.getItem('inferencesCount') || '0', 10));
  const [models, setModels] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredModels');
      return saved ? JSON.parse(saved) : DEFAULT_MODELS;
    } catch {
      return DEFAULT_MODELS;
    }
  });

  const [latency, setLatency] = useState('4.2 ms');
  const [speed, setSpeed] = useState('~54 tok/s');
  const [engineStatus, setEngineStatus] = useState('ONLINE • READY');
  const [isGeneratingTelemetry, setIsGeneratingTelemetry] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Theme Sync
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('mockMode', mockMode);
  }, [mockMode]);

  useEffect(() => {
    localStorage.setItem('baseUrl', baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('inferencesCount', inferencesCount.toString());
  }, [inferencesCount]);

  useEffect(() => {
    localStorage.setItem('registeredModels', JSON.stringify(models));
  }, [models]);

  // Hash route sync on mount
  useEffect(() => {
    if (window.location.hash) {
      const clean = window.location.hash.replace('#', '').replace('-playground', '');
      if (['models', 'nlp', 'vision', 'tabular', 'tester', 'guide'].includes(clean)) {
        setActiveTab(clean);
      }
    }
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, null, `#${tabId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playCyberSound('click', soundEnabled);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playCyberSound('success', true);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    playCyberSound('click', soundEnabled);
  };

  const handleInferenceSuccess = (elapsedMs) => {
    setInferencesCount((prev) => prev + 1);
    setLatency(`${elapsedMs} ms`);
    setSpeed(`~${Math.round(40 + Math.random() * 30)} tok/s`);
    setEngineStatus('ACTIVE • PROCESSING');
    setTimeout(() => {
      setEngineStatus(mockMode ? 'SIMULATION • READY' : 'FASTAPI • LIVE');
    }, 2000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    playCyberSound('ping', soundEnabled);
    const startTime = performance.now();

    try {
      if (mockMode) {
        await new Promise((r) => setTimeout(r, 350));
        const elapsed = Math.round(performance.now() - startTime);
        setLatency(`${elapsed} ms`);
        setEngineStatus('SIMULATION • READY');
        showToast(`⚡ Demo Simulation Active (${elapsed}ms latency simulated)`, 'success');
        playCyberSound('success', soundEnabled);
      } else {
        const url = baseUrl.replace(/\/$/, '');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`${url}/health`, {
          method: 'GET',
          headers: apiKey ? { Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}` } : {},
          signal: controller.signal
        }).catch(async () => {
          return await fetch(url, { method: 'GET', signal: controller.signal });
        });

        clearTimeout(timeoutId);
        const elapsed = Math.round(performance.now() - startTime);

        if (res && res.ok) {
          setLatency(`${elapsed} ms`);
          setEngineStatus('FASTAPI • LIVE');
          showToast(`✅ Backend Online! Connected to ${url} in ${elapsed}ms`, 'success');
          playCyberSound('success', soundEnabled);
        } else {
          setEngineStatus('BACKEND • WARN');
          showToast(`⚠️ Server responded with HTTP status ${res ? res.status : 'Error'}`, 'error');
          playCyberSound('error', soundEnabled);
        }
      }
    } catch (err) {
      setEngineStatus('OFFLINE');
      showToast(`❌ Could not reach ${baseUrl}. Check backend server and CORS.`, 'error');
      playCyberSound('error', soundEnabled);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleAddModel = (newModel) => {
    setModels([newModel, ...models]);
    showToast(`Model "${newModel.name}" registered!`, 'success');
    playCyberSound('success', soundEnabled);
  };

  const handleDeleteModel = (id) => {
    setModels(models.filter((m) => m.id !== id));
    showToast('Model removed from registry', 'success');
    playCyberSound('click', soundEnabled);
  };

  const handleRefreshModels = () => {
    playCyberSound('ping', soundEnabled);
    showToast('Refreshing model status checks...', 'info');
  };

  return (
    <>
      {/* Interactive Neural Canvas Background */}
      <NeuralBackground />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mockMode={mockMode}
        baseUrl={baseUrl}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAddModel={() => setIsAddModelOpen(true)}
      />

      {/* Hero & Connection Ribbon */}
      <HeroConnectionBar
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        apiKey={apiKey}
        setApiKey={setApiKey}
        mockMode={mockMode}
        setMockMode={setMockMode}
        onTestConnection={handleTestConnection}
        testingConnection={testingConnection}
      />

      {/* Live Telemetry Ribbon */}
      <TelemetryRibbon
        engineStatus={engineStatus}
        speed={speed}
        latency={latency}
        inferencesCount={inferencesCount}
        isGenerating={isGeneratingTelemetry}
      />

      {/* Tab Panels */}
      <main className="container main-content">
        {activeTab === 'models' && (
          <ModelsTab
            models={models}
            onLaunchTab={handleSelectTab}
            onDeleteModel={handleDeleteModel}
            onOpenAddModel={() => setIsAddModelOpen(true)}
            onRefresh={handleRefreshModels}
          />
        )}

        {activeTab === 'nlp' && (
          <NlpTab
            baseUrl={baseUrl}
            apiKey={apiKey}
            mockMode={mockMode}
            soundEnabled={soundEnabled}
            onInferenceSuccess={handleInferenceSuccess}
            setIsGeneratingTelemetry={setIsGeneratingTelemetry}
          />
        )}

        {activeTab === 'vision' && (
          <VisionTab
            baseUrl={baseUrl}
            apiKey={apiKey}
            mockMode={mockMode}
            soundEnabled={soundEnabled}
            onInferenceSuccess={handleInferenceSuccess}
            setIsGeneratingTelemetry={setIsGeneratingTelemetry}
          />
        )}

        {activeTab === 'tabular' && (
          <TabularTab
            baseUrl={baseUrl}
            apiKey={apiKey}
            mockMode={mockMode}
            soundEnabled={soundEnabled}
            onInferenceSuccess={handleInferenceSuccess}
            setIsGeneratingTelemetry={setIsGeneratingTelemetry}
          />
        )}

        {activeTab === 'tester' && (
          <ApiConsoleTab
            baseUrl={baseUrl}
            apiKey={apiKey}
            soundEnabled={soundEnabled}
            onInferenceSuccess={handleInferenceSuccess}
            setIsGeneratingTelemetry={setIsGeneratingTelemetry}
          />
        )}

        {activeTab === 'guide' && <BackendGuideTab />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-left">
            <strong>NeuroHub AI Studio (React Edition)</strong> &bull; Custom Model Frontend Playground
          </div>
          <div className="footer-right">
            <span>Powered by React 18, Vite & Web Audio API &bull; Ready for PyTorch, TensorFlow & Transformers</span>
          </div>
        </div>
      </footer>

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
        onAddModel={handleAddModel}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </>
  );
}
