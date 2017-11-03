exports.isMessageFromAdmin = ctx => {
  return ctx
    .getChatAdministrators(ctx.chat.id)
    .then(
      admins => admins.find(admin => admin.user.id === ctx.from.id) != null
    );
};
