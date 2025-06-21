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
                    />
                    <Star className="absolute left-4 top-4 text-gray-400" size={20} />
                  </div>
                  <div className="relative">
                    <select
                      value={authForm.role}
                      onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
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

  // If logged in but no club, show beautiful club selection
  if (user && !userClub) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <Building className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  GreenLink
                </h1>
                <p className="text-gray-600 text-sm">Welcome back, {user.fullName}!</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {user.role === 'MANAGER' ? 'Manage Your Club' : 'Join a Club'}
            </h2>
            <p className="text-gray-600 text-lg">
              {user.role === 'MANAGER' 
                ? 'Create a new club or join an existing one as a manager' 
                : 'Enter your club code to join your team'}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            {user.role === 'MANAGER' && (
              <div className="flex p-1 mb-8 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setClubMode('create')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${clubMode === 'create' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Building className="inline mr-2" size={16} />
                  Create Club
                </button>
                <button
                  onClick={() => setClubMode('join')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${clubMode === 'join' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Code className="inline mr-2" size={16} />
                  Join Club
                </button>
              </div>
            )}

            {(clubMode === 'create' && user.role === 'MANAGER') ? (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Club Name"
                    value={clubForm.name}
                    onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                  />
                  <Trophy className="absolute left-4 top-4 text-gray-400" size={20} />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Location"
                    value={clubForm.location}
                    onChange={(e) => setClubForm({...clubForm, location: e.target.value})}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50"
                  />
                  <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Description (optional)"
                    value={clubForm.description}
                    onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 min-h-[100px]"
                    rows="3"
                  />
                  <Edit3 className="absolute left-4 top-4 text-gray-400" size={20} />
                </div>
                <button
                  onClick={createClub}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Create Club
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Code className="text-blue-600" size={32} />
                  </div>
                  <p className="text-gray-600 text-lg">Enter your club code to join:</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Club Code (e.g., EAGLES1234)"
                    value={clubForm.clubCode}
                    onChange={(e) => setClubForm({...clubForm, clubCode: e.target.value.toUpperCase()})}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 text-center font-mono text-lg tracking-wider"
                  />
                  <Code className="absolute left-4 top-4 text-gray-400" size={20} />
                </div>
                <button
                  onClick={joinClub}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Join Club
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main club dashboard - beautiful and feature-rich
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userClub.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Shield className="mr-1" size={14} />
                    {user.fullName} ({user.role})
                  </span>
                  <span className="flex items-center">
                    <Code className="mr-1" size={14} />
                    {userClub.clubCode}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Club Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to {userClub.name}!</h2>
              {userClub.description && (
                <p className="text-gray-600 mb-4 text-lg">{userClub.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {userClub.location && (
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin className="mr-1" size={14} />
                    {userClub.location}
                  </span>
                )}
                <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <Users className="mr-1" size={14} />
                  {userClub.memberCount || 0} Members
                </span>
                <span className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Trophy className="mr-1" size={14} />
                  {userClub.teamCount || 0} Teams
                </span>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center">
                Manage Teams
                <ChevronRight className="ml-2" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Teams Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{userClub.teamCount || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Teams</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your club's teams and rosters</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              View Teams
              <ChevronRight className="ml-1" size={14} />
            </button>
          </div>

          {/* Messages Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">12</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Messages</h3>
            <p className="text-gray-600 text-sm mb-4">Team communications and announcements</p>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
              View Messages
              <ChevronRight className="ml-1" size={14} />
            </button>
          </div>

          {/* Matches Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                <Trophy className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Matches</h3>
            <p className="text-gray-600 text-sm mb-4">Live tracking and match history</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
              View Matches
              <ChevronRight className="ml-1" size={14} />
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">More Features Coming Soon!</h3>
            <p className="text-gray-600">Team management, player stats, and live match tracking are being built...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;