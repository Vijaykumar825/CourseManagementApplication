import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CourseCard.css';

const CourseCard = ({ course, onDelete }) => {
  const { isAuthenticated } = useAuth();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      onDelete(course.id);
    }
  };

  return (
    <div className="course-card">
      <div className="course-card-header">
        <span className="course-icon">🎓</span>
        <h3 className="course-name">{course.name}</h3>
      </div>
      
      <p className="course-description">
        {course.description || 'No description available'}
      </p>
      
      <div className="course-meta">
        <div className="meta-item">
          <span className="meta-icon">👤</span>
          <span>{course.instructor}</span>
        </div>
        {course.duration && (
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{course.duration}</span>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="course-actions">
          <Link to={`/courses/edit/${course.id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
