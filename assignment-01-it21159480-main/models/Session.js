const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  timetable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true,
    index: true  // Improves query performance when looking up sessions by timetable
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
    index: true  // May help in queries filtering by specific days
  },
  startTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(startTimeValue) {
        return this.endTime > startTimeValue;
      },
      message: 'StartTime must be before EndTime.'
    }
  },
  endTime: {
    type: Date,
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Useful for queries to find all sessions a faculty member is teaching
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true  // Helps in avoiding room double-booking by improving lookup performance
  },
  // Additional optional fields for further customization
  sessionType: {
    type: String,
    enum: ['Lecture', 'Lab', 'Tutorial', 'Exam'],
    required: false
  },
  description: {
    type: String,
    required: false
  }
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically

// Optional: If you anticipate frequently querying sessions based on both day and time
sessionSchema.index({ dayOfWeek: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
