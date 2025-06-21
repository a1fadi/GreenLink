import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, LogOut, UserPlus, LogIn, Building, Code, Shield, Star, Trophy, MapPin, Calendar, ChevronRight } from 'lucide-react';

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

  // If not logged in, show beautiful auth form
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                GreenLink
              </h1>
              <p className="text-gray-600">Football Team Management</p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex p-1 mb-6 bg-gray-100 rounded-xl">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${authMode === 'login' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <LogIn className="inline mr-2" size={16} />
                Login
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${authMode === 'signup' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <UserPlus className="inline mr-2" size={16} />
                Sign Up
              </button>
            </div>

            {/* Auth Form */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                  required
                />
                <Users className="absolute left-4 top-4 text-gray-400" size={20} />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                      required
                    />
                    <span className="absolute left-4 top-4 text-gray-400">@</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                      required
                    />
                    <Star className="absolute left-4 top-4 text-gray-400" size={20} />
                  </div>
                  <div className="relative">
                    <select
                      value={authForm.role}
                      onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 appearance-none"
                    >
                      <option value="PLAYER">Player</option>
                      <option value="MANAGER">Manager/Coach</option>
                    </select>
                    <Shield className="absolute left-4 top-4 text-gray-400" size={20} />
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                  required
                />
                <span className="absolute left-4 top-4 text-gray-400">🔒</span>
              </div>

              <button
                onClick={() => handleAuth(authMode === 'signup')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {authMode === 'signup' ? 'Create Account' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rest of the component would go here...
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🏈 Beautiful GreenLink Coming Soon!
        </h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;