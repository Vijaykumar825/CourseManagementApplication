import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const Courses = () => {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.data);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await coursesAPI.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      alert('Failed to delete course. Please try again.');
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page courses-page">
      <div className="container">
        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title">Courses</h1>
            <p className="page-subtitle">Browse and manage all available courses</p>
          </div>
          {isAuthenticated && (
            <Link to="/courses/new" className="btn btn-primary">
              + Add Course
            </Link>
          )}
        </div>

        <div className="courses-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="courses-count">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">
              {searchTerm ? 'No courses match your search' : 'No courses yet'}
            </h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : isAuthenticated 
                  ? 'Create your first course to get started!'
                  : 'Check back later for new courses.'
              }
            </p>
            {isAuthenticated && !searchTerm && (
              <Link to="/courses/new" className="btn btn-primary mt-4">
                Create Course
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
