// --- Vercel Serverless API: Proxy Gemini requests ---
// This keeps the API key server-side so users never see it.
// Deployed as /api/gemini serverless function on Vercel.

const TEXT_MODEL = 'gemini-3.1-flash-lite-preview';
const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }
  
  try {
    const { type, prompt, systemInstruction, isJson } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    
    const model = type === 'image' ? IMAGE_MODEL : TEXT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    
    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    
    if (type === 'image') {
      payload.generationConfig = { responseModalities: ['TEXT', 'IMAGE'] };
    } else if (isJson) {
      payload.generationConfig = { responseMimeType: 'application/json' };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData?.error?.message || `Gemini API error: ${response.status}`,
      });
    }
    
    const data = await response.json();
    
    if (type === 'image') {
      // Find image part and return it
      const imagePart = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        return res.status(200).json({
          image: `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`,
        });
      }
      return res.status(200).json({ image: null });
    }
    
    // Text response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text });
    
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
