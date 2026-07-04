const { Attempt, AttemptAnswer, Quiz, Question, Option } = require('../models');

exports.startAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ where: { id: req.params.quizId, isPublished: true } });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const attempt = await Attempt.create({
      userId: req.user.id,
      quizId: quiz.id,
      startedAt: new Date()
    });

    res.status(201).json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedOptionId }]
    const attempt = await Attempt.findOne({
      where: { id: req.params.attemptId, userId: req.user.id }
    });

    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    if (attempt.completedAt) return res.status(400).json({ success: false, message: 'Attempt already submitted' });

    const quiz = await Quiz.findByPk(attempt.quizId, {
      include: [{
        model: Question, as: 'questions',
        include: [{ model: Option, as: 'options' }]
      }]
    });

    let totalPoints = 0;
    let earnedPoints = 0;
    const attemptAnswers = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers.find(a => a.questionId === question.id);

      if (userAnswer) {
        const selectedOption = question.options.find(o => o.id === userAnswer.selectedOptionId);
        const isCorrect = selectedOption ? selectedOption.isCorrect : false;
        const points = isCorrect ? question.points : 0;
        earnedPoints += points;

        attemptAnswers.push({
          attemptId: attempt.id,
          questionId: question.id,
          selectedOptionId: userAnswer.selectedOptionId || null,
          isCorrect,
          pointsEarned: points
        });
      } else {
        attemptAnswers.push({
          attemptId: attempt.id,
          questionId: question.id,
          selectedOptionId: null,
          isCorrect: false,
          pointsEarned: 0
        });
      }
    }

    await AttemptAnswer.bulkCreate(attemptAnswers);

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const completedAt = new Date();
    const timeTaken = Math.round((completedAt - attempt.startedAt) / 1000);

    await attempt.update({
      score,
      totalPoints,
      earnedPoints,
      passed: score >= quiz.passingScore,
      completedAt,
      timeTaken
    });

    res.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score,
        totalPoints,
        earnedPoints,
        passed: score >= quiz.passingScore,
        timeTaken,
        passingScore: quiz.passingScore
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttemptDetails = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      where: { id: req.params.attemptId, userId: req.user.id },
      include: [
        { model: Quiz, as: 'quiz' },
        {
          model: AttemptAnswer, as: 'answers',
          include: [
            { model: Question, as: 'question' },
            { model: Option, as: 'selectedOption' }
          ]
        }
      ]
    });

    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });

    res.json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
