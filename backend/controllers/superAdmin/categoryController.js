const { Category, Question, Exam } = require('../../models');

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error("Error in createCategory:", err.stack);
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error("Error in listCategories:", err.stack);
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (category.name === name) {
      return res.status(400).json({ message: 'Category name is the same as before' });
    }
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    await category.update({ name });
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error("Error in updateCategory:", error.stack);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const questionsCount = await Question.count({ where: { categoryId: id } });
    const examsCount = await Exam.count({ where: { categoryId: id } });
    if (questionsCount > 0 || examsCount > 0) {
      return res.status(400).json({ message: 'Cannot delete category; it is used in other records.' });
    }
    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error("Error in deleteCategory:", error.stack);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

