import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, LogOut, UserPlus, LogIn } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null); // Current logged-in user
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'PLAYER'
  });

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('greenlink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch players when user logs in
  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [user]);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greenlink_user');
  };

  // Player management functions (existing)
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/players`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
    setLoading(false);
  };

  const addPlayer = async () => {
    if (!newPlayer.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlayer.name,
          position: newPlayer.position || null
        })
      });
      
      if (response.ok) {
        fetchPlayers();
        setNewPlayer({ name: '', position: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
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

  // If logged in, show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with user info */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
              <Users size={32} />
              GreenLink
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.fullName} ({user.role})
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
        
        {/* Add Player Button (only for managers) */}
        {user.role === 'MANAGER' && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Player
            </button>
          </div>
        )}

        {/* Add Player Form (only for managers) */}
        {showAddForm && user.role === 'MANAGER' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Player name"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Position (Optional)</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addPlayer}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Player
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Players List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Team Players ({players.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading players...</div>
          ) : players.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No players found. {user.role === 'MANAGER' ? 'Add your first player!' : 'No players in the team yet.'}
            </div>
          ) : (
            <div className="divide-y">
              {players.map(player => (
                <div key={player.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{player.name}</h3>
                    <p className="text-gray-600">
                      {player.position || 'Position not set'}
                    </p>
                  </div>
                  {user.role === 'MANAGER' && (
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;