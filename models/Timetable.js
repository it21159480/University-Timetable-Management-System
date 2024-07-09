const mongoose = require('mongoose');

// Define a schema for your collection
const timetableSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: { 
    type: String, 
    enum: ['Year 1 Semester 1', 
    'Year 1 Semester 2', 
    'Year 2 Semester 1', 
    'Year 2 Semester 2', 
    'Year 3 Semester 1', 
    'Year 3 Semester 2', 
    'Year 4 Semester 1', 
    'Year 4 Semester 2'], 
    required: true } ,
  sessions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
  }]
  
    // Other fields like faculty, location, etc. can be defined here
});

// Create a model based on the schema
module.exports = mongoose.model('Timetable', timetableSchema);

// Export the model to use it in other parts of your application


