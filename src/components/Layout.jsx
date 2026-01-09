import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <h1>Carbon Trading Platform</h1>
          </div>
          
          <div className="nav-menu">
            <Link 
              to="/" 
              className={isActive('/') ? 'nav-link active' : 'nav-link'}
            >
              My Requests
            </Link>
            <Link 
              to="/requests-received" 
              className={isActive('/requests-received') ? 'nav-link active' : 'nav-link'}
            >
              Requests Received
            </Link>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
            >
              Analytics
            </Link>
          </div>

          <div className="nav-user">
            <span className="user-name">{user?.companyName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

