import React, { useState, useEffect, createContext, useContext } from 'react';
import api from './api';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  Outlet
} from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Payments from './pages/Payments';
import Search from './pages/Search';

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tharavad_user');
      if (!stored) return null;
      const { user } = JSON.parse(stored);
      return user || null;
    } catch {
      return null;
    }
  });

  // login accepts both user info and JWT token
  const login = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('tharavad_user', JSON.stringify({ user, token }));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tharavad_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <AppShell />;
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.admin, response.data.token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        {/* ── LEFT PANEL — Heritage Info (Branding) ── */}
        <div className="login-left">
          <div className="login-left-inner">
            <div className="br-glass-card">
              {/* Animated gold bar */}
              <div className="heritage-bar" />

              {/* Icon with pulse ring */}
              <div className="heritage-icon-wrap">
                <div className="heritage-icon-ring" />
                <div className="heritage-icon">🏛️</div>
              </div>

              {/* Name */}
              <h1 className="heritage-title">
                Allamkulam Meethal Veedu
                <br />
                <span className="heritage-title-gold">Mullachery Tharavad</span>
              </h1>

              {/* Subtitle */}
              <p className="heritage-subtitle">
                Community Management System
                <br />
                <span className="heritage-malayalam">സമൂഹ ഭരണ സംവിധാനം</span>
              </p>

              {/* Divider */}
              <div className="heritage-divider" />

              {/* Feature list */}
              <div className="heritage-features">
                {[
                  { icon: '👥', title: 'Member Registry', desc: 'Track all family members' },
                  { icon: '💳', title: 'Payment Tracking', desc: 'Annual dues & collections' },
                  { icon: '🔍', title: 'Smart Search', desc: 'Find records instantly' },
                  { icon: '📊', title: 'Live Dashboard', desc: 'Real-time statistics' },
                ].map((f, i) => (
                  <div key={f.title} className="heritage-feature-item" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <div className="heritage-feature-icon">{f.icon}</div>
                    <div>
                      <div className="heritage-feature-title">{f.title}</div>
                      <div className="heritage-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="heritage-footer">
                Est. Tharavad v1.0 · 2025
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Login Form ── */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-box">
              {/* Red badge icon */}
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 22px',
                background: 'linear-gradient(135deg, #5E0B15, #A11217)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 8px 28px rgba(94,11,21,0.45)',
                border: '2px solid rgba(212,175,55,0.3)'
              }}>🏛️</div>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px', fontWeight: '800',
                color: '#5E0B15', marginBottom: '6px'
              }}>Welcome Back</h2>
              <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '0' }}>
                Sign in to manage your Tharavad
              </p>

              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="👤 Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required autoFocus
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

              <p style={{ marginTop: '28px', fontSize: '12px', color: '#A89070', fontWeight: '500' }}>
                Mullachery Tharavad
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── App Shell (Header + Sidebar + Content) ───────────────────────────────────
function AppShell() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊', desc: 'Overview & stats' },
    { to: '/members', label: 'Members', icon: '👥', desc: 'Manage members' },
    { to: '/payments', label: 'Payments', icon: '💳', desc: 'Track payments' },
    { to: '/search', label: 'Search', icon: '🔍', desc: 'Find records' },
  ];

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
            <div style={{ padding: '4px 6px 16px', marginBottom: '4px' }}>
              <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                Navigation
              </div>
            </div>

            {/* Nav Items */}
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => {
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <div>
                  <div className="nav-label">{item.label}</div>
                  <div className="nav-desc">{item.desc}</div>
                </div>
              </NavLink>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Footer Card */}
            <div style={{
              padding: '16px 4px',
              borderTop: '1px solid rgba(212,175,55,0.15)',
              marginTop: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(212,175,55,0.08) 100%)',
                padding: '16px',
                borderRadius: '14px',
                color: 'white',
                border: '1px solid rgba(212,175,55,0.25)',
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: '#F4C430' }}>
                  👋 Welcome back!
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                  Logged in as <strong style={{ color: 'white' }}>{currentUser.username}</strong>
                </div>
              </div>
              <div style={{
                marginTop: '12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.18)',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Tharavad v1.0 • 2025
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile overlay */}
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

        {/* Main Content — renders the matched child route */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — all nested under AppShell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/search" element={<Search />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
