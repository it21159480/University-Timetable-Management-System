const Session = require('../models/Session');
const Timetable = require('../models/Timetable');

// Helper function to check for overlapping sessions
async function checkForOverlaps(newSession) {
  const overlaps = await Session.findOne({
    $or: [{ faculty: newSession.faculty }, { location: newSession.location }],
    dayOfWeek: newSession.dayOfWeek,
    $and: [
      { startTime: { $lt: newSession.endTime } },
      { endTime: { $gt: newSession.startTime } }
    ],
    _id: { $ne: newSession._id }  // Exclude the current session if updating
  });
  return !!overlaps;
}

exports.createSession = async (req, res) => {
  const { timetable, ...newSessionData } = req.body;

  try {
    // Check if the referenced Timetable exists
    const timetableExists = await Timetable.findById(timetable);
    if (!timetableExists) {
      return res.status(404).json({ message: 'Referenced timetable does not exist.' });
    }

    // const newSessionData = req.body;
    if (await checkForOverlaps(newSessionData)) {
      return res.status(400).json({ message: 'Session overlaps with an existing session.' });
    }

      // Make sure to include the timetable in the new session document
      const newSession = new Session({
        ...newSessionData,
        timetable: timetable  // Ensuring timetable ID is included in the new session
    });
    await newSession.save();

    // Push the session ID to the sessions array of the referenced timetable and save
    timetableExists.sessions.push(newSession._id);
    await timetableExists.save();

    res.status(201).json({ message: 'Session created successfully', data: newSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  const { id } = req.params;
  const { timetable, ...sessionDataToUpdate } = req.body;
  //   const sessionDataToUpdate = req.body;

  try {

    const timetableExists = await Timetable.findById(timetable);
    if (!timetableExists) {
      return res.status(404).json({ message: 'Referenced timetable does not exist.' });
    }
    const sessionToUpdate = await Session.findById(id);
    if (!sessionToUpdate) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check for overlaps with the updated information
    if (await checkForOverlaps({ ...sessionDataToUpdate, _id: id })) {
      return res.status(400).json({ message: 'Session overlaps with an existing session.' });
    }

    const updatedSession = await Session.findByIdAndUpdate(id, sessionDataToUpdate, { new: true });
    res.status(200).json({ message: 'Session updated successfully', data: updatedSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating session', error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSession = await Session.findByIdAndDelete(id);
    if (!deletedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting session', error: error.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching session', error: error.message });
  }
};
