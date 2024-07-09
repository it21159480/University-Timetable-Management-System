const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  resources: [{
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  purpose: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Adding an index to improve query performance for bookings overlapping in time
bookingSchema.index({ room: 1, startTime: 1, endTime: 1 }, { unique: false });
if (bookingSchema.path('resources')) {
    // If your logic often queries by resources, consider adding an index similar to rooms
    bookingSchema.index({ "resources.resource": 1, startTime: 1, endTime: 1 }, { unique: false });
}

module.exports = mongoose.model('Booking', bookingSchema);
