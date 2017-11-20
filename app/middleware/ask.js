const questions = {};

module.exports = function(question, options = {}) {
  const chatID = this.chat.id;
  if (!questions[chatID]) questions[chatID] = options;

  this.reply(question);
};

exports = module.exports;

exports.middleware = () => (ctx, next) => {
  const chatID = ctx.chat.id;
  const question = questions[chatID];
  if (question) {
    const answer = ctx.message;

    const isAnswerValid = question.validator(answer);
    if (isAnswerValid) {
      question.onSuccess(answer);
      delete questions[chatID];
    } else {
      question.onError(answer);
    }
  }

  return next();
};
