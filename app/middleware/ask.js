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
      delete questions[chatID];
      return question.onSuccess && question.onSuccess(answer);
    } else {
      return question.onInvalid && question.onInvalid(answer);
    }
  } else {
    return next();
  }
};

module.exports.cancel = () => (ctx, next) => {
  const chatID = ctx.chat.id;
  const question = questions[chatID];
  if (question) {
    delete questions[chatID];
    return null;
  } else {
    return next();
  }
};
