const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Quiz = require('./Quiz')(sequelize, Sequelize.DataTypes);
db.Question = require('./Question')(sequelize, Sequelize.DataTypes);
db.Option = require('./Option')(sequelize, Sequelize.DataTypes);
db.Attempt = require('./Attempt')(sequelize, Sequelize.DataTypes);
db.AttemptAnswer = require('./AttemptAnswer')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Quiz, { foreignKey: 'createdBy', as: 'createdQuizzes' });
db.Quiz.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });

db.Quiz.hasMany(db.Question, { foreignKey: 'quizId', as: 'questions', onDelete: 'CASCADE' });
db.Question.belongsTo(db.Quiz, { foreignKey: 'quizId', as: 'quiz' });

db.Question.hasMany(db.Option, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE' });
db.Option.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });

db.User.hasMany(db.Attempt, { foreignKey: 'userId', as: 'attempts' });
db.Attempt.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Quiz.hasMany(db.Attempt, { foreignKey: 'quizId', as: 'attempts' });
db.Attempt.belongsTo(db.Quiz, { foreignKey: 'quizId', as: 'quiz' });

db.Attempt.hasMany(db.AttemptAnswer, { foreignKey: 'attemptId', as: 'answers', onDelete: 'CASCADE' });
db.AttemptAnswer.belongsTo(db.Attempt, { foreignKey: 'attemptId', as: 'attempt' });

db.Question.hasMany(db.AttemptAnswer, { foreignKey: 'questionId', as: 'attemptAnswers' });
db.AttemptAnswer.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });

db.Option.hasMany(db.AttemptAnswer, { foreignKey: 'selectedOptionId', as: 'attemptAnswers' });
db.AttemptAnswer.belongsTo(db.Option, { foreignKey: 'selectedOptionId', as: 'selectedOption' });

module.exports = db;
