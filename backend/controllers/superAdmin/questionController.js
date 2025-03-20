const { Question, Category } = require('../../models');

exports.listQuestionsByCategory = async (req, res) => {
  let { categoryId } = req.params;
  categoryId = parseInt(categoryId, 10);
  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }
  try {
    const questions = await Question.findAll({ where: { categoryId } });
    return res.status(200).json(questions || []);
  } catch (err) {
    console.error("Error in listQuestionsByCategory:", err.stack);
    return res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
};


exports.createQuestion = async (req, res) => {
  const { text, optionA, optionB, optionC, optionD, correctOption, categoryId, examId } = req.body;

  if (!text || !optionA || !optionB || !optionC || !optionD || !correctOption || !categoryId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const allowedOptions = ['A', 'B', 'C', 'D'];
  if (!allowedOptions.includes(correctOption)) {
    return res.status(400).json({ message: "correctOption must be 'A', 'B', 'C', or 'D'" });
  }

  const parsedCategoryId = parseInt(categoryId, 10);
  if (isNaN(parsedCategoryId)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  const categoryExists = await Category.findByPk(parsedCategoryId);
  if (!categoryExists) {
    return res.status(400).json({ message: 'Category does not exist' });
  }

  try {
    const question = await Question.create({
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      categoryId: parsedCategoryId,
      examId: examId ? parseInt(examId, 10) : null
    });

    return res.status(201).json(question);
  } catch (err) {
    console.error("Error in createQuestion:", err);
    return res.status(500).json({ message: 'Error creating question', error: err.message });
  }
};


exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.destroy();
    return res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error("Error in deleteQuestion:", error.stack);
    return res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};


exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { text, optionA, optionB, optionC, optionD, correctOption, categoryId, examId } = req.body;
  
  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.update({
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      categoryId,
      examId
    });
    return res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error("Error in updateQuestion:", error.stack);
    return res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

exports.deleteAllQuestions = async (req, res) => {
  let { categoryId } = req.params;
  categoryId = parseInt(categoryId, 10);
  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }
  try {
    await Question.destroy({ where: { categoryId } });
    return res.status(200).json({ message: 'All questions deleted successfully for this category' });
  } catch (error) {
    console.error("Error in deleteAllQuestions:", error.stack);
    return res.status(500).json({ message: 'Error deleting all questions', error: error.message });
  }
};



//!Bulk Upload worked
exports.bulkCreateQuestions = async (req, res) => {
  const { questions } = req.body;
  
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Invalid data. Expected an array of questions.' });
  }
  
  const uniqueQuestionsMap = new Map();
  questions.forEach(q => {
    if (q.text && q.categoryId) {
      const key = `${q.categoryId}_${q.text.trim().toLowerCase()}`;
      if (!uniqueQuestionsMap.has(key)) {
        uniqueQuestionsMap.set(key, q);
      }
    }
  });
  
  const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
  
  try {
    const createdQuestions = await Question.bulkCreate(uniqueQuestions, { ignoreDuplicates: true });
    return res.status(201).json(createdQuestions);
  } catch (err) {
    console.error("Error in bulkCreateQuestions:", err.stack);
    return res.status(500).json({ message: 'Error creating questions in bulk', error: err.message });
  }
};
