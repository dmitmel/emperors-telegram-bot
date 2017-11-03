const log = require('debug')('emperors-bot:messages');
const { getMessageType } = require('../utils/messages');

module.exports = ({ messageToString } = {}) => {
  return (ctx, next) => {
    let msg = ctx.message;
    let msgType = getMessageType(msg);

    if (msgType != null) {
      let str = '';
      if (messageToString) str = messageToString(msg, msgType);
      else str = msgType === 'text' ? msg.text : `(${msgType})`;

      log('> %s', str);
    }

    return next();
  };
};
