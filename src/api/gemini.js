// --- Gemini API Helpers ---
// Dual-mode: Uses Vercel serverless proxy when available, falls back to direct API.
// In production (Vercel), the API key lives server-side.
// In local dev, users can paste their key in Settings.

const TEXT_MODEL = 'gemini-3.1-flash-lite-preview';
const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

export const getApiKey = () => {
  return localStorage.getItem('storyrulers_api_key') || '';
};

export const setApiKey = (key) => {
  localStorage.setItem('storyrulers_api_key', key);
};

/**
 * Check if Vercel API proxy is available
 */
const isVercelDeployed = () => {
  // In production on Vercel, the /api/gemini endpoint exists
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
};

/**
 * Generate text/JSON content using Gemini 3.1 Flash Lite
 */
export const fetchStory = async (prompt, systemInstruction = null, isJson = false) => {
  if (isVercelDeployed()) {
    return fetchViaProxy('text', prompt, systemInstruction, isJson);
  }
  return fetchDirect('text', prompt, systemInstruction, isJson);
};

/**
 * Generate an image using Gemini 3.1 Flash Image
 */
export const fetchImage = async (prompt) => {
  if (isVercelDeployed()) {
    return fetchViaProxy('image', prompt);
  }
  return fetchDirectImage(prompt);
};

/**
 * Call via Vercel serverless proxy (production)
 */
const fetchViaProxy = async (type, prompt, systemInstruction = null, isJson = false) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, prompt, systemInstruction, isJson }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (type === 'image') {
    return data.image;
  }
  return data.text;
};

/**
 * Call Gemini API directly (local dev with user's own key)
 */
const fetchDirect = async (type, prompt, systemInstruction = null, isJson = false) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key not configured. Go to Settings to add your Gemini API key.');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  
  if (isJson) {
    payload.generationConfig = { responseMimeType: 'application/json' };
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error('No text in API response');
  return text;
};

/**
 * Direct image generation (local dev)
 */
const fetchDirectImage = async (prompt) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key not configured');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error(`Image API error: ${response.status}`);
  }
  
  const data = await response.json();
  const imagePart = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  
  if (!imagePart?.inlineData?.data) return null;
  
  const mimeType = imagePart.inlineData.mimeType || 'image/png';
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
};
