const db = require('../db');

module.exports = () => (ctx, next) => {
  if (ctx.chat.type !== 'private') {
    let muted = db.get('muted').value();
    if (muted.find(user => user === ctx.from.id))
      ctx.deleteMessage(ctx.message.id);
  }

  return next();
};
