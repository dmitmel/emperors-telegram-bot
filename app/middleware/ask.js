const questions = {};

module.exports = function({ validator, onInvalid } = {}) {
  return new Promise(resolve => {
    const chatID = this.chat.id;
    if (!questions[chatID]) {
      questions[chatID] = {
        validator,
        onSuccess: resolve,
        onInvalid
      };
    }
  });
};

module.exports.middleware = () => (ctx, next) => {
  const chatID = ctx.chat.id;
  const question = questions[chatID];
  if (question) {
    const answer = ctx.message;

    const isAnswerValid = question.validator
      ? question.validator(answer)
      : true;
    if (isAnswerValid) {
      question.onSuccess && question.onSuccess(answer);
      delete questions[chatID];
    } else {
      question.onInvalid && question.onInvalid(answer);
    }
  }

  return next();
};
