const express = require('express');
const router = express.Router();
const { startAttempt, submitAttempt, getAttemptDetails } = require('../controllers/attemptController');
const { authenticate } = require('../middleware/auth');

router.post('/quiz/:quizId/start', authenticate, startAttempt);
router.post('/:attemptId/submit', authenticate, submitAttempt);
router.get('/:attemptId', authenticate, getAttemptDetails);

module.exports = router;
