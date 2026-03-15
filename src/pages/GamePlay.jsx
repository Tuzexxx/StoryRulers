import React, { useState, useEffect, useCallback } from 'react';
import translations, { THEMES } from '../i18n/translations';
import LoadingOverlay from '../components/LoadingOverlay';
import { fetchStory, fetchImage } from '../api/gemini';

/**
 * Main game loop: Petitioner appears → Player decides → Chronicle entry
 */
export default function GamePlay({ gameState, speech, onNavigate }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [narratorText, setNarratorText] = useState('');
  const [error, setError] = useState(null);
  
  const t = translations[gameState.language] || translations.en;
  const themeData = THEMES[gameState.theme] || THEMES.royal;
  const themeNameKey = `theme${(gameState.theme || 'royal').charAt(0).toUpperCase() + (gameState.theme || 'royal').slice(1)}`;
  
  // Sync transcript from speech recognition
  useEffect(() => {
    if (speech.transcript) {
      setInputText(prev => prev + (prev ? ' ' : '') + speech.transcript);
      speech.clearTranscript();
    }
  }, [speech.transcript]);
  
  // Generate first petitioner on mount (if none exists)
  useEffect(() => {
    if (!gameState.currentPetitioner && !isLoading) {
      generateNextCase();
    }
  }, []); // Only on mount
  
  const generateNextCase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const memoryString = (gameState.worldMemory || []).join(' | ');
      const themeName = t[themeNameKey] || 'Royal Court';
      
      const ageContext = gameState.youngestAge <= 5
        ? 'Use very simple words, short sentences, and very silly problems. The story should be extremely easy to understand for a small child.'
        : gameState.youngestAge <= 8
        ? 'Use simple language and fun, silly problems. Keep sentences short and engaging.'
        : 'Use creative and slightly more complex scenarios, but keep it fun and appropriate for children.';
      
      const prompt = `
        Game setting: ${themeName} (theme: ${gameState.theme}).
        Current kingdom state: ${memoryString || 'Fresh start, no previous cases'}.
        Youngest player age: ${gameState.youngestAge}. ${ageContext}
        
        Create a new, funny petitioner (a fairy-tale creature, magical being, or animal fitting the ${themeName} theme) who comes to the rulers with a problem.
        The problem should be creative, non-violent, and humorous.
        
        Return STRICT JSON:
        {
          "name": "Character name (in ${t.code})",
          "emoji": "single fitting emoji",
          "story": "Short problem description (max 3 sentences, in ${t.code})",
          "request": "What exactly they ask the rulers to do (in ${t.code})",
          "discussion": "One brief discussion question for parents to ask kids (in ${t.code})"
        }
      `;
      
      const resText = await fetchStory(prompt, t.systemStoryteller, true);
      const petitioner = JSON.parse(resText);
      
      gameState.setCurrentPetitioner(petitioner);
      
      const spokenText = `${petitioner.name}. ${petitioner.story} ${petitioner.request}`;
      setNarratorText(spokenText);
      speech.speak(spokenText);
      
    } catch (e) {
      console.error('Generate case error:', e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [gameState.worldMemory, gameState.theme, gameState.youngestAge, t]);
  
  const handleDecisionSubmit = async () => {
    if (!inputText.trim() || !gameState.currentPetitioner) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const decisionText = inputText;
      const pet = gameState.currentPetitioner;
      const memoryEntry = `Case: ${pet.name}. Rulers decided: ${decisionText}.`;
      
      gameState.addWorldMemory(memoryEntry);
      
      // Generate chronicle entry
      const publicPrompt = `
        Process this resolved case for a public illustrated chronicle.
        Case: ${pet.name} — ${pet.story}
        Decision: ${decisionText}
        
        Return STRICT JSON:
        {
          "title": "Short witty title (max 5 words, in ${t.code})",
          "description": "One sentence about what the rulers decided and how it turned out (in ${t.code})",
          "imagePromptEn": "English prompt for an AI image generator describing the happy ending of this fairy tale situation. Include 'children storybook illustration style, colorful, cheerful'. Theme: ${gameState.theme}."
        }
      `;
      
      const pubResText = await fetchStory(publicPrompt, t.systemChronicler, true);
      const pubData = JSON.parse(pubResText);
      
      // Add chronicle entry immediately (image loading)
      const entryIndex = gameState.publicChronicle.length;
      gameState.addChronicleEntry({
        ...pubData,
        imageUrl: null,
        loading: true,
        petitionerEmoji: pet.emoji,
        petitionerName: pet.name,
      });
      
      // Generate image in background
      fetchImage(pubData.imagePromptEn)
        .then(img => gameState.updateChronicleImage(entryIndex, img))
        .catch(() => gameState.updateChronicleImage(entryIndex, null));
      
      // Feedback and next case
      const feedback = pubData.description;
      setNarratorText(feedback);
      speech.speak(feedback, () => {
        generateNextCase();
      });
      
    } catch (e) {
      console.error('Decision error:', e);
      setError(e.message);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };
  
  const pet = gameState.currentPetitioner;
  
  return (
    <>
      <LoadingOverlay
        theme={gameState.theme}
        language={gameState.language}
        isVisible={isLoading}
      />
      
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="nav-title">
          {themeData.emoji} {t.appTitle}
        </div>
        <div className="nav-actions">
          <button
            className="nav-btn"
            onClick={() => { speech.stopSpeaking(); onNavigate('chronicle'); }}
            id="nav-chronicle"
          >
            📖 {t.chronicle}
            {gameState.publicChronicle.length > 0 && (
              <span className="nav-badge">{gameState.publicChronicle.length}</span>
            )}
          </button>
          <button
            className="nav-btn"
            onClick={() => onNavigate('settings')}
            id="nav-settings"
          >
            ⚙️
          </button>
        </div>
      </nav>
      
      <div className="page-container" style={{ paddingTop: 'var(--space-lg)' }}>
        <div className="app-bg" />
        
        {/* Error message */}
        {error && (
          <div className="glass-card-static animate-fade-in" style={{
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.08)',
          }}>
            <p style={{ color: '#f87171', marginBottom: 'var(--space-sm)' }}>⚠️ {error}</p>
            <button className="btn btn-secondary" onClick={generateNextCase} style={{ fontSize: '0.9rem' }}>
              Try again
            </button>
          </div>
        )}
        
        {/* Narrator Bubble */}
        {narratorText && !isLoading && (
          <div className="narrator-bubble" style={{ marginBottom: 'var(--space-xl)' }}>
            <span className="narrator-emoji">{themeData.narrator}</span>
            <p className="narrator-text">"{narratorText}"</p>
          </div>
        )}
        
        {/* Petitioner Card */}
        {pet && !isLoading && (
          <div className="glass-card-static petitioner-card">
            <div className="petitioner-header">
              <span className="petitioner-emoji">{pet.emoji}</span>
              <div>
                <h3 className="petitioner-name">{pet.name}</h3>
                <span className="petitioner-badge">{t.newRequest}</span>
              </div>
            </div>
            
            <div className="petitioner-body">
              {/* Problem */}
              <div className="problem-box">
                <div className="problem-label">{t.problemLabel}</div>
                <p className="problem-text">{pet.story} {pet.request}</p>
              </div>
              
              {/* Parent Hint */}
              <div className="hint-box">
                <p className="hint-text">
                  <strong>{t.hintLabel}:</strong> {pet.discussion}
                </p>
              </div>
              
              {/* Decision Input */}
              <div className="decision-area">
                <div className="decision-label">{t.decisionLabel}</div>
                <div className="decision-input-row">
                  {speech.hasRecognition && (
                    <button
                      className={`btn-mic ${speech.isListening ? 'listening' : ''}`}
                      onClick={speech.toggleListen}
                      id="mic-decision"
                    >
                      {speech.isListening ? '⏹' : '🎤'}
                    </button>
                  )}
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.decisionPlaceholder}
                    className="input-field"
                    rows="3"
                    disabled={isLoading}
                    id="decision-input"
                  />
                </div>
                <div className="decision-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleDecisionSubmit}
                    disabled={isLoading || !inputText.trim()}
                    id="submit-decision"
                  >
                    {isLoading ? t.processing : t.sealDecision}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
