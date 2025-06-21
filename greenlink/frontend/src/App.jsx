import React, { useState, useEffect } from 'react';
import './index.css';

const API_BASE = 'http://localhost:8080/api';

function App() {
  // State management
  const [user, setUser] = useState(null);
  const [userClub, setUserClub] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [clubMode, setClubMode] = useState('join');
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  
  // Form states
  const [authForm, setAuthForm] = useState({
    username: '', email: '', password: '', fullName: '', role: 'PLAYER'
  });
  const [clubForm, setClubForm] = useState({
    name: '', description: '', location: '', clubCode: ''
  });
  const [teamForm, setTeamForm] = useState({
    name: '', ageGroup: '', description: ''
  });
  const [playerForm, setPlayerForm] = useState({
    name: '', position: '', jerseyNumber: ''
  });

  // Initialize user data
  useEffect(() => {
    const savedUser = localStorage.getItem('greenlink_user');
    const savedClub = localStorage.getItem('greenlink_club');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedClub) setUserClub(JSON.parse(savedClub));
  }, []);

  // Load teams when club is selected
  useEffect(() => {
    if (userClub) fetchTeams();
  }, [userClub]);

  // API Functions
  const handleAuth = async (isSignup) => {
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    const payload = isSignup ? authForm : { username: authForm.username, password: authForm.password };

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

  const createClub = async () => {
    if (!clubForm.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clubForm, ownerId: user.id })
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

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE}/teams/club/${userClub.id}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const createTeam = async () => {
    if (!teamForm.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamForm,
          clubId: userClub.id,
          managerId: user.id
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        fetchTeams();
        setTeamForm({ name: '', ageGroup: '', description: '' });
        setShowAddTeamForm(false);
        alert(`Team created! Team code: ${data.teamCode}`);
      } else {
        alert(data.error || 'Team creation failed');
      }
    } catch (error) {
      console.error('Team creation error:', error);
      alert('Team creation failed');
    }
  };

  const fetchPlayers = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE}/players/team/${teamId}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const createPlayer = async () => {
    if (!playerForm.name.trim() || !selectedTeam) return;
    
    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...playerForm,
          teamId: selectedTeam.id,
          jerseyNumber: playerForm.jerseyNumber ? parseInt(playerForm.jerseyNumber) : null
        })
      });
      
      if (response.ok) {
        fetchPlayers(selectedTeam.id);
        setPlayerForm({ name: '', position: '', jerseyNumber: '' });
        setShowAddPlayerForm(false);
      } else {
        alert('Player creation failed');
      }
    } catch (error) {
      console.error('Player creation error:', error);
      alert('Player creation failed');
    }
  };

  // Navigation functions
  const logout = () => {
    setUser(null);
    setUserClub(null);
    setTeams([]);
    setCurrentView('dashboard');
    localStorage.removeItem('greenlink_user');
    localStorage.removeItem('greenlink_club');
  };

  const goToTeams = () => {
    setCurrentView('teams');
    fetchTeams();
  };

  const goToPlayers = (team) => {
    setSelectedTeam(team);
    setCurrentView('players');
    fetchPlayers(team.id);
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTeam(null);
  };

  // Render Logic
  if (!user) {
    return <AuthPage 
      authMode={authMode}
      setAuthMode={setAuthMode}
      authForm={authForm}
      setAuthForm={setAuthForm}
      handleAuth={handleAuth}
    />;
  }

  if (user && !userClub) {
    return <ClubSelectionPage
      user={user}
      clubMode={clubMode}
      setClubMode={setClubMode}
      clubForm={clubForm}
      setClubForm={setClubForm}
      createClub={createClub}
      joinClub={joinClub}
      logout={logout}
    />;
  }

  return <MainApp
    user={user}
    userClub={userClub}
    teams={teams}
    currentView={currentView}
    selectedTeam={selectedTeam}
    players={players}
    showAddTeamForm={showAddTeamForm}
    setShowAddTeamForm={setShowAddTeamForm}
    showAddPlayerForm={showAddPlayerForm}
    setShowAddPlayerForm={setShowAddPlayerForm}
    teamForm={teamForm}
    setTeamForm={setTeamForm}
    playerForm={playerForm}
    setPlayerForm={setPlayerForm}
    createTeam={createTeam}
    createPlayer={createPlayer}
    logout={logout}
    goToDashboard={goToDashboard}
    goToTeams={goToTeams}
    goToPlayers={goToPlayers}
  />;
}

