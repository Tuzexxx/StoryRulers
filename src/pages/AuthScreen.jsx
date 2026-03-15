import React, { useState } from 'react';
import { signIn, signUp } from '../api/supabase';

/**
 * Auth component: Login / Sign Up form
 */
export default function AuthScreen({ onAuth, onSkip, language }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const labels = {
    en: { login: 'Log In', signup: 'Sign Up', email: 'Email', password: 'Password', toggle: 'or', skip: 'Play without account', error: 'Something went wrong' },
    de: { login: 'Anmelden', signup: 'Registrieren', email: 'E-Mail', password: 'Passwort', toggle: 'oder', skip: 'Ohne Konto spielen', error: 'Etwas ist schiefgelaufen' },
    es: { login: 'Iniciar sesión', signup: 'Registrarse', email: 'Correo electrónico', password: 'Contraseña', toggle: 'o', skip: 'Jugar sin cuenta', error: 'Algo salió mal' },
    cs: { login: 'Přihlásit se', signup: 'Registrovat se', email: 'E-mail', password: 'Heslo', toggle: 'nebo', skip: 'Hrát bez účtu', error: 'Něco se pokazilo' },
  };
  
  const t = labels[language] || labels.en;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        const data = await signUp(email, password);
        onAuth(data.user);
      } else {
        const data = await signIn(email, password);
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="app-bg" />
      <div className="page-center">
        <div className="animate-fade-in-scale">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)' }}>🔐</span>
          <h1 className="title-lg">{isSignUp ? t.signup : t.login}</h1>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="glass-card-static animate-fade-in-up"
          style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="settings-label">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="email"
              id="auth-email"
            />
          </div>
          
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="settings-label">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              id="auth-password"
            />
          </div>
          
          {error && (
            <p className="animate-fade-in" style={{
              color: '#f87171',
              fontSize: '0.9rem',
              marginBottom: 'var(--space-md)',
              background: 'rgba(239,68,68,0.08)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-sm)',
            }}>
              ⚠️ {error}
            </p>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            id="auth-submit"
          >
            {loading ? '...' : (isSignUp ? t.signup : t.login)}
          </button>
          
          <div className="text-center" style={{ marginBottom: 'var(--space-md)' }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              {t.toggle} {isSignUp ? t.login : t.signup}
            </button>
          </div>
        </form>
        
        <button
          onClick={onSkip}
          className="btn btn-secondary animate-fade-in-up"
          style={{ animationDelay: '0.2s', fontSize: '0.95rem' }}
          id="auth-skip"
        >
          {t.skip}
        </button>
      </div>
    </div>
  );
}
