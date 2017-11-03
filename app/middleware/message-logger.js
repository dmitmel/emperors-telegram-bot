const log = require('debug')('emperors-bot:messages');
const replicators = require('telegraf/lib/helpers/replicators');

const MESSAGE_TYPES = Object.keys(replicators.copyMethods);
function getMessageType(msg) {
  return MESSAGE_TYPES.find(type => msg[type] != null);
}

function formatMessageTime({ date }) {
  // date is multiplied by 1000 to convert seconds to milliseconds
  date = new Date(date * 1000);
  let hours = `0${date.getHours()}`.substr(-2);
  let minutes = `0${date.getMinutes()}`.substr(-2);
  // time in the HH:MM format
  return `${hours}:${minutes}`;
}

function formatUser({ username }) {
  return `@${username}`;
}

function formatChat({ type, title }) {
  switch (type) {
    case 'private':
      return 'private chat';
    case 'group':
      return `group "${title}"`;
    case 'supergroup':
      return `supergroup "${title}"`;
    case 'channel':
      return `channel "${title}"`;
    default:
      return 'unknown chat';
  }
}

module.exports = () => (ctx, next) => {
  let msg = ctx.message;
  let type = getMessageType(msg);

  if (type) {
    let time = formatMessageTime(msg);
    let user = formatUser(ctx.from);
    let chat = formatChat(ctx.chat);
    let contents = type === 'text' ? msg.text : `(${type})`;
    log(`[${time}] ${user} in ${chat}: ${contents}`);
  }

  return next();
};
