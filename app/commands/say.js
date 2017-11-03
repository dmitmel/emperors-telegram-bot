module.exports = () => ctx => {
  // messages in private chats can't be deleted
  if (ctx.chat.type !== 'private') ctx.deleteMessage(ctx.message.id);

  let msg = ctx.state.command.args;
  // prevent bot from sending empty messages
  if (msg) ctx.reply(msg);
};
