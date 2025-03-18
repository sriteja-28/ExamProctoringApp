module.exports = (sequelize, DataTypes) => {
  const ExamAttempt = sequelize.define('ExamAttempt', {
    examId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'), defaultValue: 'PENDING' },
    answers: { type: DataTypes.JSON, defaultValue: {} },
    score: { type: DataTypes.INTEGER, defaultValue: 0 }
  });

  ExamAttempt.associate = models => {
    ExamAttempt.belongsTo(models.Exam, { foreignKey: 'examId' });
    ExamAttempt.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ExamAttempt;
};
