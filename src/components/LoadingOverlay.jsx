import React, { useState, useEffect } from 'react';
import translations, { THEMES } from '../i18n/translations';

/**
 * Full-screen loading overlay with themed animations and fun messages
 */
export default function LoadingOverlay({ theme, language, isVisible }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  
  const t = translations[language] || translations.en;
  const themeData = THEMES[theme] || THEMES.royal;
  
  // Rotate through messages
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % t.loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible, t.loadingMessages.length]);
  
  // Rotate through characters
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCharIndex(prev => (prev + 1) % themeData.characters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible, themeData.characters.length]);
  
  if (!isVisible) return null;
  
  return (
    <div className="loading-overlay">
      {/* Background decorative emojis */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {themeData.characters.map((char, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${2 + Math.random() * 2}rem`,
              opacity: 0.08,
              top: `${10 + (i * 15) % 80}%`,
              left: `${5 + (i * 20) % 90}%`,
              animation: `floatBlob1 ${15 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * -2}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
      
      {/* Main character */}
      <div className="loading-character">
        {themeData.characters[charIndex]}
      </div>
      
      {/* Message */}
      <div className="loading-message" key={messageIndex}>
        {t.loadingMessages[messageIndex]}
      </div>
      
      {/* Bouncing dots */}
      <div className="loading-spinner">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  );
}
