'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash('admin123', 12);
    const userHash = await bcrypt.hash('user123', 12);

    await queryInterface.bulkInsert('users', [
      { username: 'admin', email: 'admin@quiz.com', password: passwordHash, role: 'admin', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { username: 'johndoe', email: 'john@quiz.com', password: userHash, role: 'user', isActive: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    await queryInterface.bulkInsert('quizzes', [
      { title: 'JavaScript Basics', description: 'Test your JavaScript fundamentals', category: 'Programming', difficulty: 'easy', timeLimit: 10, passingScore: 60, isPublished: true, createdBy: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'World Geography', description: 'How well do you know the world?', category: 'Geography', difficulty: 'medium', timeLimit: 15, passingScore: 70, isPublished: true, createdBy: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    await queryInterface.bulkInsert('questions', [
      { quizId: 1, text: 'What does "typeof null" return in JavaScript?', type: 'single', points: 1, explanation: 'typeof null returns "object" — this is a known JavaScript quirk.', orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { quizId: 1, text: 'Which method is used to parse a JSON string?', type: 'single', points: 1, explanation: 'JSON.parse() converts a JSON string into a JavaScript object.', orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      { quizId: 1, text: 'JavaScript is a statically typed language.', type: 'true_false', points: 1, explanation: 'JavaScript is dynamically typed.', orderIndex: 2, createdAt: new Date(), updatedAt: new Date() },
      { quizId: 2, text: 'What is the capital of Japan?', type: 'single', points: 1, explanation: 'Tokyo is the capital of Japan.', orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { quizId: 2, text: 'Which is the largest ocean?', type: 'single', points: 1, explanation: 'The Pacific Ocean is the largest ocean.', orderIndex: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    await queryInterface.bulkInsert('options', [
      // Q1
      { questionId: 1, text: '"object"', isCorrect: true, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 1, text: '"null"', isCorrect: false, orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 1, text: '"undefined"', isCorrect: false, orderIndex: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 1, text: '"string"', isCorrect: false, orderIndex: 3, createdAt: new Date(), updatedAt: new Date() },
      // Q2
      { questionId: 2, text: 'JSON.parse()', isCorrect: true, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, text: 'JSON.stringify()', isCorrect: false, orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, text: 'JSON.convert()', isCorrect: false, orderIndex: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, text: 'JSON.load()', isCorrect: false, orderIndex: 3, createdAt: new Date(), updatedAt: new Date() },
      // Q3 (true/false)
      { questionId: 3, text: 'True', isCorrect: false, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 3, text: 'False', isCorrect: true, orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      // Q4
      { questionId: 4, text: 'Tokyo', isCorrect: true, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, text: 'Osaka', isCorrect: false, orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, text: 'Kyoto', isCorrect: false, orderIndex: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, text: 'Hiroshima', isCorrect: false, orderIndex: 3, createdAt: new Date(), updatedAt: new Date() },
      // Q5
      { questionId: 5, text: 'Pacific Ocean', isCorrect: true, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 5, text: 'Atlantic Ocean', isCorrect: false, orderIndex: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 5, text: 'Indian Ocean', isCorrect: false, orderIndex: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 5, text: 'Arctic Ocean', isCorrect: false, orderIndex: 3, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('options', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('quizzes', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
