const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

// Stats & Users
router.get('/stats', admin.getStats);
router.get('/users', admin.getAllUsers);

// Quiz management
router.get('/quizzes', admin.getAllQuizzesAdmin);
router.post('/quizzes', admin.createQuiz);
router.put('/quizzes/:id', admin.updateQuiz);
router.delete('/quizzes/:id', admin.deleteQuiz);
router.patch('/quizzes/:id/publish', admin.publishQuiz);

// Question management
router.post('/quizzes/:quizId/questions', admin.addQuestion);
router.put('/questions/:questionId', admin.updateQuestion);
router.delete('/questions/:questionId', admin.deleteQuestion);

module.exports = router;
