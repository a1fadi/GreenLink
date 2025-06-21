import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, LogOut, UserPlus, LogIn, Building, Code } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [userClub, setUserClub] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [clubMode, setClubMode] = useState('join'); // 'create' or 'join'
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

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });

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

  // Fetch players when user has a club
  useEffect(() => {
    if (user && userClub) {
      // We'll implement this when we build teams
      console.log('User has club, will fetch team data later');
    }
  }, [user, userClub]);

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
        // For now, just save the club info
        // Later we'll implement proper club membership
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-600 mb-2">🏈 GreenLink</h1>
            <p className="text-gray-600">Football Team Management</p>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 px-4 rounded-l-lg ${authMode === 'login' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              <LogIn className="inline mr-2" size={16} />
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 px-4 rounded-r-lg ${authMode === 'signup' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              <UserPlus className="inline mr-2" size={16} />
              Sign Up
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleAuth(authMode === 'signup');
          }}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />

              {authMode === 'signup' && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={authForm.fullName}
                    onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <select
                    value={authForm.role}
                    onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="PLAYER">Player</option>
                    <option value="MANAGER">Manager/Coach</option>
                  </select>
                </>
              )}

              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                {authMode === 'signup' ? 'Create Account' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // If logged in but no club, show club selection
  if (user && !userClub) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
                <Building size={32} />
                GreenLink
              </h1>
              <p className="text-gray-600">Welcome {user.fullName}!</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              {user.role === 'MANAGER' ? 'Manage Your Club' : 'Join a Club'}
            </h2>

            {user.role === 'MANAGER' && (
              <div className="flex mb-6">
                <button
                  onClick={() => setClubMode('create')}
                  className={`flex-1 py-2 px-4 rounded-l-lg ${clubMode === 'create' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700'}`}
                >
                  <Building className="inline mr-2" size={16} />
                  Create Club
                </button>
                <button
                  onClick={() => setClubMode('join')}
                  className={`flex-1 py-2 px-4 rounded-r-lg ${clubMode === 'join' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700'}`}
                >
                  <Code className="inline mr-2" size={16} />
                  Join Club
                </button>
              </div>
            )}

            {(clubMode === 'create' && user.role === 'MANAGER') ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Club Name"
                  value={clubForm.name}
                  onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={clubForm.location}
                  onChange={(e) => setClubForm({...clubForm, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={clubForm.description}
                  onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
                <button
                  onClick={createClub}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Club
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-center">Enter club code to join:</p>
                <input
                  type="text"
                  placeholder="Club Code (e.g., EAGLES1234)"
                  value={clubForm.clubCode}
                  onChange={(e) => setClubForm({...clubForm, clubCode: e.target.value.toUpperCase()})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center font-mono text-lg"
                  required
                />
                <button
                  onClick={joinClub}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
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

  // If logged in and has club, show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
              <Users size={32} />
              {userClub.name}
            </h1>
            <p className="text-gray-600">
              {user.fullName} ({user.role}) • Code: {userClub.clubCode}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to {userClub.name}!</h2>
          <p className="text-gray-600 mb-4">{userClub.description}</p>
          <p className="text-gray-600">📍 {userClub.location}</p>
          
          <div className="mt-6 text-center text-gray-500">
            <p>Team management features coming next...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;