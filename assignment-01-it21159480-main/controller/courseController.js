const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  // Admin role required
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description, credits } = req.body;
  const update = { name, description, credits };


  try {
    // First, check if the course exists
    const courseExists = await Course.findById(id);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Perform the update
    const updatedCourse = await Course.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });

    if (!updatedCourse) {
      return res.status(400).json({ message: 'Failed to update the course' });
    }

    res.json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  // Extract the ID using 'id' instead of 'courseId'
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting course', error: error.toString() });
  }
};


exports.assignFaculty = async (req, res) => {
  const { code, username } = req.body; // Adjusted to receive code and username

  try {
    // Find the faculty user by username
    const faculty = await User.findOne({ username });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Find the course by code
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course with the faculty's ID
    course.faculty = faculty._id;
    await course.save();

    res.json({ message: 'Faculty assigned successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning faculty', error: error.message });
  }
};


exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};