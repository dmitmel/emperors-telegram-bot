const { isMessageFromAdmin } = require('../utils/is-admin');

module.exports = () => (ctx, next) => {
  if (ctx.chat.type !== 'private') {
    let newMembers = ctx.message.new_chat_members;
    if (newMembers) {
      return isMessageFromAdmin(ctx).then(hasAccess => {
        if (!hasAccess)
          newMembers.forEach(newMember => ctx.kickChatMember(newMember.id));
      });
    }
  }

  return next();
};
