import React, { useState } from 'react';
import translations from '../i18n/translations';
import { getApiKey, setApiKey } from '../api/gemini';
import { signOut, supabase } from '../api/supabase';

/**
 * Settings page: API key, account, language change, clear data
 */
export default function Settings({ gameState, onBack, onChangeLang, user }) {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);
  
  const t = translations[gameState.language] || translations.en;
  
  const handleSaveKey = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Playing without an account. Your data is saved locally only.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* API Key */}
          <div className="glass-card-static animate-fade-in" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', animationDelay: '0.05s' }}>
            <div className="settings-section">
              <label className="settings-label">🔑 {t.apiKeyLabel}</label>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
                Get your free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>aistudio.google.com/apikey</a>
              </p>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="input-field"
                style={{ marginBottom: 'var(--space-md)' }}
                id="api-key-input"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <button className="btn btn-primary" onClick={handleSaveKey} id="save-key" style={{ fontSize: '0.95rem' }}>
                  {t.saveKey}
                </button>
                {saved && (
                  <span className="animate-fade-in" style={{ color: '#4ade80', fontWeight: 600 }}>
                    ✓ {t.apiKeySaved}
                  </span>
                )}
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
