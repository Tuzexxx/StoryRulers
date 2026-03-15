import React, { useState, useEffect } from 'react';
import translations, { THEMES } from '../i18n/translations';

const themeKeys = ['royal', 'space', 'wizard', 'underwater', 'forest'];

/**
 * Multi-step setup wizard: Theme → Age → Player Intro
 */
export default function GameSetup({ gameState, speech, onComplete }) {
  const [setupStep, setSetupStep] = useState(gameState.theme ? (gameState.playersContext ? 'done' : 'age') : 'theme');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const t = translations[gameState.language] || translations.en;
  
  // Sync transcript from speech recognition
  useEffect(() => {
    if (speech.transcript) {
      setInputText(prev => prev + (prev ? ' ' : '') + speech.transcript);
      speech.clearTranscript();
    }
  }, [speech.transcript]);
  
  const handleThemeSelect = (themeKey) => {
    gameState.setTheme(themeKey);
    // Apply theme to DOM
    document.documentElement.setAttribute('data-theme', themeKey);
    setSetupStep('age');
  };
  
  const handleAgeConfirm = () => {
    setSetupStep('intro');
    // Speak welcome
    setTimeout(() => {
      speech.speak(t.welcomeNarrator);
    }, 300);
  };
  
  const handleIntroSubmit = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    
    try {
      const { fetchStory } = await import('../api/gemini.js');
      
      const prompt = `
        The player answered who came to play: "${inputText}".
        Extract names and relationships (e.g., dad Mike and daughter Emma).
        Create a warm welcome message (max 2 sentences) addressing them by name and inviting them to solve the first case.
        Return STRICT JSON: {"playersContext": "brief description of players", "welcomeMessage": "welcome message in ${t.code}"}
      `;
      
      const resText = await fetchStory(prompt, t.systemNarrator, true);
      const parsed = JSON.parse(resText);
      
      gameState.setPlayersContext(parsed.playersContext);
      gameState.setWorldMemoryDirect([`The rulers are: ${parsed.playersContext}`]);
      gameState.markSetupComplete();
      
      speech.speak(parsed.welcomeMessage, () => {
        onComplete();
      });
      
    } catch (e) {
      console.error('Intro error:', e);
      // Fallback: just proceed
      gameState.setPlayersContext(inputText);
      gameState.setWorldMemoryDirect([`The rulers are: ${inputText}`]);
      gameState.markSetupComplete();
      onComplete();
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };
  
  const themeData = THEMES[gameState.theme] || THEMES.royal;
  const narratorEmoji = themeData?.narrator || '📯';
  
  return (
    <div className="page-container">
      <div className="app-bg" />
      
      {/* THEME SELECTION */}
      {setupStep === 'theme' && (
        <div className="page-center animate-fade-in">
          <div>
            <h1 className="title-lg">{t.chooseTheme}</h1>
            <p className="subtitle" style={{ marginTop: 'var(--space-sm)' }}>{t.chooseThemeSub}</p>
          </div>
          
          <div className="theme-grid">
            {themeKeys.map((key, i) => {
              const theme = THEMES[key];
              const themeNameKey = `theme${key.charAt(0).toUpperCase() + key.slice(1)}`;
              return (
                <button
                  key={key}
                  className={`glass-card theme-card ${gameState.theme === key ? 'selected' : ''}`}
                  onClick={() => handleThemeSelect(key)}
                  style={{ animationDelay: `${0.05 * i}s` }}
                  id={`theme-${key}`}
                >
                  <span className="theme-emoji">{theme.emoji}</span>
                  <span className="theme-name">{t[themeNameKey]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* AGE INPUT */}
      {setupStep === 'age' && (
        <div className="page-center animate-fade-in">
          <div>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)' }}>🎂</span>
            <h1 className="title-lg">{t.ageTitle}</h1>
            <p className="subtitle" style={{ marginTop: 'var(--space-sm)' }}>{t.ageSub}</p>
          </div>
          
          <div className="age-slider-container">
            <div className="age-display">{gameState.youngestAge}</div>
            <input
              type="range"
              min="3"
              max="14"
              value={gameState.youngestAge}
              onChange={(e) => gameState.setYoungestAge(Number(e.target.value))}
              className="age-slider"
              id="age-slider"
            />
            <div className="age-label">
              {gameState.youngestAge} {t.ageLabel}
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={handleAgeConfirm} id="age-confirm">
            {t.confirm}
          </button>
        </div>
      )}
      
      {/* PLAYER INTRODUCTION */}
      {setupStep === 'intro' && (
        <div className="page-center animate-fade-in">
          {/* Narrator bubble */}
          <div className="narrator-bubble" style={{ width: '100%', maxWidth: '700px' }}>
            <span className="narrator-emoji">{narratorEmoji}</span>
            <p className="narrator-text">"{t.welcomeNarrator}"</p>
          </div>
          
          <div className="glass-card-static" style={{ width: '100%', maxWidth: '700px', padding: 'var(--space-xl)' }}>
            <h2 className="title-md" style={{ marginBottom: 'var(--space-sm)' }}>{t.introTitle}</h2>
            <p className="subtitle" style={{ marginBottom: 'var(--space-xl)' }}>{t.introSub}</p>
            
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
              {speech.hasRecognition && (
                <button
                  className={`btn-mic ${speech.isListening ? 'listening' : ''}`}
                  onClick={speech.toggleListen}
                  id="mic-intro"
                >
                  {speech.isListening ? '⏹' : '🎤'}
                </button>
              )}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.introPlaceholder}
                className="input-field"
                disabled={isProcessing}
                onKeyDown={(e) => e.key === 'Enter' && handleIntroSubmit()}
                id="intro-input"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
              <button
                className="btn btn-primary"
                onClick={handleIntroSubmit}
                disabled={isProcessing || !inputText.trim()}
                id="intro-submit"
              >
                {isProcessing ? '...' : t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
