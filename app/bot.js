const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const adminAccess = require('./middleware/admin-access');
const addMembers = require('./middleware/add-members');
const messageLogger = require('./middleware/message-logger');

const say = require('./commands/say');

module.exports = class Bot extends Telegraf {
  constructor({ token, accessDenied }) {
    super(token, { accessDenied });
    this._getInfo();
    this._loadMiddleware();
  }

  _getInfo() {
    this.telegram.getMe().then(({ username }) => {
      this.options.username = username;
      log(`connected to bot @${username}`);
    });
  }

  _loadMiddleware() {
    // log received messages
    this.on('message', messageLogger());
    // don't allow non-admins to add members
    this.on('message', addMembers());
    // allow commands only for admins
    this.command(
      adminAccess({
        onAccessDenied: ctx => ctx.reply(this.options.accessDenied)
      })
    );
    // parse commands only if user has access to them
    this.command(commandParts());

    this.command('say', say());
  }

  start() {
    this.startPolling();
    log('started');
  }
};
