'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quizzes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT },
      category: { type: Sequelize.STRING(100) },
      difficulty: { type: Sequelize.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' },
      timeLimit: { type: Sequelize.INTEGER },
      passingScore: { type: Sequelize.INTEGER, defaultValue: 60 },
      isPublished: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdBy: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('quizzes');
  }
};
