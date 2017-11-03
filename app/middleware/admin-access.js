const { isMessageFromAdmin } = require('../utils/is-admin');

module.exports = ({ onAccessDenied } = {}) => (ctx, next) => {
  if (ctx.chat.type === 'private') return next();

  return isMessageFromAdmin(ctx).then(hasAccess => {
    if (hasAccess) next();
    else if (onAccessDenied) onAccessDenied(ctx, next);
  });
};
