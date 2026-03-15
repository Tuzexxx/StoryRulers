import React from 'react';
import translations from '../i18n/translations';

const languages = ['en', 'de', 'es', 'cs'];

// SVG flags for countries (clean, crisp at any size)
const flags = {
  en: (
    <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" clipPath="url(#ukclip)"/>
      <clipPath id="ukclip"><path d="M30,0 L60,0 L60,20 Z M60,20 L60,40 L30,40 Z M30,40 L0,40 L0,20 Z M0,20 L0,0 L30,0 Z"/></clipPath>
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  ),
  de: (
    <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <rect width="60" height="13.33" fill="#000"/>
      <rect y="13.33" width="60" height="13.34" fill="#DD0000"/>
      <rect y="26.67" width="60" height="13.33" fill="#FFCC00"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <rect width="60" height="10" fill="#AA151B"/>
      <rect y="10" width="60" height="20" fill="#F1BF00"/>
      <rect y="30" width="60" height="10" fill="#AA151B"/>
    </svg>
  ),
  cs: (
    <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <rect width="60" height="20" fill="#FFFFFF"/>
      <rect y="20" width="60" height="20" fill="#D7141A"/>
      <polygon points="0,0 30,20 0,40" fill="#11457E"/>
    </svg>
  ),
};

export default function LanguageSelect({ onSelect }) {
  return (
    <div className="page-container">
      <div className="app-bg" />
      <div className="page-center">
        <div className="animate-fade-in-scale" style={{ marginBottom: 'var(--space-md)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-md)' }}>🌍</span>
          <h1 className="title-xl">StoryRulers</h1>
        </div>
        
        <p className="subtitle animate-fade-in-up" style={{ animationDelay: '0.1s', maxWidth: '400px' }}>
          Choose your language to begin the adventure!
        </p>
        
        <div className="lang-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {languages.map((code, i) => {
            const t = translations[code];
            return (
              <button
                key={code}
                className="glass-card lang-card"
                onClick={() => onSelect(code)}
                style={{ animationDelay: `${0.1 * i}s` }}
                id={`lang-${code}`}
              >
                <span className="lang-flag">{flags[code]}</span>
                <span className="lang-name">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
