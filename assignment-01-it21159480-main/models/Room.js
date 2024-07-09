// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  building: { type: String, required: true },
  capacity: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['classroom', 'lab', 'auditorium', 'meeting room'], 
    required: true 
  },
  availableResources: [{ // Assuming this references Resource model IDs
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }]
});

module.exports = mongoose.model('Room', roomSchema);
