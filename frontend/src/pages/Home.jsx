import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your Courses
            <span className="title-highlight">With Ease</span>
          </h1>
          <p className="hero-subtitle">
            A powerful platform to create, organize, and manage your educational courses. 
            Built with modern technologies for the best experience.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Browse Courses
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Account
              </Link>
            )}
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-emoji">📚</span>
            <span>100+ Courses</span>
          </div>
          <div className="floating-card card-2">
            <span className="card-emoji">👨‍🏫</span>
            <span>Expert Instructors</span>
          </div>
          <div className="floating-card card-3">
            <span className="card-emoji">🚀</span>
            <span>Learn Fast</span>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy Management</h3>
            <p>Create, edit, and organize courses with an intuitive interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Your data is protected with industry-standard security</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Reliable</h3>
            <p>Built with modern tech stack for optimal performance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
