module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { len: [3, 200] }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium'
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Time limit in minutes, null means no limit'
    },
    passingScore: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      validate: { min: 0, max: 100 }
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  }, {
    tableName: 'quizzes',
    timestamps: true
  });

  return Quiz;
};
