import React, { useState } from 'react';
import translations from '../i18n/translations';
import { getApiKey, setApiKey } from '../api/gemini';
import { signOut, supabase } from '../api/supabase';

/**
 * Settings page: API key, account, language change, clear data
 */
export default function Settings({ gameState, onBack, onNavigate, onChangeLang, user }) {
  const t = translations[gameState.language] || translations.en;
  
  const handleClearData = () => {
    if (window.confirm(t.clearConfirm)) {
      gameState.resetGame();
      onChangeLang();
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const handleThemeChange = (themeKey) => {
    gameState.setTheme(themeKey);
    document.documentElement.setAttribute('data-theme', themeKey);
  };
  
  const themeKeys = ['royal', 'space', 'wizard', 'underwater', 'forest'];

  return (
    <>
      <nav className="top-nav">
        <div className="nav-title">⚙️ {t.settingsTitle}</div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={onBack} id="settings-back">
            ← {t.back}
          </button>
        </div>
      </nav>
      
      <div className="page-container" style={{ paddingTop: 'var(--space-xl)' }}>
        <div className="app-bg" />
        
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {/* User Account */}
          {supabase && (
            <div className="glass-card-static animate-fade-in" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
              <div className="settings-section">
                <label className="settings-label">👤 Account</label>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      ✅ {user.email}
                    </span>
                    <button className="btn btn-secondary" onClick={handleSignOut} style={{ fontSize: '0.85rem' }}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      Playing without an account.
                    </p>
                    <button className="btn btn-primary" onClick={() => onNavigate('auth')} style={{ fontSize: '0.85rem' }}>
                      Sign In to Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* World Switcher */}
          <div className="glass-card-static animate-fade-in" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', animationDelay: '0.05s' }}>
            <div className="settings-section">
              <label className="settings-label">🌍 Change World</label>
              <div className="theme-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', marginTop: 'var(--space-md)' }}>
                {themeKeys.map((key) => {
                  const theme = THEMES[key];
                  const themeNameKey = `theme${key.charAt(0).toUpperCase() + key.slice(1)}`;
                  const isSelected = gameState.theme === key;
                  return (
                    <button
                      key={key}
                      className={`glass-card theme-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleThemeChange(key)}
                      style={{ padding: 'var(--space-md) var(--space-xs)' }}
                    >
                      <span className="theme-emoji" style={{ fontSize: '1.5rem' }}>{theme.emoji}</span>
                      <span className="theme-name" style={{ fontSize: '0.8rem' }}>{t[themeNameKey]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="glass-card-static animate-fade-in-up" style={{ padding: 'var(--space-xl)', animationDelay: '0.1s' }}>
            <div className="settings-section" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="settings-label">🌐 {t.changeLang}</label>
              <button className="btn btn-secondary" onClick={onChangeLang} id="change-lang" style={{ fontSize: '0.95rem' }}>
                {t.changeLang}
              </button>
            </div>
            
            <div className="settings-section">
              <label className="settings-label">🗑️ {t.clearData}</label>
              <button
                className="btn btn-secondary"
                onClick={handleClearData}
                id="clear-data"
                style={{ fontSize: '0.95rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
              >
                {t.clearData}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
