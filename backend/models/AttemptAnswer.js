module.exports = (sequelize, DataTypes) => {
  const AttemptAnswer = sequelize.define('AttemptAnswer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    attemptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'attempts', key: 'id' }
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'questions', key: 'id' }
    },
    selectedOptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'options', key: 'id' }
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    pointsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'attempt_answers',
    timestamps: true
  });

  return AttemptAnswer;
};
