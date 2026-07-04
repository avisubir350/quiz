'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      quizId: {
        type: Sequelize.INTEGER,
        references: { model: 'quizzes', key: 'id' },
        onDelete: 'CASCADE'
      },
      text: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.ENUM('single', 'multiple', 'true_false'), defaultValue: 'single' },
      points: { type: Sequelize.INTEGER, defaultValue: 1 },
      explanation: { type: Sequelize.TEXT },
      orderIndex: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('questions');
  }
};
