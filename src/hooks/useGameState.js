import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'storyrulers_game';

const defaultState = {
  language: null,      // 'en' | 'de' | 'es' | 'cs'
  theme: null,         // 'royal' | 'space' | 'wizard' | 'underwater' | 'forest'
  youngestAge: 6,
  playersContext: '',
  worldMemory: [],
  publicChronicle: [],
  currentPetitioner: null,
  setupComplete: false,
};

/**
 * Persistent game state hook with localStorage
 */
export function useGameState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore but clear transient state
        return { ...defaultState, ...parsed, currentPetitioner: null };
      }
    } catch {
      // Corrupted data
    }
    return { ...defaultState };
  });
  
  // Persist to localStorage on change
  useEffect(() => {
    try {
      // Don't save currentPetitioner (regenerate each session)
      const toSave = { ...state, currentPetitioner: null };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage full
    }
  }, [state]);
  
  const setLanguage = useCallback((lang) => {
    setState(prev => ({ ...prev, language: lang }));
  }, []);
  
  const setTheme = useCallback((theme) => {
    setState(prev => ({ ...prev, theme }));
  }, []);
  
  const setYoungestAge = useCallback((age) => {
    setState(prev => ({ ...prev, youngestAge: age }));
  }, []);
  
  const setPlayersContext = useCallback((context) => {
    setState(prev => ({ ...prev, playersContext: context }));
  }, []);
  
  const addWorldMemory = useCallback((entry) => {
    setState(prev => ({
      ...prev,
      worldMemory: [...prev.worldMemory, entry],
    }));
  }, []);
  
  const setCurrentPetitioner = useCallback((petitioner) => {
    setState(prev => ({ ...prev, currentPetitioner: petitioner }));
  }, []);
  
  const addChronicleEntry = useCallback((entry) => {
    setState(prev => ({
      ...prev,
      publicChronicle: [...prev.publicChronicle, entry],
    }));
  }, []);
  
  const updateChronicleImage = useCallback((index, imageUrl) => {
    setState(prev => {
      const updated = [...prev.publicChronicle];
      if (updated[index]) {
        updated[index] = { ...updated[index], imageUrl, loading: false };
      }
      return { ...prev, publicChronicle: updated };
    });
  }, []);
  
  const markSetupComplete = useCallback(() => {
    setState(prev => ({ ...prev, setupComplete: true }));
  }, []);
  
  const resetGame = useCallback(() => {
    setState({ ...defaultState });
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  const setWorldMemoryDirect = useCallback((memory) => {
    setState(prev => ({ ...prev, worldMemory: memory }));
  }, []);
  
  return {
    ...state,
    setLanguage,
    setTheme,
    setYoungestAge,
    setPlayersContext,
    addWorldMemory,
    setCurrentPetitioner,
    addChronicleEntry,
    updateChronicleImage,
    markSetupComplete,
    resetGame,
    setWorldMemoryDirect,
  };
}
