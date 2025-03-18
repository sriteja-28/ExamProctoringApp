module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    text: { type: DataTypes.STRING, allowNull: false },
    optionA: { type: DataTypes.STRING, allowNull: false },
    optionB: { type: DataTypes.STRING, allowNull: false },
    optionC: { type: DataTypes.STRING, allowNull: false },
    optionD: { type: DataTypes.STRING, allowNull: false },
    correctOption: { type: DataTypes.STRING, allowNull: false },
    categoryId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    examId: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'exams',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['categoryId', 'text']
      }
    ]
  });

  Question.associate = models => {
    Question.belongsTo(models.Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
    Question.belongsTo(models.Exam, { as: 'exam', foreignKey: 'examId', onDelete: 'SET NULL' });
  };

  return Question;
};
