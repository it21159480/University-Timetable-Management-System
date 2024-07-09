const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Course = require('../models/Course');
const { createNotification } = require('../utilities/notificationUtils'); // Adjust the path as needed
const Session = require('../models/Session');

exports.createRoom = async (req, res) => {
  const { roomNumber, building, capacity, type, availableResources } = req.body;
  try {
    const newRoom = new Room({
      roomNumber,
      building,
      capacity,
      type,
      availableResources
    });
    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', data: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('availableResources');
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id).populate('availableResources');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find all sessions that use this room
    const affectedSessions = await Session.find({ location: id }).populate('timetable');
    const courseIds = new Set(affectedSessions.map(session => session.timetable.course.toString()));

    // For each unique course, find enrolled students and send notifications
    for (let courseId of courseIds) {
      const course = await Course.findById(courseId).populate('enrolledStudents');
      if (course) {
        const studentIds = course.enrolledStudents.map(student => student._id);
        if (studentIds.length > 0) {
          const message = `A change has occurred in the room assigned to your course: ${course.name}. Please check the updated schedule.`;
          await createNotification(message, studentIds);
        }
      }
    }

    res.status(200).json({ message: 'Room updated successfully', data: updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update room', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;

  // Check if the room is currently booked
  const isBooked = await Booking.findOne({ room: id, endTime: { $gt: new Date() } });
  if (isBooked) {
      return res.status(400).json({ message: 'Cannot delete room because it has future bookings.' });
  }


  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
};
