const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const config = require('../config.json');

const adminAccess = require('./middleware/admin-access');
const messageLogger = require('./middleware/message-logger');
const deleteMuted = require('./middleware/delete-muted');
const { mute, muted, unmute } = require('./commands/mute');
const say = require('./commands/say');

module.exports = class Bot extends Telegraf {
  constructor() {
    super(config.token);
    this._loadMiddleware();
  }

  _loadMiddleware() {
    // log received messages
    this.on('message', messageLogger());
    // kick members added by non-admins
    this.on(
      'new_chat_members',
      adminAccess({
        onAccessDenied: ctx => {
          let newMembers = ctx.message.new_chat_members;
          newMembers.forEach(({ id }) => ctx.kickChatMember(id));
        }
      })
    );
    // delete messages from muted users
    this.on('message', deleteMuted());
    // allow commands only for admins
    this.command(
      adminAccess({
        onAccessDenied: ctx => {
          ctx.reply(config.accessDenied);
        }
      })
    );
    // parse commands only if user has access to them
    this.command(commandParts());

    this.command('say', say());
    this.command('mute', mute());
    this.command('muted', muted());
    this.command('unmute', unmute());
  }

  start() {
    log('starting');
    this.telegram.getMe().then(({ username }) => {
      this.options.username = username;
      log(`connected to bot @${username}`);
      this.startPolling();
      log('started polling');
    });
  }
};
