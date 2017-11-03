function isAdmin(ctx, user) {
  return ctx.getChatAdministrators(ctx.chat.id).then(admins => {
    return admins.find(admin => admin.user.id === user.id) != null;
  });
}

module.exports = ({ onAccessDenied } = {}) => {
  return (ctx, next) => {
    if (ctx.chat.type === 'private') return next();

    return isAdmin(ctx, ctx.from).then(hasAccess => {
      if (hasAccess) next();
      else if (onAccessDenied) onAccessDenied(ctx, next);
    });
  };
};
