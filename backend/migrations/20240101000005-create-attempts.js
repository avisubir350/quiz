'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attempts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: { model: 'quizzes', key: 'id' },
        onDelete: 'CASCADE'
      },
      score: { type: Sequelize.FLOAT },
      totalPoints: { type: Sequelize.INTEGER },
      earnedPoints: { type: Sequelize.INTEGER },
      passed: { type: Sequelize.BOOLEAN },
      startedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      completedAt: { type: Sequelize.DATE },
      timeTaken: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('attempts');
  }
};
