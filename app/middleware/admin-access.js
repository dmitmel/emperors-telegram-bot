const { emperorID } = require('../../config.json').bot;

module.exports = ({ onAccessDenied } = {}) => (ctx, next) => {
  if (ctx.chat.type === 'private')
    return onAccessDenied && onAccessDenied(ctx, next);
  const hasAccess = ctx.from.id === emperorID;

  return hasAccess ? next() : onAccessDenied && onAccessDenied(ctx, next);
};
