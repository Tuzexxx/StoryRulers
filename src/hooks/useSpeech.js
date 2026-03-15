import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API — TTS + Speech Recognition
 */
export function useSpeech(lang = 'en-US') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState([]);
  
  const recognitionRef = useRef(null);
  const langRef = useRef(lang);
  
  // Keep lang ref current
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  // Load voices and handle async voice loading
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.continuous = false;
      
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(prev => prev + (prev ? ' ' : '') + text);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);
  
  // Find best voice for language
  const getBestVoice = useCallback((targetLang) => {
    const langVoices = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
    if (langVoices.length === 0) return null;

    // Priority 1: "Natural" or "Neural" or "Premium" in name
    const naturalVoice = langVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('neural') ||
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('online')
    );
    if (naturalVoice) return naturalVoice;

    // Priority 2: "Google" voices (usually very good)
    const googleVoice = langVoices.find(v => v.name.toLowerCase().includes('google'));
    if (googleVoice) return googleVoice;

    // Priority 3: Default for that language
    const defaultLangVoice = langVoices.find(v => v.default);
    if (defaultLangVoice) return defaultLangVoice;

    return langVoices[0];
  }, [voices]);

  // Speak text aloud
  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const targetLang = langRef.current;
    utterance.lang = targetLang;
    
    // Attempt to pick a high-quality voice
    const bestVoice = getBestVoice(targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Storytelling tuning: Slightly slower, warmer pitch
    utterance.rate = 0.92; 
    utterance.pitch = 1.02;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setIsSpeaking(false);
      onEnd?.();
    };
    
    window.speechSynthesis.speak(utterance);
  }, [getBestVoice]);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);
  
  // Toggle listening
  const toggleListen = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.lang = langRef.current;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
        setIsListening(false);
      }
    }
  }, [isListening]);
  
  const clearTranscript = useCallback(() => setTranscript(''), []);
  
  return {
    isSpeaking,
    isListening,
    transcript,
    speak,
    stopSpeaking,
    toggleListen,
    clearTranscript,
    setTranscript,
    hasRecognition: !!recognitionRef.current,
  };
}
