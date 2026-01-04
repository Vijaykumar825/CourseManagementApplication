import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">CourseHub</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/courses" className="nav-link">Courses</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/courses/new" className="nav-link">Add Course</Link>
              <div className="user-menu">
                <span className="user-name">👋 {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
