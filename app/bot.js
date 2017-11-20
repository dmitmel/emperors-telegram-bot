const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const config = require('../config.json').bot;

const access = require('./middleware/access');
const ask = require('./middleware/ask');
const allowedChat = require('./middleware/allowed-chat');
const messageLogger = require('./middleware/message-logger');
const deleteMuted = require('./middleware/delete-muted');
const inPrivate = require('./middleware/in-private');
const trusted = require('./commands/trusted');
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

    // leave not allowed chats
    this.on(
      'new_chat_members',
      allowedChat(
        // bot fetches its ID and saves it into `this.options` in the `start`
        // method, so `allowedChat` middleware will get it automatically due to
        // object references
        this.options
      )
    );

    // kick members added by ordinary users
    this.on(
      'new_chat_members',
      access.trustedAndEmperor({
        onAccessDenied: ctx => {
          const newMembers = ctx.message.new_chat_members;
          newMembers.forEach(({ id }) => ctx.kickChatMember(id));
        }
      })
    );

    // delete messages from muted users
    this.on('message', deleteMuted());

    this.context.ask = ask;
    this.command('cancel', ask.cancel());
    this.on('message', ask.middleware());

    // allow commands only in the private chat
    this.command(inPrivate());
    // allow commands only for trusted and the emperor
    this.command(access.trustedAndEmperor());
    // parse commands only if user has access to them
    this.command(commandParts());

    this.command('say', say());
    this.command('mute', mute());
    this.command('muted', muted());
    this.command('unmute', unmute());

    // allow following commands only for the emperor
    this.command(access.emperor());

    this.command('trusted', trusted());

    // allow following chat actions only in the private chat
    this.action(/.*/, inPrivate());
    // allow following chat actions only for the emperor
    this.action(/.*/, access.emperor());

    this.action(/^trusted\+$/, trusted.add());
    this.action(/^trusted-(\d+)$/, trusted.delete());
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
