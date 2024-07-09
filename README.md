
# University Timetable Management System

## Introduction

The University Timetable Management System is a RESTful API developed to streamline the process of creating, modifying, and querying class schedules within a university context. Designed to cater to the needs of students, faculty, and administrative staff, the system provides a user-friendly and secure interface to manage academic timetables efficiently.

## Technologies and Tools Used

- *Backend*: Express JS (Node.js) - A robust framework for building RESTful APIs.
- *Frontend*: React.js - A JavaScript library for building user interfaces, particularly suited for single-page applications.
- *Database*: MongoDB - A NoSQL database known for its scalability and flexibility.

## Entity Relationship Diagram

The system's data model consists of several key entities:

- *Course*: Represents academic courses that can contain multiple modules.
- *Module*: Individual parts of a course, with a specific focus and taught during a particular semester.
- *Timetable*: Links courses/modules with specific times and locations for classes.
- *User*: Generalized entity for all system users, with specializations for Admin, Faculty, and Student roles.
- *ClassRoom*: Designated spaces where classes are held, identified by features such as location, capacity, and type (e.g., lecture hall, lab).
- *Resource*: Assets such as projectors or computers that are allocated to facilitate teaching and learning activities.
- *Booking*: Records the reservation of classrooms and resources, ensuring no scheduling conflicts for academic sessions or events.
- *Notification*: Alerts and messages sent to system users to inform them of schedule changes, announcements, or other important information.



# Functional Requirements:
1. *User Roles and Authentication:*
- Define multiple user roles (e.g., Admin, Faculty, Student) with different access 
levels.
- Implement secure login functionality and session management using JWT.
2. *Course Management:*
- Allow CRUD operations on courses, including course name, code, description, and 
credits.
- Enable Admins to assign Faculty to courses.
3. *Timetable Management:*
- Facilitate the creation and modification of weekly timetables for different courses.
- Include functionality to add, update, and delete class sessions, specifying the 
course, time, faculty, and location.
4. *Room and Resource Booking:*
- Manage classrooms and resources (e.g., projectors, labs) availability.
- Allow booking of rooms and resources for classes or events, ensuring no overlaps.
5. *Student Enrollment:*
- Enable students to enroll in courses and view their timetables.
- Allow Faculty and Admins to view and manage student enrollments in courses.
6. *Notifications and Alerts:*
- Implement a system to notify users of timetable changes, room changes, or 
important announcements.


## Features and Functions

- *User Authentication*: Secure login functionality with session management.
- *Course Management*: Full CRUD operations on courses and association with faculty.
- *Timetable Management*: Creation and updates to weekly timetables with class session details.
- *ClassRoom and Resource Booking*: Scheduling resources to prevent booking conflicts.
- *Notifications*: Alerts on schedule changes and announcements.

## Contribution

To contribute to this project, please follow the standard GitHub fork and pull request workflow. Ensure you write tests for new features and document your changes.

1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature-name
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature/your-feature-name
5. Open a pull request.

## Future Enhancements

- Applixation development for easier access on-the-go.
- Integration with external calendar services (e.g., Google Calendar, Outlook).
- Implementation of an AI-based recommendation system for optimal timetable generation.

## Setup and Installation

To set up the project on your local machine, follow these steps:

1. Clone the repository to your local machine:
    
    git clone [https://github.com/sliitcsse/assignment-01-it21159480.git](https://github.com/sliitcsse/assignment-01-it21159480.git)
    
2. Navigate to the project directory:
    
    cd assignment-01-it21159480
    
3. Build the project using npm:
    
    npm install
    
4. Run the project:
    
   npm start


## Project Folder Structure

Here's an overview of the main project directories:

```
ASSIGNMENT-01-IT21159480/
|-- config/
| |-- db.js
|-- controller/
| |-- timetableController.js
| |-- courseController.js
| |-- sessionController.js
| |-- roomController.js
| |-- resourceController.js
| |-- bookingController.js
| |-- enrollmentController.js
| |-- notificationController.js
|-- middleware/
| |-- authMiddleware.js
| |-- roleCheck.js
|-- models/
| |-- Course.js
| |-- Timetable.js
| |-- Session.js
| |-- Room.js
| |-- Resource.js
| |-- Booking.js
| |-- Enrollment.js
| |-- Notification.js
| |-- User.js
|-- routes/
| |-- timetable.js
| |-- courses.js
| |-- session.js
| |-- room.js
| |-- resource.js
| |-- booking.js
| |-- enrollment.js
| |-- notification.js
| |-- auth.js
|-- utilities/
| |-- notificationUtils.js
|-- node_modules/
|-- .env
|-- package-lock.json
|-- package.json
|-- README.md
|-- server.js
```






## API Documentation  

- The API is documented using Postman. The documentation is available at google drive link: [Postman/collection](https://documenter.getpostman.com/view/27077121/2sA35BbjSr) after click in link. 
