const replicators = require('telegraf/lib/helpers/replicators');

const MESSAGE_TYPES = Object.keys(replicators.copyMethods);
exports.getMessageType = msg => {
  return MESSAGE_TYPES.find(type => msg[type] != null);
};
