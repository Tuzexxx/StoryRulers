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
        - Perspective: First-Person Complaint. The character arrives because something interesting happened TO them (e.g., "A giant sneezed on my haystacks!", "My magical boots won't stop dancing!").
        - Plot-First: Focus on a fun, weird, or funny world event. Don't worry about being "educational" – let the situation speak for itself.
        - Plot Twist: If fitting, add a tiny surprising detail about the situation.
        
        Create a new petitioner from the ${themeName} theme.
        
        Return STRICT JSON:
        {
          "name": "Character name (in ${t.code})",
          "emoji": "single character emoji",
          "emotionEmoji": "emotion emoji (how they feel about the event)",
          "emotionText": "Why they feel this way (max 1 sentence, in ${t.code})",
          "story": "The event/plot (2-3 sentences max, in ${t.code})",
          "proposedFix": "The character's own biased/selfish/hasty 'quick fix' (1 sentence, in ${t.code})",
          "request": "A question asking the rulers to approve their fix or find a better one (in ${t.code})",
          "discussion": "A curious question for parents to discuss the plot (in ${t.code})",
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
        Record this interesting event in the public chronicle.
        Case: ${pet.name} — ${pet.story}
        Rulers' Action: ${decisionText}
        
        Return STRICT JSON:
        {
          "title": "Fun headline (in ${t.code}, e.g., 'The Case of the Dancing Boots')",
          "description": "One sentence about the outcome (in ${t.code})",
          "reflection": "A curious 'Plot Reflection' question about the situation (in ${t.code})",
          "virtue": "The dominant virtue shown (Kindness, Bravery, Wisdom, or Fairness)",
          "imagePromptEn": "Detailed storybook illustration, colorful, showing the funny scene. Theme: ${gameState.theme}."
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
                <p className="problem-text">{pet.story}</p>
              </div>

              {/* Proposed Quick Fix */}
              {pet.proposedFix && (
                <div className="glass-card-static" style={{ 
                  marginTop: 'var(--space-md)', 
                  padding: 'var(--space-md)',
                  background: 'rgba(var(--accent-primary-rgb), 0.05)',
                  borderLeft: '4px solid var(--accent-primary)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem'
                }}>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.7 }}>
                    💡 {t.proposedFixLabel}
                  </strong>
                  "{pet.proposedFix}"
                </div>
              )}
              
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <p className="problem-text" style={{ fontWeight: 600 }}>{pet.request}</p>
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
