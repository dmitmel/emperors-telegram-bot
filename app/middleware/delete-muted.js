const muted = require('../db').get('muted');

module.exports = () => (ctx, next) =>
  ctx.chat.type !== 'private' &&
  muted.find(user => user === ctx.from.username).value()
    ? ctx.deleteMessage(ctx.message.id)
    : next();
