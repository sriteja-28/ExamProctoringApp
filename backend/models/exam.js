module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    name: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    numberOfSets: { type: DataTypes.INTEGER, allowNull: false },
    questionsPerSet: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'exams' 
  });

  Exam.associate = models => {
    Exam.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Exam.hasMany(models.Question, { as: 'questions', foreignKey: 'examId' });
    Exam.hasMany(models.ExamAttempt, { foreignKey: 'examId' });
  };

  return Exam;
};
