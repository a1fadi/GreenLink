import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3 } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });

  // Fetch players from backend
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

  // Add new player
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
        fetchPlayers(); // Refresh the list
        setNewPlayer({ name: '', position: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Load players when app starts
  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
            <Users size={32} />
            GreenLink - Player Management
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Add Player Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Player
          </button>
        </div>

        {/* Add Player Form */}
        {showAddForm && (
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
              No players found. Add your first player!
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
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
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