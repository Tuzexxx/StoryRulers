import React from 'react';
import translations, { THEMES } from '../i18n/translations';

/**
 * Chronicle gallery — illustrated record of resolved cases
 */
export default function Chronicle({ gameState, onBack }) {
  const t = translations[gameState.language] || translations.en;
  const themeData = THEMES[gameState.theme] || THEMES.royal;
  
  return (
    <>
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="nav-title">
          {themeData.emoji} {t.appTitle}
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={onBack} id="nav-back-game">
            ← {t.backToGame}
          </button>
        </div>
      </nav>
      
      <div className="page-container" style={{ paddingTop: 'var(--space-lg)' }}>
        <div className="app-bg" />
        
        <div className="text-center animate-fade-in" style={{ marginBottom: 'var(--space-2xl)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)' }}>📖</span>
          <h1 className="title-lg">{t.chronicleTitle}</h1>
          <p className="subtitle" style={{ marginTop: 'var(--space-sm)' }}>{t.chronicleSub}</p>
        </div>
        
        {gameState.publicChronicle.length === 0 ? (
          <div className="glass-card-static animate-fade-in text-center" style={{ padding: 'var(--space-3xl)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)', opacity: 0.5 }}>📜</span>
            <p className="subtitle">{t.chronicleEmpty}</p>
          </div>
        ) : (
          <div className="chronicle-grid">
            {gameState.publicChronicle.map((entry, i) => (
              <div
                key={i}
                className="glass-card-static chronicle-entry animate-fade-in-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="chronicle-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{entry.petitionerEmoji}</span>
                    <h3 className="chronicle-title">{entry.title}</h3>
                  </div>
                  <p className="chronicle-desc">{entry.description}</p>
                </div>
                
                <div className="chronicle-image">
                  {entry.loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <div className="loading-spinner">
                        <div className="loading-dot" />
                        <div className="loading-dot" />
                        <div className="loading-dot" />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.paintingImage}</span>
                    </div>
                  ) : entry.imageUrl ? (
                    <img src={entry.imageUrl} alt={entry.title} style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }} />
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.imageFailed}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center" style={{ marginTop: 'var(--space-2xl)', paddingBottom: 'var(--space-xl)' }}>
          <button className="btn btn-primary" onClick={onBack} id="chronicle-back">
            {t.backToGame}
          </button>
        </div>
      </div>
    </>
  );
}
