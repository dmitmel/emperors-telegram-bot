const log = require('debug')('emperors-bot:messages');
const replicators = require('telegraf/lib/helpers/replicators');

const MESSAGE_TYPES = Object.keys(replicators.copyMethods);
function getMessageType(msg) {
  return MESSAGE_TYPES.find(type => msg[type]);
}

function formatMessageTime({ date }) {
  // date is multiplied by 1000 to convert seconds to milliseconds
  date = new Date(date * 1000);
  const hours = `0${date.getHours()}`.substr(-2);
  const minutes = `0${date.getMinutes()}`.substr(-2);
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
  const msg = ctx.message;
  const type = getMessageType(msg);

  if (type) {
    const time = formatMessageTime(msg);
    const user = formatUser(ctx.from);
    const chat = formatChat(ctx.chat);
    const contents = type === 'text' ? msg.text : `(${type})`;
    log(`[${time}] ${user} in ${chat}: ${contents}`);
  }

  return next();
};
