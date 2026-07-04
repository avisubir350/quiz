'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attempt_answers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      attemptId: {
        type: Sequelize.INTEGER,
        references: { model: 'attempts', key: 'id' },
        onDelete: 'CASCADE'
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: { model: 'questions', key: 'id' }
      },
      selectedOptionId: {
        type: Sequelize.INTEGER,
        references: { model: 'options', key: 'id' },
        allowNull: true
      },
      isCorrect: { type: Sequelize.BOOLEAN },
      pointsEarned: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('attempt_answers');
  }
};
