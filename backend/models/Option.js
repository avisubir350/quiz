module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'questions', key: 'id' }
    },
    text: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'options',
    timestamps: true
  });

  return Option;
};
