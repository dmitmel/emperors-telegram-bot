const { imperialChatID } = require('../../config.json').bot;

module.exports = () => ctx => {
  const msg = ctx.state.command.args;
  // prevent bot from sending empty messages
  return msg && ctx.telegram.sendMessage(imperialChatID, msg);
};
