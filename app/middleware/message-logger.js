const log = require('debug')('emperors-bot:messages');
const { getMessageType } = require('../utils/message-type');

module.exports = ({ messageToString } = {}) => (ctx, next) => {
  let msg = ctx.message;
  let msgType = getMessageType(msg);

  if (msgType) {
    let str = '';
    if (messageToString) str = messageToString(msg, msgType);
    else str = msgType === 'text' ? msg.text : `(${msgType})`;

    log('> %s', str);
  }

  return next();
};
