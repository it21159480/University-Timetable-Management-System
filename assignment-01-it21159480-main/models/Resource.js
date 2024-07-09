// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['projector', 'computer', 'whiteboard', 'lab equipment', 'other'],
    required: true 
  },
  availability: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Resource', resourceSchema);
