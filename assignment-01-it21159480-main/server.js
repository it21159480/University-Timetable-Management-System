const dotenv =require('dotenv');
const express = require('express');
const connectDB = require('./config/db');

const app = express();

dotenv.config();// Load environment variables from .env file
const PORT = process.env.PORT || 3000;
connectDB();// Connect to MongoDB
app.use(express.json());// Middleware to parse JSON

const authRoutes = require('./routes/auth');// Authentication routes
const courseRoutes = require('./routes/courses');//courses routes
const timetableRoutes = require('./routes/timetable'); // timetable routes
const sessionRoutes = require('./routes/session'); // session routes
const roomRoutes = require('./routes/room');
const resourceRoutes = require('./routes/resource');
const bookingRoutes = require('./routes/booking');
const enrollmentRoutes = require('./routes/enrollment');
const notificationRoutes = require('./routes/notification');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/notifications', notificationRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
