const { Quiz, Question, Option, User, Attempt } = require('../models');

// ---- Quiz Management ----
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, passingScore } = req.body;
    const quiz = await Quiz.create({
      title, description, category, difficulty, timeLimit,
      passingScore: passingScore || 60,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    await quiz.update(req.body);
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    await quiz.destroy();
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    await quiz.update({ isPublished: !quiz.isPublished });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQuizzesAdmin = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- Question Management ----
exports.addQuestion = async (req, res) => {
  try {
    const { text, type, points, explanation, options } = req.body;
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const count = await Question.count({ where: { quizId: quiz.id } });
    const question = await Question.create({
      quizId: quiz.id, text, type, points: points || 1, explanation, orderIndex: count
    });

    if (options && options.length > 0) {
      const opts = options.map((opt, i) => ({
        questionId: question.id,
        text: opt.text,
        isCorrect: opt.isCorrect || false,
        orderIndex: i
      }));
      await Option.bulkCreate(opts);
    }

    const fullQuestion = await Question.findByPk(question.id, {
      include: [{ model: Option, as: 'options' }]
    });

    res.status(201).json({ success: true, question: fullQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const { text, type, points, explanation, options } = req.body;
    await question.update({ text, type, points, explanation });

    if (options) {
      await Option.destroy({ where: { questionId: question.id } });
      const opts = options.map((opt, i) => ({
        questionId: question.id,
        text: opt.text,
        isCorrect: opt.isCorrect || false,
        orderIndex: i
      }));
      await Option.bulkCreate(opts);
    }

    const updated = await Question.findByPk(question.id, {
      include: [{ model: Option, as: 'options' }]
    });

    res.json({ success: true, question: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    await question.destroy();
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---- Stats ----
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalQuizzes, totalAttempts] = await Promise.all([
      User.count(),
      Quiz.count(),
      Attempt.count({ where: { completedAt: { [require('sequelize').Op.ne]: null } } })
    ]);

    res.json({ success: true, stats: { totalUsers, totalQuizzes, totalAttempts } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
