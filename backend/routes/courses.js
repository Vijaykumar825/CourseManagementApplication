const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidation, courseIdValidation, validate } = require('../validators/courseValidator');

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (requires authentication)
 */
router.post('/', auth, courseValidation, validate, (req, res) => {
  try {
    const { name, description, instructor, duration } = req.body;

    const course = Course.create({ name, description, instructor, duration });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating course'
    });
  }
});

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const courses = Course.findAll();

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses'
    });
  }
});

/**
 * @route   GET /api/course/:id
 * @desc    Get a single course by ID
 * @access  Public
 */
router.get('/:id', courseIdValidation, validate, (req, res) => {
  try {
    const course = Course.findById(parseInt(req.params.id));

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course'
    });
  }
});

/**
 * @route   PUT /api/course/:id
 * @desc    Update a course
 * @access  Private (requires authentication)
 */
router.put('/:id', auth, courseIdValidation, courseValidation, validate, (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    // Check if course exists
    if (!Course.exists(courseId)) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { name, description, instructor, duration } = req.body;
    const updatedCourse = Course.update(courseId, { name, description, instructor, duration });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course'
    });
  }
});

/**
 * @route   DELETE /api/course/:id
 * @desc    Delete a course
 * @access  Private (requires authentication)
 */
router.delete('/:id', auth, courseIdValidation, validate, (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    // Check if course exists
    if (!Course.exists(courseId)) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    Course.delete(courseId);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course'
    });
  }
});

module.exports = router;
