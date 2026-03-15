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
      const characters = JSON.stringify(gameState.characterRegistry);
      
      const ageContext = gameState.youngestAge <= 3
        ? 'Age 2-3: Use sensory words, simple sounds, bright colors, and physical slapstick humor. Very short sentences.'
        : gameState.youngestAge <= 4
        ? 'Age 4: Simple story logic, basic emotions (happy/sad), repetitive elements, and magical/whimsical results.'
        : gameState.youngestAge <= 6
        ? 'Age 5-6: Concrete social dilemmas (sharing, kindness, bravery). Characters should be very clear in their motivations.'
        : gameState.youngestAge <= 8
        ? 'Age 7-8: Focus on fairness, empathy, and the immediate consequences of choices. Minor moral dilemmas.'
        : 'Age 9+: Complex narratives, moral ambiguity, strategic thinking, and long-term kingdom-wide impact.';
      
      const prompt = `
        Game Setting: ${themeName} (theme: ${gameState.theme}).
        World Memory: ${memoryString || 'Fresh start'}.
        Known Characters: ${characters}.
        Youngest Player Age: ${gameState.youngestAge}. 
        
        Guidelines:
        - ${ageContext}
        - Story Conflict: Create a "Dilemma of the Heart" – a situation requiring moral choice, compromise, or creative kindness.
        - Emotional Intelligence (EQ): Describe exactly how the petitioner feels and why.
        - Character Persistence: Use "Known Characters" if fitting.
        
        Create a new petitioner from the ${themeName} theme.
        
        Return STRICT JSON:
        {
          "name": "Character name (in ${t.code})",
          "emoji": "single character emoji",
          "emotionEmoji": "single emotion emoji (e.g. 😢, 😡, 😨)",
          "emotionText": "How they feel (max 1 sentence, in ${t.code})",
          "story": "The conflict/dilemma (max 3 sentences, in ${t.code})",
          "request": "The specific choice for the rulers (in ${t.code})",
          "discussion": "A question for parents about the moral/social side (in ${t.code})",
          "isReturning": boolean
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
      gameState.upsertCharacter(pet.name, {
        emoji: pet.emoji,
        lastInteraction: decisionText,
        theme: gameState.theme
      });
      
      // Generate chronicle entry + Virtue evaluation
      const publicPrompt = `
        Process this case for a public chronicle and evaluate the rulers' virtue.
        Case: ${pet.name} — ${pet.story}
        Decision: ${decisionText}
        
        Return STRICT JSON:
        {
          "title": "Short title (in ${t.code})",
          "description": "One sentence result (in ${t.code})",
          "reflection": "A gentle follow-up question for the narrator to ask the kids about their choice (in ${t.code})",
          "virtue": "Which kingdom virtue was shown? (Kindness, Bravery, Wisdom, or Fairness)",
          "imagePromptEn": "English prompt for storybook illustration style, colorful. Theme: ${gameState.theme}."
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
      const feedback = `${pubData.description} ${pubData.reflection}`;
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
            {!gameState.userId && (
              <button 
                className="nav-btn btn-cloud-save" 
                onClick={() => onNavigate('auth')}
                id="nav-save"
                title="Save to Cloud"
              >
                ☁️ Save
              </button>
            )}
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
        
        {/* Petitioner Card */}
        {pet && !isLoading && (
          <div className="glass-card-static petitioner-card">
            <div className="petitioner-header">
              <span className="petitioner-emoji">{pet.emoji}</span>
              <div>
                <h3 className="petitioner-name">
                  {pet.name} {pet.emotionEmoji}
                </h3>
                <span className="petitioner-badge">{t.newRequest}</span>
              </div>
            </div>
            
            <div className="petitioner-body">
              {/* Emotion */}
              {pet.emotionText && (
                <div className="emotion-box">
                  <span className="emotion-label">Feeling:</span> {pet.emotionText}
                </div>
              )}
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
