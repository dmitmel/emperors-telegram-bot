const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const adminAccess = require('./middleware/admin-access');
const messageLogger = require('./middleware/message-logger');

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
    // log received messages
    this.client.on('message', messageLogger());
    // allow commands only for admins
    this.client.command(
      adminAccess({
        onAccessDenied(ctx) {
          // send video with angry R2-D2
          ctx.reply('https://youtu.be/aX6OfhJMWGk');
        }
      })
    );
    // parse commands only if user has access to them
    this.client.command(commandParts());
  }

  start() {
    this.client.startPolling();
    log('started');
  }
};
