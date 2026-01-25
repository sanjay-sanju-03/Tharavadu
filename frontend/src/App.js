import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Payments from './pages/Payments';
import Search from './pages/Search';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      setCurrentUser(response.data.admin);
      setUsername('');
      setPassword('');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', desc: 'Overview & stats' },
    { id: 'members', label: 'Members', icon: '👥', desc: 'Manage members' },
    { id: 'payments', label: 'Payments', icon: '💳', desc: 'Track payments' },
    { id: 'search', label: 'Search', icon: '🔍', desc: 'Find records' },
  ];

  // Login Page
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🏛️ Tharavad</h1>
          <p>Community Management System</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="👤 Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <input
              type="password"
              placeholder="🔐 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? '⏳ Signing in...' : '→ Sign In'}
            </button>
          </form>
          <p className="demo-hint">
            🔐 Demo: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <div className="header-title">
          <h1>🏛️ Tharavad</h1>
        </div>
        <div className="header-right">
          <span>👤 {currentUser.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="main-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {/* Navigation Header */}
            <div style={{
              padding: '4px 20px 20px',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--neutral-400)',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                Navigation
              </div>
            </div>

            {/* Nav Items */}
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <span style={{
                  fontSize: '22px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentPage === item.id
                    ? 'linear-gradient(135deg, var(--primary-100), var(--primary-50))'
                    : 'var(--neutral-100)',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.label}</div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--neutral-400)',
                    fontWeight: '500',
                    marginTop: '2px'
                  }}>{item.desc}</div>
                </div>
              </button>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Footer Card */}
            <div style={{
              padding: '20px 16px',
              borderTop: '1px solid var(--neutral-100)',
              marginTop: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--accent-violet) 100%)',
                padding: '20px',
                borderRadius: '16px',
                color: 'white',
                boxShadow: 'var(--shadow-primary)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '6px'
                }}>
                  👋 Welcome back!
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.9
                }}>
                  Logged in as <strong>{currentUser.username}</strong>
                </div>
              </div>
              <div style={{
                marginTop: '16px',
                fontSize: '11px',
                color: 'var(--neutral-400)',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Tharavad v1.0 • 2024
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && window.innerWidth <= 768 && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
              backdropFilter: 'blur(4px)'
            }}
          />
        )}

        {/* Main Content */}
        <main className="main-content">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'members' && <Members />}
          {currentPage === 'payments' && <Payments />}
          {currentPage === 'search' && <Search />}
        </main>
      </div>
    </div>
  );
}

export default App;
