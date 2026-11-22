// Realistic Mock AI Simulation Engine for local testing without active server

export const DEFAULT_MODELS = [
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

export const TABULAR_PRESETS = {
  housing: [
    { name: 'Square Footage', key: 'sqft', type: 'number', value: 2400 },
    { name: 'Bedrooms', key: 'bedrooms', type: 'number', value: 3 },
    { name: 'Bathrooms', key: 'bathrooms', type: 'number', value: 2.5 },
    { name: 'Year Built', key: 'year_built', type: 'number', value: 2018 },
    { name: 'Neighborhood Rating (1-10)', key: 'neighborhood_score', type: 'number', value: 8 }
  ],
  churn: [
    { name: 'Monthly Charges ($)', key: 'monthly_charges', type: 'number', value: 74.90 },
    { name: 'Tenure (Months)', key: 'tenure', type: 'number', value: 24 },
    { name: 'Contract Type', key: 'contract', type: 'text', value: 'One year' },
    { name: 'Support Tickets (30d)', key: 'support_tickets', type: 'number', value: 1 },
    { name: 'Paperless Billing', key: 'paperless_billing', type: 'text', value: 'Yes' }
  ],
  credit: [
    { name: 'Annual Income ($)', key: 'annual_income', type: 'number', value: 85000 },
    { name: 'Credit Score', key: 'credit_score', type: 'number', value: 740 },
    { name: 'Debt-to-Income Ratio', key: 'dti', type: 'number', value: 0.28 },
    { name: 'Loan Amount ($)', key: 'loan_amount', type: 'number', value: 25000 },
    { name: 'Employment Length (Years)', key: 'employment_years', type: 'number', value: 5 }
  ]
};

export function simulateNlpResponse(prompt, modelId) {
  const p = prompt.toLowerCase();
  let reply = '';

  if (modelId === 'sentiment-model' || p.includes('sentiment') || p.includes('emotion')) {
    const isPositive = p.includes('great') || p.includes('good') || p.includes('love') || p.includes('astounding') || p.includes('excellent');
    const isNegative = p.includes('bad') || p.includes('slow') || p.includes('error') || p.includes('hate') || p.includes('poor');
    const label = isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'NEUTRAL';
    const score = (0.85 + Math.random() * 0.14).toFixed(4);
    reply = `[DistilBERT Analysis] Sentiment: **${label}** (Confidence: ${(score * 100).toFixed(1)}%)\n\n• Primary Emotion: ${isPositive ? 'Excitement / Delight' : isNegative ? 'Frustration / Concern' : 'Objective Information'}\n• Subjectivity Score: 0.72\n• Processing Latency: 14ms (GPU accelerated)`;
  } else if (p.includes('attention') || p.includes('transformer')) {
    reply = `Transformer attention mechanisms dynamically compute similarity weights between all token pairs in a sequence, allowing the model to focus on the most relevant contextual words regardless of their distance.\n\nIn multi-head attention, several attention representations are computed in parallel to capture distinct relationships like syntax, coreference, and semantic nuance simultaneously.`;
  } else if (p.includes('entity') || p.includes('extract')) {
    reply = `**Extracted Entities (NER):**\n- **ORG:** Google DeepMind (Confidence: 0.99)\n- **GPE:** London (Confidence: 0.98)\n- **DATE:** Monday (Confidence: 0.95)\n- **TOPIC:** AI Benchmarks (Confidence: 0.93)\n\nOverall sentence tone is **informative / positive**.`;
  } else {
    reply = `NeuralChat 7B processed your prompt: "${prompt}".\n\nThis is a simulated AI response running entirely in Demo Mode. When you start your FastAPI or Flask backend (check the "Backend Guide" tab above) and turn off Demo Simulation, this query will route directly to your model's endpoint!`;
  }

  const words = reply.split(' ');
  return {
    reply,
    words,
    tokens: Math.round(words.length * 1.3),
    latency: Math.floor(40 + Math.random() * 45)
  };
}

export function simulateVisionResponse() {
  const detections = [
    { label: 'Golden Retriever', confidence: 0.964, box: [0.15, 0.20, 0.70, 0.65], color: '#6366f1' },
    { label: 'Collar (Leather)', confidence: 0.887, box: [0.42, 0.48, 0.16, 0.18], color: '#06b6d4' },
    { label: 'Tennis Ball', confidence: 0.912, box: [0.65, 0.72, 0.14, 0.14], color: '#10b981' }
  ];

  return {
    status: 'success',
    model: 'YOLOv8x-Vision',
    inference_time_ms: 18.4,
    image_shape: [640, 640, 3],
    detections: detections,
    total_objects_found: detections.length
  };
}

export function simulateTabularResponse(features) {
  let score = 0;
  let label = '';
  let detail = '';

  if (features.sqft) {
    const val = features.sqft * 210 + (features.bedrooms || 3) * 15000 + (features.neighborhood_score || 7) * 8000;
    score = Math.round(val);
    label = `$${score.toLocaleString()}`;
    detail = `Estimated Fair Market Value (95% CI: $${Math.round(score * 0.95).toLocaleString()} - $${Math.round(score * 1.05).toLocaleString()})`;
  } else if (features.monthly_charges) {
    const prob = Math.min(0.95, Math.max(0.05, (features.monthly_charges / 120) * 0.5 + (features.support_tickets || 1) * 0.15));
    score = Math.round(prob * 100);
    label = score > 50 ? 'HIGH RISK' : 'LOW RISK';
    detail = `Customer Churn Probability: ${score}% (Primary risk factor: monthly price vs support ticket frequency)`;
  } else {
    score = 82;
    label = 'APPROVED (LOW RISK)';
    detail = 'Credit Risk Score: 82/100. Debt-to-income and credit history satisfy tier-1 criteria.';
  }

  return {
    prediction: label,
    score: score,
    timestamp: new Date().toISOString(),
    details: detail
  };
}
