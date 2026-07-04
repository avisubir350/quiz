module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'quizzes', key: 'id' }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('single', 'multiple', 'true_false'),
      defaultValue: 'single'
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Explanation shown after answering'
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'questions',
    timestamps: true
  });

  return Question;
};
