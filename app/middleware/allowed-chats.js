const _ = require('lodash');
const { allowedChats } = require('../../config.json').bot;

module.exports = ({ getBotID }) => ctx => {
  let newMembers = ctx.message.new_chat_members;
  // if bot was added to a group
  if (_.find(newMembers, ['id', getBotID()])) {
    let chatID = ctx.chat.id;
    if (!_.includes(allowedChats, chatID)) {
      let chatType = ctx.chat.type;
      ctx.replyWithMarkdown(
        `Looks like this ${chatType} is outside *the Empire*. ` +
          `Please, contact *the emperor* and ask him to add \`${chatID}\` ` +
          `(ID of this ${chatType}) to the allowed groups.`
      );
      ctx.leaveChat();
    } else {
      ctx.reply('#Hello_there, everyone!');
    }
  }
};
