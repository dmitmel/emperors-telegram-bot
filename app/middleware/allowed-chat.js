const { imperialChatID } = require('../../config.json').bot;

module.exports = options => (ctx, next) => {
  const newMembers = ctx.message.new_chat_members;
  // if bot was added to a group
  if (!newMembers.find(({ id }) => id === options.id)) return next();

  const chatID = ctx.chat.id;
  if (chatID !== imperialChatID) {
    const chatType = ctx.chat.type;
    return ctx
      .replyWithMarkdown(
        `Looks like this ${chatType} is not *the Empire*. ` +
          `Please, contact *the emperor* and ask him move *the Empire* to ` +
          `the following coordinates: \`${chatID}\`.`
      )
      .then(() => ctx.leaveChat());
  } else {
    return ctx.reply(
      '#Hello_there, everyone! Please, make me admin so ' +
        'I have access to messages.'
    );
  }
};
