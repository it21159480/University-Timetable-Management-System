const Timetable = require('../models/Timetable');
const Session = require('../models/Session'); // Assuming you have a Session model
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { createNotification } = require('../utilities/notificationUtils');

exports.createTimetable = async (req, res) => {
    const { course, courseCoordinator, semester } = req.body;
    try {
        const courseExists = await Course.findById(course);
        const coordinatorExists = await User.findById(courseCoordinator);

        if (!courseExists || !coordinatorExists) {
            return res.status(400).json({ message: 'Invalid course or courseCoordinator ID' });
        }

        const newTimetable = new Timetable({
            course,
            courseCoordinator,
            semester
        });
        await newTimetable.save();
        res.status(201).json({ message: 'Timetable created successfully', data: newTimetable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create timetable', error: error.message });
    }
};

exports.getAllTimetables = async (req, res) => {
    // const userId = req.user.id; // Assuming middleware populates this
    // const userRole = req.user.role; // User's role: student, faculty, or admin

    try {
        // For students, check if they are enrolled in the course


        // Populate multiple fields, including nested population for sessions
        const timetables = await Timetable.find()
            .populate('course courseCoordinator', 'name') // Existing population
            .populate({
                path: 'sessions', // Populate sessions
                populate: { // Nested population for fields within each session
                    path: 'faculty location', // Assuming you want to show faculty and location details
                    select: 'name building roomNumber' // Adjust based on actual fields in your User and Room models
                }
            });

        res.status(200).json(timetables);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving timetables', error: error.message });
    }

};

exports.getTimetableById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 
    const userRole = req.user.role;
    try {
        if (userRole === 'Student') {
            const enrolled = await Enrollment.findOne({ student: userId, course: Timetable.course._id });
            if (!enrolled) {
                // If the student is not enrolled in the course, deny access
                return res.status(403).json({ message: 'Access denied: Student is not enrolled in this course' });
            }

            // Populate multiple fields, including nested population for sessions
            const timetables = await Timetable.find(id)
                .populate('course courseCoordinator', 'name') // Existing population
                .populate({
                    path: 'sessions', // Populate sessions
                    populate: { // Nested population for fields within each session
                        path: 'faculty location', // Assuming you want to show faculty and location details
                        select: 'name building roomNumber' // Adjust based on actual fields in your User and Room models
                    }
                });

            res.status(200).json(timetables);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving timetable', error: error.message });
    }
};

exports.updateTimetable = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedTimetable = await Timetable.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('course');
        if (!updatedTimetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Assuming course is populated in the timetable model as shown in your schema
        const course = await Course.findById(updatedTimetable.course._id).populate('enrolledStudents');
        if (!course) {
            return res.status(400).json({ message: 'Course related to this timetable not found' });
        }

        // Extract the IDs of the enrolled students
        const studentIds = course.enrolledStudents.map(student => student._id);

        // Generate a notification for the enrolled students
        if (studentIds.length > 0) {
            await createNotification('The timetable for your course has been updated.', studentIds);
        }

        res.status(200).json({ message: 'Timetable updated successfully', data: updatedTimetable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update timetable', error: error.message });
    }
};

exports.deleteTimetable = async (req, res) => {
    const { id } = req.params;
    try {
        const timetable = await Timetable.findById(id);
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }
        // Cascade delete sessions associated with the timetable
        await Session.deleteMany({ timetable: id });
        await timetable.remove(); // Using remove() to potentially trigger pre/post middleware
        res.status(200).json({ message: 'Timetable and related sessions deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete timetable', error: error.message });
    }
};
