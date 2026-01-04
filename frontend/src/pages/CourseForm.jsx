import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import './CourseForm.css';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    duration: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(id);
      const course = response.data.data;
      setFormData({
        name: course.name || '',
        description: course.description || '',
        instructor: course.instructor || '',
        duration: course.duration || ''
      });
    } catch (err) {
      setApiError('Failed to load course details');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Course name must be at least 2 characters';
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isEditing) {
        await coursesAPI.update(id, formData);
      } else {
        await coursesAPI.create(formData);
      }
      navigate('/courses');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save course. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
    <div className="page course-form-page">
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h1 className="page-title">
              {isEditing ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="page-subtitle">
              {isEditing 
                ? 'Update the course information below'
                : 'Fill in the details to create a new course'
              }
            </p>
          </div>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} className="course-form">
            <div className="form-group">
              <label className="form-label">Course Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g., Introduction to React"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Instructor *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className={`form-input ${errors.instructor ? 'error' : ''}`}
                placeholder="Instructor's full name"
              />
              {errors.instructor && <span className="form-error">{errors.instructor}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 8 weeks, 20 hours"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Brief description of the course content and objectives..."
                rows="5"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/courses')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Course' : 'Create Course')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
