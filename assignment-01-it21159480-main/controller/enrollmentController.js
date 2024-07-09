const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course'); // Assuming you have a Course model
const User = require('../models/User'); // Assuming you have a User model

// Add an enrollment
exports.addEnrollment = async (req, res) => {
    const { student, course } = req.body;

    try {
        // Optional: Check if the course and student exist
        const courseExists = await Course.findById(course);
        const studentExists = await User.findById(student);

        if (!courseExists || !studentExists) {
            return res.status(404).json({ message: 'Course or Student not found' });
        }

        if (courseExists.enrolledStudents.includes(student)) {
            return res.status(400).json({ message: 'Student already enrolled' });
        }



        const newEnrollment = new Enrollment({ student, course });
        await newEnrollment.save();


        courseExists.enrolledStudents.push(student);
        // Save the updated course document to reflect the new enrollment
        await courseExists.save(); // This line saves the change to the database

        res.status(201).json({ message: 'Enrollment successfully added', data: newEnrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add enrollment', error: error.message });
    }
};

// View enrollments for a student
exports.getEnrollmentsByStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const enrollments = await Enrollment.find({ student: studentId }).populate('course', 'name');
        res.status(200).json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve enrollments', error: error.message });
    }
};

// Update an enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
    const { enrollmentId, status } = req.body;

    try {
        const updatedEnrollment = await Enrollment.findByIdAndUpdate(enrollmentId, { status }, { new: true });
        if (!updatedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment status updated successfully', data: updatedEnrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update enrollment status', error: error.message });
    }
};

// Remove an enrollment
exports.deleteEnrollment = async (req, res) => {
    const { enrollmentId } = req.params; // Assuming enrollmentId is passed as a URL parameter

    try {
        // Find the enrollment document based on the enrollmentId
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        // Retrieve the course related to this enrollment
        const course = await Course.findById(enrollment.course);
        if (!course) {
            return res.status(404).json({ message: 'Course related to this enrollment not found' });
        }

        // Remove the student from the enrolledStudents array of the course
        const index = course.enrolledStudents.indexOf(enrollment.student.toString());
        if (index > -1) {
            course.enrolledStudents.splice(index, 1);
            await course.save(); // Save the updated course document to the database
        } else {
            // This condition should theoretically never be hit due to data integrity, but it's good to handle it
            console.log("Student was not found in the course's enrolledStudents array.");
        }

        // Finally, delete the enrollment document itself
        await Enrollment.findByIdAndDelete(enrollmentId);

        res.status(200).json({ message: 'Enrollment successfully removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove enrollment', error: error.message });
    }
};
