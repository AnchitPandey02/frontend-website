import React, { useState, useEffect } from 'react';
import InteractiveCursorCanvas from './components/InteractiveCursorCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GeoAIWorkbench from './components/GeoAIWorkbench';
import PotholeRoadSection from './components/PotholeRoadSection';
import QgisIntegrationSection from './components/QgisIntegrationSection';
import IndianSolutionsSection from './components/IndianSolutionsSection';
import MediaPlaceholdersSection from './components/MediaPlaceholdersSection';
import BackendConnectionBar from './components/BackendConnectionBar';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { playCyberSound } from './utils/audioFx';

export default function App() {
  const [mockMode, setMockMode] = useState(() => localStorage.getItem('yantrikaran_mockMode') !== 'false');
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('yantrikaran_baseUrl') || 'http://localhost:8000');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yantrikaran_apiKey') || '');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('yantrikaran_soundEnabled') !== 'false');
  const [testingConnection, setTestingConnection] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('yantrikaran_mockMode', mockMode);
  }, [mockMode]);

  useEffect(() => {
    localStorage.setItem('yantrikaran_baseUrl', baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    localStorage.setItem('yantrikaran_apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('yantrikaran_soundEnabled', soundEnabled);
  }, [soundEnabled]);

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

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playCyberSound('success', true);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    playCyberSound('ping', soundEnabled);
    const startTime = performance.now();

    try {
      if (mockMode) {
        await new Promise((r) => setTimeout(r, 400));
        const elapsed = Math.round(performance.now() - startTime);
        showToast(`⚡ Yantrikaran GeoAI Simulation Active (${elapsed}ms latency)`, 'success');
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
          showToast(`✅ Model Backend Online! Connected to ${url} in ${elapsed}ms`, 'success');
          playCyberSound('success', soundEnabled);
        } else {
          showToast(`⚠️ Server responded with HTTP status ${res ? res.status : 'Error'}`, 'error');
          playCyberSound('error', soundEnabled);
        }
      }
    } catch (err) {
      showToast(`❌ Could not reach ${baseUrl}. Ensure backend CORS is allowed.`, 'error');
      playCyberSound('error', soundEnabled);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleOpenContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    playCyberSound('click', soundEnabled);
  };

  return (
    <>
      {/* Interactive Cursor Trail & Click Spark Animation Canvas */}
      <InteractiveCursorCanvas />

      {/* Navigation Bar with Official Yi Icon & Wordmark */}
      <Navbar
        mockMode={mockMode}
        baseUrl={baseUrl}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenContact={handleOpenContact}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive GeoAI Workbench (Building Segmentation & Potholes Split Slider) */}
      <GeoAIWorkbench
        soundEnabled={soundEnabled}
        onInferenceRun={(elapsed) => {
          showToast(`Inference completed in ${elapsed}ms. Vector layers updated!`, 'success');
        }}
      />

      {/* Automated Pothole & Road Distress Scanner */}
      <PotholeRoadSection soundEnabled={soundEnabled} />

      {/* QGIS Native Plugin Showcase (Inspired by TerraLab) */}
      <QgisIntegrationSection soundEnabled={soundEnabled} />

      {/* Solutions for Infrastructure & Smart Cities */}
      <IndianSolutionsSection />

      {/* Media Placeholders for Videos & Orthomosaics */}
      <MediaPlaceholdersSection soundEnabled={soundEnabled} />

      {/* Custom Backend API Connection Ribbon */}
      <BackendConnectionBar
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        apiKey={apiKey}
        setApiKey={setApiKey}
        mockMode={mockMode}
        setMockMode={setMockMode}
        onTestConnection={handleTestConnection}
        testingConnection={testingConnection}
      />

      {/* Pilot Booking & Contact Form */}
      <ContactSection soundEnabled={soundEnabled} />

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </>
  );
}
