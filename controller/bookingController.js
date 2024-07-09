const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Resource = require('../models/Resource');

// Helper to check room availability
async function isRoomAvailable(roomId, startTime, endTime, excludeBookingId = null) {
  const query = {
    room: roomId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    _id: { $ne: excludeBookingId }
  };
  const booking = await Booking.findOne(query);
  return !booking;
}

// Helper to check resource availability
async function areResourcesAvailable(resources, startTime, endTime, excludeBookingId = null) {
  for (const { resource, quantity } of resources) {
    const query = {
      'resources.resource': resource,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      _id: { $ne: excludeBookingId }
    };
    const bookings = await Booking.find(query);
    let totalAllocated = 0;
    bookings.forEach(booking => {
      booking.resources.forEach(res => {
        if (res.resource.toString() === resource.toString()) {
          totalAllocated += res.quantity;
        }
      });
    });
    const resourceDoc = await Resource.findById(resource);
    if (totalAllocated + quantity > resourceDoc.quantity) {
      return false; // Not enough of this resource available
    }
  }
  return true;
}

exports.createBooking = async (req, res) => {
  const { user, room, resources, startTime, endTime, purpose } = req.body;

  // Check room availability
  if (!(await isRoomAvailable(room, startTime, endTime))) {
    return res.status(400).json({ message: 'Room is not available for the selected time.' });
  }

  // Check resources availability
  if (!(await areResourcesAvailable(resources, startTime, endTime))) {
    return res.status(400).json({ message: 'One or more resources are not available for the selected time.' });
  }

  try {
    const newBooking = new Booking({ user, room, resources, startTime, endTime, purpose });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', data: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user room resources.resource');
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id).populate('user room resources.resource');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const { room, resources, startTime, endTime } = req.body;

    if (!(await isRoomAvailable(room, startTime, endTime, id)) ||
        !(await areResourcesAvailable(resources, startTime, endTime, id))) {
        return res.status(400).json({ message: 'Room or resources not available for the selected time.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('user room resources.resource');
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking updated successfully', data: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update booking', error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete booking', error: error.message });
    }
};