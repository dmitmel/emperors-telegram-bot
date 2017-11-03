module.exports = () => ctx => {
  ctx.deleteMessage(ctx.message.id);

  let msg = ctx.state.command.args;
  if (msg) ctx.reply(msg);
};
