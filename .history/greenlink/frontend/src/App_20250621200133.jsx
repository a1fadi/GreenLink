import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [userClub, setUserClub] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [clubMode, setClubMode] = useState('join');
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'PLAYER'
  });
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    location: '',
    clubCode: ''
  });

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('greenlink_user');
    const savedClub = localStorage.getItem('greenlink_club');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedClub) {
      setUserClub(JSON.parse(savedClub));
    }
  }, []);

  // Authentication functions
  const handleAuth = async (isSignup) => {
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    const payload = isSignup ? authForm : {
      username: authForm.username,
      password: authForm.password
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('greenlink_user', JSON.stringify(data));
        setAuthForm({ username: '', email: '', password: '', fullName: '', role: 'PLAYER' });
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  // Club functions
  const createClub = async () => {
    if (!clubForm.name.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clubForm.name,
          description: clubForm.description,
          location: clubForm.location,
          ownerId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUserClub(data);
        localStorage.setItem('greenlink_club', JSON.stringify(data));
        setClubForm({ name: '', description: '', location: '', clubCode: '' });
        alert(`Club created! Club code: ${data.clubCode}`);
      } else {
        alert(data.error || 'Club creation failed');
      }
    } catch (error) {
      console.error('Club creation error:', error);
      alert('Club creation failed');
    }
  };

  const joinClub = async () => {
    if (!clubForm.clubCode.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/clubs/code/${clubForm.clubCode}`);
      const data = await response.json();

      if (response.ok) {
        setUserClub(data);
        localStorage.setItem('greenlink_club', JSON.stringify(data));
        setClubForm({ name: '', description: '', location: '', clubCode: '' });
        alert(`Joined ${data.name}!`);
      } else {
        alert(data.error || 'Club not found');
      }
    } catch (error) {
      console.error('Join club error:', error);
      alert('Failed to join club');
    }
  };

  const logout = () => {
    setUser(null);
    setUserClub(null);
    localStorage.removeItem('greenlink_user');
    localStorage.removeItem('greenlink_club');
  };

  // If not logged in, show auth form
  if (!user) {
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
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Email"
                      className="input"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className="input"
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      className="input"
                      value={authForm.role}
                      onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
                    >
                      <option value="PLAYER">Player</option>
                      <option value="MANAGER">Manager/Coach</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Password"
                  className="input"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                />
              </div>

              <button 
                className="button"
                onClick={() => handleAuth(authMode === 'signup')}
              >
                {authMode === 'signup' ? 'Create Account' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If logged in but no club, show club selection
  if (user && !userClub) {
    return (
      <div className="gradient-bg">
        <div style={{padding: '1rem'}}>
          {/* Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <div>
              <h1 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold'}}>
                Welcome {user.fullName}!
              </h1>
              <p style={{color: 'rgba(255,255,255,0.8)'}}>Role: {user.role}</p>
            </div>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>

          <div className="center" style={{minHeight: '60vh'}}>
            <div className="container">
              <div className="glass-card" style={{padding: '2rem'}}>
                <h2 style={{textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold'}}>
                  {user.role === 'MANAGER' ? 'Manage Your Club' : 'Join a Club'}
                </h2>

                {user.role === 'MANAGER' && (
                  <div className="toggle-group">
                    <button 
                      className={`toggle-button ${clubMode === 'create' ? 'active' : ''}`}
                      onClick={() => setClubMode('create')}
                    >
                      Create Club
                    </button>
                    <button 
                      className={`toggle-button ${clubMode === 'join' ? 'active' : ''}`}
                      onClick={() => setClubMode('join')}
                    >
                      Join Club
                    </button>
                  </div>
                )}

                {(clubMode === 'create' && user.role === 'MANAGER') ? (
                  <>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Club Name"
                        className="input"
                        value={clubForm.name}
                        onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Location"
                        className="input"
                        value={clubForm.location}
                        onChange={(e) => setClubForm({...clubForm, location: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <textarea 
                        placeholder="Description (optional)"
                        className="input"
                        value={clubForm.description}
                        onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                        rows="3"
                      />
                    </div>
                    <button className="button" onClick={createClub}>
                      Create Club
                    </button>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Club Code (e.g., EAGLES1234)"
                        className="input"
                        value={clubForm.clubCode}
                        onChange={(e) => setClubForm({...clubForm, clubCode: e.target.value.toUpperCase()})}
                        style={{textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem'}}
                      />
                    </div>
                    <button className="button" onClick={joinClub}>
                      Join Club
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main club dashboard
  return (
    <div className="gradient-bg" style={{minHeight: '100vh'}}>
      <div style={{padding: '1rem'}}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h1 style={{color: 'white', fontSize: '1.8rem', fontWeight: 'bold'}}>
              {userClub.name}
            </h1>
            <p style={{color: 'rgba(255,255,255,0.8)'}}>
              {user.fullName} ({user.role}) • Code: {userClub.clubCode}
            </p>
          </div>
          <button 
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Club Info */}
        <div className="glass-card" style={{padding: '2rem', marginBottom: '2rem'}}>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            Welcome to {userClub.name}!
          </h2>
          {userClub.description && (
            <p style={{color: '#6b7280', marginBottom: '1rem', fontSize: '1.1rem'}}>
              {userClub.description}
            </p>
          )}
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {userClub.location && (
              <span style={{
                background: '#f3f4f6',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#374151'
              }}>
                📍 {userClub.location}
              </span>
            )}
            <span style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              👥 {userClub.memberCount || 0} Members
            </span>
            <span style={{
              background: '#dbeafe',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              🏆 {userClub.teamCount || 0} Teams
            </span>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Teams</h3>
            <p style={{color: '#6b7280', marginBottom: '1rem'}}>Manage your club's teams and rosters</p>
            <button className="button">View Teams</button>
          </div>
          
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Messages</h3>
            <p style={{color: '#6b7280', marginBottom: '1rem'}}>Team communications and announcements</p>
            <button className="button">View Messages</button>
          </div>
          
          <div className="glass-card" style={{padding: '1.5rem'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Matches</h3>
            <p style={{color: '#6b7280', marginBottom: '1rem'}}>Live tracking and match history</p>
            <button className="button">View Matches</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;