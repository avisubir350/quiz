module.exports = (sequelize, DataTypes) => {
  const Attempt = sequelize.define('Attempt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'quizzes', key: 'id' }
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    earnedPoints: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Time taken in seconds'
    }
  }, {
    tableName: 'attempts',
    timestamps: true
  });

  return Attempt;
};
