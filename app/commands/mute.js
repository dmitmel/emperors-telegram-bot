const db = require('../db');

module.exports = {
  mute: () => ctx => {
    let user = ctx.state.command.args;
    if (user) {
      db
        .get('muted')
        .push(user)
        .write();
    }
  },

  muted: () => ctx => {
    let muted = db
      .get('muted')
      .map(user => `@${user}`)
      .join(', ')
      .value();
    if (muted) ctx.reply(muted);
  },

  unmute: () => ctx => {
    let user = ctx.state.command.args;
    if (user) {
      db
        .get('muted')
        .remove(otherUser => otherUser === user)
        .write();
    } else {
      db.set('muted', []).write();
    }
  }
};
