const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import models from subfolders
const User = require('./category/user')(sequelize, Sequelize.DataTypes);
const Category = require('./category.js')(sequelize, Sequelize.DataTypes);
const Question = require('./category/question')(sequelize, Sequelize.DataTypes);
const Exam = require('./exam')(sequelize, Sequelize.DataTypes);
const ExamAttempt = require('./category/examAttempt')(sequelize, Sequelize.DataTypes);

//! Define associations

// Category <-> Question
Category.hasMany(Question, { foreignKey: 'categoryId' });
Question.belongsTo(Category, { foreignKey: 'categoryId' });

// User <-> ExamAttempt
User.hasMany(ExamAttempt, { foreignKey: 'userId' });
ExamAttempt.belongsTo(User, { foreignKey: 'userId' });

// Exam <-> ExamAttempt
Exam.hasMany(ExamAttempt, { foreignKey: 'examId' });
ExamAttempt.belongsTo(Exam, { foreignKey: 'examId' });


// Category <-> Exam
Category.hasMany(Exam, { foreignKey: 'categoryId' });
Exam.belongsTo(Category, { foreignKey: 'categoryId' });

// Exam <-> Question (using examId)
Exam.hasMany(Question, { as: 'questions', foreignKey: 'examId' });
Question.belongsTo(Exam, { as: 'exam', foreignKey: 'examId' });

module.exports = { sequelize, User, Category, Question, Exam, ExamAttempt };
