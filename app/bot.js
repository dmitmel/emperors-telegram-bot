const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const adminAccess = require('./middleware/admin-access');
const addMembers = require('./middleware/add-members');
const messageLogger = require('./middleware/message-logger');

const say = require('./commands/say');

module.exports = class Bot {
  constructor({ token }) {
    log('token: %s', token);

    this.client = new Telegraf(token);
    this._getInfo();
    this._loadMiddleware();
  }

  _getInfo() {
    let telegram = this.client.telegram;
    telegram.getMe().then(({ username }) => {
      this.client.options.username = username;
      log('connected to bot @%s', username);
    });
  }

  _loadMiddleware() {
    let client = this.client;

    // log received messages
    client.on('message', messageLogger());
    // don't allow non-admins add members
    client.on('message', addMembers());
    // allow commands only for admins
    client.command(
      adminAccess({
        onAccessDenied(ctx) {
          // send video with angry R2-D2
          ctx.reply('https://youtu.be/aX6OfhJMWGk');
        }
      })
    );
    // parse commands only if user has access to them
    client.command(commandParts());

    client.command('say', say());
  }

  start() {
    this.client.startPolling();
    log('started');
  }
};
