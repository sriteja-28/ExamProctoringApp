const { ExamAttempt, Exam, Sequelize } = require('../models');
const { Op } = require('sequelize'); 


exports.getSubmissions = async (req, res) => {
  const userId = req.user.id;
  try {
    const submissions = await ExamAttempt.findAll({
      where: { 
        userId,
        status: { [Op.ne]: 'PENDING' } 
      },
      include: [
        {
          model: Exam,
          attributes: ['name','totalScore'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
};
