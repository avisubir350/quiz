const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, getUserHistory } = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

router.get('/', getAllQuizzes);
router.get('/history', authenticate, getUserHistory);
router.get('/:id', getQuizById);

module.exports = router;
