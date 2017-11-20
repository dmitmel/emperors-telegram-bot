const trusted = require('../db').get('trusted');
const { emperorID } = require('../../config.json').bot;

function makeAccessFn(predicate) {
  return ({ onAccessDenied } = {}) => (ctx, next) => {
    return predicate(ctx)
      ? next()
      : onAccessDenied && onAccessDenied(ctx, next);
  };
}

module.exports = {
  emperor: makeAccessFn(ctx => ctx.from.id === emperorID),
  trustedAndEmperor: makeAccessFn(
    ctx => ctx.from.id === emperorID || trusted.includes(ctx.from.id)
  )
};
