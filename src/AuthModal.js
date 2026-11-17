import React, { useState } from 'react';

const API_BASE = 'http://process.env.REACT_APP_API_URL/api';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? '/auth/register' : '/auth/login';

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Save token and user details to localStorage
      localStorage.setItem('studio_token', data.token);
      localStorage.setItem('studio_user', JSON.stringify(data.user));

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FAF9F6',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #E5E0D8',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#7A7267'
          }}
        >
          ✕
        </button>

        <h2 style={{
          textAlign: 'center',
          fontFamily: "'Georgia', serif",
          fontWeight: '400',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontSize: '20px',
          marginBottom: '8px',
          color: '#2C2A29'
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#7A7267',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '28px'
        }}>
          {isSignUp ? 'Join our artisan collective' : 'Sign in to manage your studio'}
        </p>

        {error && (
          <div style={{
            background: '#FDF2F2',
            color: '#9B1C1C',
            padding: '10px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #F8B4B4',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4A3B32', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E0D8',
                  background: '#FFF',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4A3B32', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E0D8',
                background: '#FFF',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4A3B32', display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E0D8',
                background: '#FFF',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '12px',
              padding: '12px',
              background: '#2C2A29',
              color: '#FAF9F6',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Register' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#7A7267' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4A3B32',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;