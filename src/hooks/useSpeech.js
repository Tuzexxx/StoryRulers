import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API — TTS + Speech Recognition
 */
export function useSpeech(lang = 'en-US') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const langRef = useRef(lang);
  
  // Keep lang ref current
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);
  
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
  
  // Speak text aloud
  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langRef.current;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);
  
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
