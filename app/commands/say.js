const { imperialChatID } = require('../../config.json').bot;

module.exports = () => ctx => {
  const msg = ctx.state.command.args;
  // prevent bot from sending empty messages
  if (msg) ctx.telegram.sendMessage(imperialChatID, msg);
};
