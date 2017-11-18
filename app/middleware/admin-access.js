const { emperorID } = require('../../config.json').bot;

module.exports = ({ onAccessDenied } = {}) => (ctx, next) => {
  const hasAccess = ctx.from.id === emperorID;
  return hasAccess ? next() : onAccessDenied && onAccessDenied(ctx, next);
};