// Component: Auth Page
function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, handleAuth }) {
  return (
    <div className="gradient-bg">
      <div className="center">
        <div className="container">
          <div className="glass-card auth-card">
            <div className="logo">🏈</div>
            <h1 className="title">GreenLink</h1>
            <p className="subtitle">Football Team Management</p>

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

// Component: Club Selection Page
function ClubSelectionPage({ user, clubMode, setClubMode, clubForm, setClubForm, createClub, joinClub, logout }) {
  return (
    <div className="gradient-bg">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome {user.fullName}!</h1>
            <p className="page-subtitle">Role: {user.role}</p>
          </div>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="center" style={{minHeight: '60vh'}}>
          <div className="container">
            <div className="glass-card club-card">
              <h2 className="section-title">
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
                <div className="form-container">
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
                </div>
              ) : (
                <div className="form-container">
                  <div className="form-group">
                    <input 
                      type="text"
                      placeholder="Club Code (e.g., EAGLES1234)"
                      className="input club-code-input"
                      value={clubForm.clubCode}
                      onChange={(e) => setClubForm({...clubForm, clubCode: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <button className="button" onClick={joinClub}>
                    Join Club
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Main App
function MainApp({ 
  user, userClub, teams, currentView, selectedTeam, players,
  showAddTeamForm, setShowAddTeamForm, showAddPlayerForm, setShowAddPlayerForm,
  teamForm, setTeamForm, playerForm, setPlayerForm,
  createTeam, createPlayer, logout, goToDashboard, goToTeams, goToPlayers 
}) {
  return (
    <div className="gradient-bg main-app">
      <div className="page-container">
        {/* Header Navigation */}
        <div className="main-header">
          <div className="header-info">
            <h1 className="club-name">{userClub.name}</h1>
            <p className="club-details">
              {user.fullName} ({user.role}) • Code: {userClub.clubCode}
            </p>
          </div>
          <div className="nav-buttons">
            <button 
              onClick={goToDashboard}
              className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={goToTeams}
              className={`nav-button ${currentView === 'teams' ? 'active' : ''}`}
            >
              Teams ({teams.length})
            </button>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        {currentView === 'dashboard' && (
          <DashboardView userClub={userClub} teams={teams} goToTeams={goToTeams} />
        )}

        {currentView === 'teams' && (
          <TeamsView 
            teams={teams}
            showAddTeamForm={showAddTeamForm}
            setShowAddTeamForm={setShowAddTeamForm}
            teamForm={teamForm}
            setTeamForm={setTeamForm}
            createTeam={createTeam}
            goToPlayers={goToPlayers}
            user={user}
          />
        )}

        {currentView === 'players' && selectedTeam && (
          <PlayersView
            team={selectedTeam}
            players={players}
            showAddPlayerForm={showAddPlayerForm}
            setShowAddPlayerForm={setShowAddPlayerForm}
            playerForm={playerForm}
            setPlayerForm={setPlayerForm}
            createPlayer={createPlayer}
            user={user}
            goToTeams={goToTeams}
          />
        )}
      </div>
    </div>
  );
}

// Component: Dashboard View
function DashboardView({ userClub, teams, goToTeams }) {
  return (
    <div className="content-area">
      <div className="glass-card club-info-card">
        <h2 className="welcome-title">Welcome to {userClub.name}!</h2>
        {userClub.description && (
          <p className="club-description">{userClub.description}</p>
        )}
        <div className="badge-container">
          {userClub.location && (
            <span className="badge gray">📍 {userClub.location}</span>
          )}
          <span className="badge green">👥 {userClub.memberCount || 0} Members</span>
          <span className="badge blue">🏆 {teams.length} Teams</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="feature-card">
          <div className="icon-container blue">⚽</div>
          <h3>Teams</h3>
          <p>Manage your club's teams and rosters</p>
          <button className="feature-button" onClick={goToTeams}>
            View Teams →
          </button>
        </div>

        <div className="feature-card">
          <div className="icon-container green">💬</div>
          <h3>Messages</h3>
          <p>Team communications and announcements</p>
          <button className="feature-button">
            View Messages →
          </button>
        </div>

        <div className="feature-card">
          <div className="icon-container purple">🏆</div>
          <h3>Matches</h3>
          <p>Live tracking and match history</p>
          <button className="feature-button">
            View Matches →
          </button>
        </div>
      </div>
    </div>
  );
}

// Component: Teams View
function TeamsView({ teams, showAddTeamForm, setShowAddTeamForm, teamForm, setTeamForm, createTeam, goToPlayers, user }) {
  return (
    <div className="content-area">
      <div className="section-header">
        <h2 className="section-title">Teams</h2>
        {user.role === 'MANAGER' && (
          <button 
            className="button add-button"
            onClick={() => setShowAddTeamForm(!showAddTeamForm)}
          >
            + Add Team
          </button>
        )}
      </div>

      {showAddTeamForm && (
        <div className="glass-card form-card">
          <h3 className="form-title">Create New Team</h3>
          <div className="form-container">
            <div className="form-group">
              <input 
                type="text"
                placeholder="Team Name"
                className="input"
                value={teamForm.name}
                onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <select 
                className="input"
                value={teamForm.ageGroup}
                onChange={(e) => setTeamForm({...teamForm, ageGroup: e.target.value})}
              >
                <option value="">Select Age Group</option>
                <option value="Under-18">Under-18</option>
                <option value="Under-21">Under-21</option>
                <option value="Senior">Senior</option>
                <option value="Veterans">Veterans</option>
              </select>
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Description (optional)"
                className="input"
                value={teamForm.description}
                onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button className="button" onClick={createTeam}>
                Create Team
              </button>
              <button 
                className="button-secondary"
                onClick={() => setShowAddTeamForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="teams-grid">
        {teams.length === 0 ? (
          <div className="empty-state">
            <p>No teams created yet.</p>
            {user.role === 'MANAGER' && (
              <p>Click "Add Team" to create your first team!</p>
            )}
          </div>
        ) : (
          teams.map(team => (
            <div key={team.id} className="team-card glass-card">
              <div className="team-header">
                <h3 className="team-name">{team.name}</h3>
                <span className="team-code">{team.teamCode}</span>
              </div>
              {team.ageGroup && (
                <p className="team-age-group">{team.ageGroup}</p>
              )}
              {team.description && (
                <p className="team-description">{team.description}</p>
              )}
              <div className="team-stats">
                <span className="badge blue">👥 {team.playerCount} Players</span>
                <span className="badge green">📊 {team.memberCount} Members</span>
              </div>
              <button 
                className="team-button"
                onClick={() => goToPlayers(team)}
              >
                Manage Players →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Component: Players View
function PlayersView({ team, players, showAddPlayerForm, setShowAddPlayerForm, playerForm, setPlayerForm, createPlayer, user, goToTeams }) {
  return (
    <div className="content-area">
      <div className="section-header">
        <div>
          <button className="back-button" onClick={goToTeams}>
            ← Back to Teams
          </button>
          <h2 className="section-title">{team.name} - Players</h2>
        </div>
        {user.role === 'MANAGER' && (
          <button 
            className="button add-button"
            onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}
          >
            + Add Player
          </button>
        )}
      </div>

      {showAddPlayerForm && (
        <div className="glass-card form-card">
          <h3 className="form-title">Add New Player</h3>
          <div className="form-container">
            <div className="form-group">
              <input 
                type="text"
                placeholder="Player Name"
                className="input"
                value={playerForm.name}
                onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <select 
                className="input"
                value={playerForm.position}
                onChange={(e) => setPlayerForm({...playerForm, position: e.target.value})}
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
            <div className="form-group">
              <input 
                type="number"
                placeholder="Jersey Number (optional)"
                className="input"
                value={playerForm.jerseyNumber}
                onChange={(e) => setPlayerForm({...playerForm, jerseyNumber: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button className="button" onClick={createPlayer}>
                Add Player
              </button>
              <button 
                className="button-secondary"
                onClick={() => setShowAddPlayerForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="players-grid">
        {players.length === 0 ? (
          <div className="empty-state">
            <p>No players in this team yet.</p>
            {user.role === 'MANAGER' && (
              <p>Click "Add Player" to add your first player!</p>
            )}
          </div>
        ) : (
          players.map(player => (
            <div key={player.id} className="player-card glass-card">
              <div className="player-header">
                <h3 className="player-name">{player.name}</h3>
                {player.jerseyNumber && (
                  <span className="jersey-number">#{player.jerseyNumber}</span>
                )}
              </div>
              <p className="player-position">{player.position || 'Position not set'}</p>
              <div className="player-stats">
                <div className="stat">
                  <span className="stat-value">{player.goals || 0}</span>
                  <span className="stat-label">Goals</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{player.assists || 0}</span>
                  <span className="stat-label">Assists</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{player.matchesPlayed || 0}</span>
                  <span className="stat-label">Matches</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;