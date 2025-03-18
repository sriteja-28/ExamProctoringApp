const { Exam, ExamAttempt, Question, Category } = require('../models');

const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{ model: Category, attributes: ['name'] }]
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error in getExams:", error.stack);
    res.status(500).json({ error: 'Failed to fetch exams', message: error.message });
  }
};

const getExamById = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findByPk(id, {
      include: [{ model: Question, as: 'questions' }]
    });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const examData = exam.toJSON();

   
    if (examData.questions && Array.isArray(examData.questions) && examData.questions.length > 0) {
      
      const questionsWithoutAnswers = examData.questions.map(q => {
        const { correctOption, ...rest } = q;
        return rest;
      });
      const shuffled = shuffleArray([...questionsWithoutAnswers]);
      const requested = examData.questionsPerSet;
      const finalQuestions = shuffled.slice(0, Math.min(shuffled.length, requested));
      examData.questionSet = finalQuestions;
      delete examData.questions;
    } else {
      examData.questionSet = [];
    }
    res.status(200).json(examData);
  } catch (error) {
    console.error("Error in getExamById:", error.stack);
    res.status(500).json({ error: 'Failed to fetch exam details', message: error.message });
  }
};

const startExam = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const existingAttempt = await ExamAttempt.findOne({ where: { examId: id, userId } });
    if (existingAttempt) {
      if (existingAttempt.status === 'PENDING') {
        return res.status(200).json({ message: 'Exam already started', attempt: existingAttempt });
      } else {
        return res.status(403).json({ message: 'You have already attempted this exam. Multiple attempts are not allowed.' });
      }
    }
    const examStartTime = new Date(exam.date);
    const now = new Date();
    if (now < examStartTime) {
      return res.status(403).json({ message: "Exam hasn't started yet. Please wait for the scheduled time." });
    }
    const windowEnd = new Date(examStartTime.getTime() + 20 * 60 * 1000);
    if (now > windowEnd) {
      return res.status(403).json({ message: "Exam start window has expired. You cannot start the exam." });
    }
    const attempt = await ExamAttempt.create({
      examId: id,
      userId,
      status: 'PENDING',
      answers: {}
    });
    res.status(200).json({ message: 'Exam started successfully', attempt });
  } catch (error) {
    console.error("Error in startExam:", error.stack);
    res.status(500).json({ error: 'Failed to start exam', message: error.message });
  }
};

const submitExam = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { answers } = req.body;
  try {
    const attempt = await ExamAttempt.findOne({ where: { examId: id, userId } });
    if (!attempt) {
      return res.status(404).json({ message: 'Exam attempt not found' });
    }
    if (attempt.status === 'COMPLETED') {
      return res.status(403).json({ message: 'You have already submitted this exam. Multiple submissions are not allowed.' });
    }
    const exam = await Exam.findByPk(id, {
      include: [{ model: Question, as: 'questions' }]
    });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    let score = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] && answers[question.id] === question.correctOption) {
        score += 1;
      }
    });
    await attempt.update({ answers, score, status: 'COMPLETED' });
    res.status(200).json({ message: 'Exam submitted successfully', attempt });
  } catch (error) {
    console.error("Error in submitExam:", error.stack);
    res.status(500).json({ error: 'Failed to submit exam', message: error.message });
  }
};

const cancelExam = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const attempt = await ExamAttempt.findOne({ where: { examId: id, userId } });
    if (!attempt) {
      return res.status(404).json({ message: 'Exam attempt not found' });
    }
    if (attempt.status === 'COMPLETED') {
      return res.status(403).json({ message: 'You cannot cancel a completed exam.' });
    }
    if (attempt.status === 'CANCELLED') {
      return res.status(403).json({ message: 'Exam is already cancelled.' });
    }
    await attempt.update({ status: 'CANCELLED' });
    res.status(200).json({ message: 'Exam cancelled successfully', attempt });
  } catch (error) {
    console.error("Error in cancelExam:", error.stack);
    res.status(500).json({ error: 'Failed to cancel exam', message: error.message });
  }
};

const getUserAttempts = async (req, res) => {
  const { userId } = req.params;
  try {
    const attempts = await ExamAttempt.findAll({ where: { userId } });
    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No exam attempts found for this user' });
    }
    res.status(200).json(attempts);
  } catch (error) {
    console.error("Error in getUserAttempts:", error.stack);
    res.status(500).json({ error: 'Failed to fetch user exam attempts', message: error.message });
  }
};

module.exports = {
  getExams,
  getExamById,
  startExam,
  submitExam,
  cancelExam,
  getUserAttempts
};
