const { imperialChatID } = require('../../config.json').bot;

module.exports = options => ctx => {
  const newMembers = ctx.message.new_chat_members;
  // if bot was added to a group
  // const botID = getBotID();
  if (newMembers.find(({ id }) => id === options.id)) {
    const chatID = ctx.chat.id;
    if (chatID !== imperialChatID) {
      const chatType = ctx.chat.type;
      ctx.replyWithMarkdown(
        `Looks like this ${chatType} is not *the Empire*. ` +
          `Please, contact *the emperor* and ask him move *the Empire* to ` +
          `the following coordinates: \`${chatID}\`.`
      );
      ctx.leaveChat();
    } else {
      ctx.reply(
        '#Hello_there, everyone! Please, make me admin so ' +
          'I have access to messages.'
      );
    }
  }
};
