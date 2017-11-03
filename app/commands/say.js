module.exports = () => ctx => {
  ctx.deleteMessage(ctx.message.id);
  ctx.reply(ctx.state.command.args);
};
