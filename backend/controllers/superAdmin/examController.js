const { Exam, ExamAttempt, Category, Question } = require('../../models');

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{
        model: Category,
        attributes: ['name']
      }]
    });
    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found" });
    }
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams', message: error.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    let { name, categoryId, duration, date, numberOfSets, questionsPerSet } = req.body;
    
    
    if (!name || !categoryId || !duration || !date || !numberOfSets || !questionsPerSet) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, categoryId, duration, date, numberOfSets, and questionsPerSet are required.' 
      });
    }

    
    categoryId = parseInt(categoryId, 10);
    duration = parseInt(duration, 10);
    numberOfSets = parseInt(numberOfSets, 10);
    questionsPerSet = parseInt(questionsPerSet, 10);

    
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    
    const availableQuestions = await Question.findAll({ where: { categoryId } });
    if (availableQuestions.length < numberOfSets * questionsPerSet) {
      return res.status(400).json({ message: "Not enough questions in this category" });
    }

    
    const newExam = await Exam.create({ 
      name, 
      categoryId, 
      duration, 
      date: new Date(date), 
      numberOfSets, 
      questionsPerSet 
    });

    
    const selectedQuestions = availableQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfSets * questionsPerSet);
    await newExam.setQuestions(selectedQuestions); // Associate questions with exam

    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({ message: 'Failed to create exam', error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  const { id } = req.params;
  const { name, categoryId, duration, date, numberOfSets, questionsPerSet } = req.body;
  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const updatedData = {
      name,
      categoryId: categoryId ? parseInt(categoryId, 10) : exam.categoryId,
      duration: duration ? parseInt(duration, 10) : exam.duration,
      date: date ? new Date(date) : exam.date,
      numberOfSets: numberOfSets ? parseInt(numberOfSets, 10) : exam.numberOfSets,
      questionsPerSet: questionsPerSet ? parseInt(questionsPerSet, 10) : exam.questionsPerSet,
    };
    await exam.update(updatedData);
    res.status(200).json({ message: 'Exam updated successfully', exam });
  } catch (err) {
    res.status(500).json({ message: 'Error updating exam', error: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    await exam.destroy();
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting exam', error: err.message });
  }
};

exports.getExamAttempts = async (req, res) => {
  try {
    const attempts = await ExamAttempt.findAll();
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exam attempts', message: error.message });
  }
};

exports.getUserExamAttempts = async (req, res) => {
  const { userId } = req.params;
  try {
    const attempts = await ExamAttempt.findAll({ where: { userId } });
    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No exam attempts found for this user' });
    }
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user exam attempts', message: error.message });
  }
};
