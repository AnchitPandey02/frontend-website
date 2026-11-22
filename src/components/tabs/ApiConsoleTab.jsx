import React, { useState } from 'react';
import { playCyberSound } from '../../utils/audioFx';

export default function ApiConsoleTab({
  baseUrl,
  apiKey,
  soundEnabled,
  onInferenceSuccess,
  setIsGeneratingTelemetry
}) {
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState(`${baseUrl.replace(/\/$/, '')}/api/predict`);
  const [requestBody, setRequestBody] = useState(`{\n  "model": "my-custom-model",\n  "inputs": [\n    "Machine learning models are fascinating."\n  ],\n  "parameters": {\n    "temperature": 0.7,\n    "top_k": 50\n  }\n}`);
  const [responseStatus, setResponseStatus] = useState('--');
  const [responseTime, setResponseTime] = useState('--');
  const [responseBody, setResponseBody] = useState('Click "Send Request" to test your model endpoint.');
  const [isSending, setIsSending] = useState(false);
  const [snippetLang, setSnippetLang] = useState('python');

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
      playCyberSound('click', soundEnabled);
    } catch (err) {
      alert('Invalid JSON format');
    }
  };

  const handleSendRequest = async () => {
    setIsSending(true);
    setIsGeneratingTelemetry(true);
    playCyberSound('click', soundEnabled);

    const startTime = performance.now();

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

      const options = {
        method,
        headers
      };

      if (method !== 'GET') {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const elapsed = Math.round(performance.now() - startTime);

      setResponseStatus(`HTTP ${res.status}`);
      setResponseTime(`${elapsed} ms`);
      onInferenceSuccess(elapsed);

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setResponseBody(JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        setResponseBody(text);
      }
      playCyberSound('success', soundEnabled);
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseStatus('NETWORK ERR');
      setResponseTime(`${elapsed} ms`);
      setResponseBody(`Network Error: ${err.message}\nMake sure target server is active and CORS is configured.`);
      playCyberSound('error', soundEnabled);
    } finally {
      setIsSending(false);
      setIsGeneratingTelemetry(false);
    }
  };

  const generateSnippet = () => {
    if (snippetLang === 'python') {
      return `import requests

url = "${url}"
headers = {
    "Content-Type": "application/json"${apiKey ? `,\n    "Authorization": "Bearer ${apiKey}"` : ''}
}
data = ${requestBody.trim()}

response = requests.${method.toLowerCase()}(url, json=data, headers=headers)
print(response.status_code)
print(response.json())`;
    } else if (snippetLang === 'curl') {
      return `curl -X ${method} "${url}" \\
  -H "Content-Type: application/json"${apiKey ? ` \\\n  -H "Authorization: Bearer ${apiKey}"` : ''} \\
  -d '${requestBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
    } else {
      return `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Content-Type": "application/json"${apiKey ? `,\n    "Authorization": "Bearer ${apiKey}"` : ''}
  },
  body: JSON.stringify(${requestBody.trim()})
});

const data = await response.json();
console.log(data);`;
    }
  };

  return (
    <section className="tab-panel active">
      <div className="section-header">
        <div>
          <h2 className="section-title">Universal Model API Console</h2>
          <p className="section-subtitle">Execute direct REST calls to any custom ML endpoint with custom headers, body payloads, and timing analytics.</p>
        </div>
      </div>

      <div className="api-tester-card card">
        {/* Request Row */}
        <div className="api-request-bar">
          <select
            className="form-select method-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
          </select>

          <input
            type="text"
            className="form-input flex-1 font-mono"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={handleSendRequest}
            disabled={isSending}
          >
            {isSending && <span className="btn-spinner"></span>}
            <span>Send Request</span>
          </button>
        </div>

        {/* Request / Response Split Grid */}
        <div className="api-panels-grid">
          <div className="api-panel">
            <div className="panel-header">
              <span>Request JSON Payload</span>
              <button className="btn btn-outline btn-xs" onClick={handleFormatJson}>Format JSON</button>
            </div>
            <textarea
              className="form-textarea font-mono text-sm"
              rows={10}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </div>

          <div className="api-panel">
            <div className="panel-header">
              <span>Response Output</span>
              <div className="response-meta">
                <span className="status-code badge-gray">Status: {responseStatus}</span>
                <span className="status-code badge-gray">Time: {responseTime}</span>
              </div>
            </div>
            <div className="response-body-wrapper">
              <pre className="code-block font-mono"><code>{responseBody}</code></pre>
            </div>
          </div>
        </div>

        {/* Code Snippet Export */}
        <div className="code-export-section">
          <div className="panel-header">
            <span className="text-xs uppercase font-bold text-muted">Generate Code Snippet</span>
            <div className="snippet-lang-tabs">
              <button
                className={`tab-btn ${snippetLang === 'python' ? 'active' : ''}`}
                onClick={() => setSnippetLang('python')}
              >
                Python (requests)
              </button>
              <button
                className={`tab-btn ${snippetLang === 'curl' ? 'active' : ''}`}
                onClick={() => setSnippetLang('curl')}
              >
                cURL
              </button>
              <button
                className={`tab-btn ${snippetLang === 'js' ? 'active' : ''}`}
                onClick={() => setSnippetLang('js')}
              >
                JavaScript (fetch)
              </button>
            </div>
          </div>
          <div className="code-wrapper">
            <pre className="code-block"><code>{generateSnippet()}</code></pre>
            <button
              className="btn-copy-code"
              onClick={() => {
                navigator.clipboard.writeText(generateSnippet());
                playCyberSound('click', soundEnabled);
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
