const db = require('../db');

module.exports = {
  mute: () => ctx => {
    const user = ctx.state.command.args;
    if (user) {
      db
        .get('muted')
        .push(user)
        .write();
    }
  },

  muted: () => ctx => {
    const muted = db
      .get('muted')
      .map(user => `@${user}`)
      .join(', ')
      .value();
    return muted && ctx.reply(muted);
  },

  unmute: () => ctx => {
    const user = ctx.state.command.args;
    if (user) {
      db
        .get('muted')
        .pull(user)
        .write();
    } else {
      db.set('muted', []).write();
    }
  }
};
