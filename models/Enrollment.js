const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['enrolled', 'waitlisted', 'completed', 'dropped'],
    default: 'enrolled'
  },
  // Additional fields as needed, e.g., grade, feedback, etc.
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
