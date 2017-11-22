const log = require('debug')('emperors-bot:messages');
const replicators = require('telegraf/lib/helpers/replicators');

module.exports = () => (ctx, next) => {
  const msg = ctx.editedMessage || ctx.message;
  if (msg) log(formatMessage(msg));
  return next();
};

module.exports.cbQuery = () => (ctx, next) => {
  const cbQuery = ctx.callbackQuery;
  if (cbQuery) log(formatCbQuery(cbQuery));
  return next();
};

function formatMessage(msg) {
  const time = formatMessageTime(msg);
  const user = formatUser(msg.from);
  const chat = formatChat(msg.chat);

  let content = '';

  if (msg.forward_from) {
    content += ` (fwd from ${formatUser(msg.forward_from)})`;
  }

  if (msg.reply_to_message) {
    content += ` (re to ${msg.reply_to_message.message_id})`;
  }

  if (msg.edit_date) {
    content += ' (edit)';
  }

  if (msg.text) {
    content += ` > ${msg.text}`;
  } else if (msg.new_chat_members) {
    content += `: added ${msg.new_chat_members.map(formatUser).join(', ')}`;
  } else if (msg.left_chat_member) {
    content += `: removed ${formatUser(msg.left_chat_member)}`;
  } else if (msg.new_chat_title) {
    content += `: changed chat name to "${msg.new_chat_title}"`;
  } else if (msg.new_chat_photo) {
    content += `: updated chat photo`;
  } else if (msg.contact) {
    content += `: contact of ${formatUser(msg.contact)}`;
  } else if (msg.location) {
    const { latitude, longitude } = msg.location;
    content += `: location on ${latitude} ${longitude}`;
  } else {
    const type = getMessageType(msg);
    content += type ? `: ${type}` : ': message';
  }

  return `${msg.message_id} [${time}] ${user} in ${chat}${content}`;
}

function formatCbQuery(cbQuery) {
  const user = formatUser(cbQuery.from);

  if (cbQuery.message) {
    const msg = cbQuery.message;
    const chat = formatChat(msg.chat);

    return `${user} in ${chat} (cb query from ${msg.message_id}): ${cbQuery.data}`;
  } else {
    return `${user} (cb query): ${cbQuery.data}`;
  }
}

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

function formatUser({ first_name, last_name }) {
  let name = first_name;
  if (last_name) name += ` ${last_name}`;
  return name;
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
