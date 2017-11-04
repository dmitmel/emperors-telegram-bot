const { isMessageFromAdmin } = require('../utils/is-admin');

module.exports = ({ onAccessDenied } = {}) => (ctx, next) => {
  if (ctx.chat.type === 'private') return next();

  return isMessageFromAdmin(ctx).then(
    hasAccess =>
      hasAccess ? next() : onAccessDenied && onAccessDenied(ctx, next)
  );
};
