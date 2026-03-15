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
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)' }}>☁️</span>
          <h1 className="title-lg">{isSignUp ? t.signup : t.login}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
            Secure your Kingdom in the cloud so you never lose your storybook!
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Google Auth Placeholder */}
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: '100%', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => alert('Google login configured in production!')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34a853"/><path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.044l3.007-2.332z" fill="#fbbc05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#ea4335"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-lg)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <hr style={{ flex: 1, opacity: 0.2 }} /> <span>OR EMAIL</span> <hr style={{ flex: 1, opacity: 0.2 }} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card-static animate-fade-in-up"
            style={{ padding: 'var(--space-xl)', width: '100%' }}
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
            
            <div className="text-center">
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
        </div>
        
        <button
          onClick={onSkip}
          className="btn btn-secondary animate-fade-in-up"
          style={{ animationDelay: '0.2s', fontSize: '0.95rem', marginTop: 'var(--space-lg)' }}
          id="auth-skip"
        >
          {t.skip}
        </button>
      </div>
    </div>
  );
}
