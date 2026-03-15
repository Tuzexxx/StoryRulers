import React, { useState, useEffect } from 'react';
import LanguageSelect from './pages/LanguageSelect';
import GameSetup from './pages/GameSetup';
import GamePlay from './pages/GamePlay';
import Chronicle from './pages/Chronicle';
import Settings from './pages/Settings';
import AuthScreen from './pages/AuthScreen';
import { useGameState } from './hooks/useGameState';
import { useSpeech } from './hooks/useSpeech';
import translations from './i18n/translations';
import { supabase, getSession, loadGameState, saveGameState } from './api/supabase';

/**
 * Main App — Screen-based routing  
 * Flow: Language → [Auth (optional)] → Setup (Theme → Age → Intro) → Game ↔ Chronicle/Settings
 */
export default function App() {
  const gameState = useGameState();
  const t = translations[gameState.language] || translations.en;
  const speech = useSpeech(t.speechLang);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Determine initial screen based on saved state
  const [screen, setScreen] = useState(() => {
    if (!gameState.language) return 'language';
    if (!gameState.setupComplete) return 'setup';
    return 'game';
  });
  
  // Check for existing session on mount
  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    
    getSession().then(session => {
      if (session?.user) {
        setUser(session.user);
        // Try to load cloud save
        loadGameState(session.user.id).then(cloudData => {
          if (cloudData && !gameState.setupComplete) {
            // Restore from cloud if local is empty
            if (cloudData.language) gameState.setLanguage(cloudData.language);
            if (cloudData.theme) gameState.setTheme(cloudData.theme);
            if (cloudData.youngestAge) gameState.setYoungestAge(cloudData.youngestAge);
            if (cloudData.playersContext) gameState.setPlayersContext(cloudData.playersContext);
            if (cloudData.worldMemory?.length) gameState.setWorldMemoryDirect(cloudData.worldMemory);
            if (cloudData.setupComplete) {
              gameState.markSetupComplete();
              setScreen('game');
            }
          }
        });
      }
      setAuthChecked(true);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription?.unsubscribe();
  }, []);
  
  // Auto-save to cloud when game state changes (if logged in)
  useEffect(() => {
    if (user && gameState.setupComplete) {
      const debounce = setTimeout(() => {
        saveGameState(user.id, gameState);
      }, 2000);
      return () => clearTimeout(debounce);
    }
  }, [user, gameState.publicChronicle.length, gameState.worldMemory.length]);
  
  // Apply theme to DOM when it changes
  useEffect(() => {
    if (gameState.theme) {
      document.documentElement.setAttribute('data-theme', gameState.theme);
    }
  }, [gameState.theme]);
  
  const handleLanguageSelect = (lang) => {
    gameState.setLanguage(lang);
    setScreen('setup');
  };
  
  const handleAuth = (authUser) => {
    setUser(authUser);
    if (gameState.setupComplete) {
      setScreen('game');
    } else {
      setScreen('setup');
    }
  };
  
  const handleSkipAuth = () => {
    if (gameState.setupComplete) {
      setScreen('game');
    } else {
      setScreen('setup');
    }
  };
  
  const handleSetupComplete = () => {
    setScreen('game');
  };
  
  const handleNavigate = (target) => {
    speech.stopSpeaking();
    setScreen(target);
  };
  
  const handleChangeLang = () => {
    speech.stopSpeaking();
    gameState.setLanguage(null);
    setScreen('language');
  };
  
  // Show nothing while checking auth
  if (!authChecked) {
    return (
      <div className="page-container">
        <div className="app-bg" />
        <div className="page-center">
          <div className="loading-spinner">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {screen === 'language' && (
        <LanguageSelect onSelect={handleLanguageSelect} />
      )}
      
      {screen === 'auth' && (
        <AuthScreen
          language={gameState.language}
          onAuth={handleAuth}
          onSkip={handleSkipAuth}
        />
      )}
      
      {screen === 'setup' && (
        <GameSetup
          gameState={gameState}
          speech={speech}
          onComplete={handleSetupComplete}
        />
      )}
      
      {screen === 'game' && (
        <GamePlay
          gameState={gameState}
          speech={speech}
          onNavigate={handleNavigate}
        />
      )}
      
      {screen === 'chronicle' && (
        <Chronicle
          gameState={gameState}
          onBack={() => setScreen('game')}
        />
      )}
      
      {screen === 'settings' && (
        <Settings
          gameState={gameState}
          onBack={() => setScreen('game')}
          onNavigate={handleNavigate}
          onChangeLang={handleChangeLang}
          user={user}
        />
      )}
    </>
  );
}
