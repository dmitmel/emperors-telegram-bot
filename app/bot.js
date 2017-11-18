const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const config = require('../config.json').bot;

const access = require('./middleware/access');
const allowedChat = require('./middleware/allowed-chat');
const messageLogger = require('./middleware/message-logger');
const deleteMuted = require('./middleware/delete-muted');
const inPrivate = require('./middleware/in-private');
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
    // leave not allowed groups
    this.on(
      'new_chat_members',
      allowedChat({
        getBotID: () => this.options.id
      })
    );
    // kick members added by non-admins
    this.on(
      'new_chat_members',
      access.emperor({
        onAccessDenied: ctx => {
          const newMembers = ctx.message.new_chat_members;
          newMembers.forEach(({ id }) => ctx.kickChatMember(id));
        }
      })
    );
    // delete messages from muted users
    this.on('message', deleteMuted());
    // allow commands only in the private chat
    this.command(inPrivate());
    // allow commands only for admins
    this.command(access.emperor());
    // parse commands only if user has access to them
    this.command(commandParts());

    this.command('say', say());
    this.command('mute', mute());
    this.command('muted', muted());
    this.command('unmute', unmute());
  }

  start() {
    log('starting');
    this.telegram.getMe().then(({ username, id }) => {
      this.options.username = username;
      this.options.id = id;
      log(`connected to bot @${username}`);
      this.startPolling();
      log('started polling');
    });
  }
};
