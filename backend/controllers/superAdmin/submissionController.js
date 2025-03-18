const { ExamAttempt, User, Exam } = require('../../models');

exports.getTestSubmissions = async (req, res) => {
  try {
    const submissions = await ExamAttempt.findAll({
      include: [
        { model: User, attributes: ['id', 'email'] },
        { model: Exam, attributes: ['name'] }
      ]
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in getTestSubmissions:", error.stack);
    res.status(500).json({ message: 'Error fetching test submissions', error: error.message });
  }
};
