const { Quiz, Question, Option, User, Attempt } = require('../models');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { isPublished: true },
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
      attributes: { exclude: [] }
    });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { id: req.params.id, isPublished: true },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: Question, as: 'questions',
          include: [{ model: Option, as: 'options', attributes: ['id', 'text', 'orderIndex'] }],
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizResult = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { id: req.params.id, isPublished: true },
      include: [{
        model: Question, as: 'questions',
        include: [{ model: Option, as: 'options' }],
        order: [['orderIndex', 'ASC']]
      }]
    });

    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const attempts = await Attempt.findAll({
      where: { userId: req.user.id },
      include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title', 'category', 'difficulty'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
