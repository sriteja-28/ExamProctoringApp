module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  });
  
  Category.associate = models => {
    Category.hasMany(models.Question, { foreignKey: 'categoryId', as: 'questions' });
  };

  return Category;
};
