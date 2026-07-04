'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('options', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      questionId: {
        type: Sequelize.INTEGER,
        references: { model: 'questions', key: 'id' },
        onDelete: 'CASCADE'
      },
      text: { type: Sequelize.STRING(500), allowNull: false },
      isCorrect: { type: Sequelize.BOOLEAN, defaultValue: false },
      orderIndex: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('options');
  }
};
