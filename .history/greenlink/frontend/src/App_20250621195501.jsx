import React, { useState } from 'react';

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  return (
    <div className="gradient-bg">
      <div className="center">
        <div className="container">
          <div className="glass-card" style={{padding: '2rem'}}>
            {/* Logo */}
            <div className="logo">🏈</div>
            
            {/* Title */}
            <h1 className="title">GreenLink</h1>
            <p className="subtitle">Football Team Management</p>

            {/* Toggle */}
            <div className="toggle-group">
              <button 
                className={`toggle-button ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button 
                className={`toggle-button ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Username"
                className="input"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
              />
            </div>

            {authMode === 'signup' && (
              <>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Email"
                    className="input"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="input"
                    value={form.fullName}
                    onChange={(e) => setForm({...form, fullName: e.target.value})}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <input 
                type="password" 
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
            </div>

            <button className="button">
              {authMode === 'signup' ? 'Create Account' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;