const log = require('debug')('emperors-bot');
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const config = require('../config.json').bot;

const access = require('./middleware/access');
const ask = require('./middleware/ask');
const allowedChat = require('./middleware/allowed-chat');
const messageLogger = require('./middleware/message-logger');
const inPrivate = require('./middleware/in-private');
const trusted = require('./commands/trusted');
const muted = require('./commands/muted');
const say = require('./commands/say');

module.exports = class Bot extends Telegraf {
  constructor() {
    super(config.token);
    this._loadMiddleware();
  }

  _loadMiddleware() {
    // log received messages
    this.on('message', messageLogger());
    this.on('edited_message', messageLogger());
    this.on('callback_query', messageLogger.cbQuery());

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
    this.on('message', muted.middleware());

    this.context.ask = ask;
    this.command('cancel', ask.cancel());
    this.on('message', ask.middleware());

    // allow commands only in the private chat
    this.command(inPrivate());
    // allow commands only for trusted and the emperor
    this.command(access.trustedAndEmperor());
    // parse commands only if user has access to them
    this.command(commandParts());

    // ignore chat actions only in groups
    this.action(/.*/, inPrivate());
    // allow following chat actions only for trusted and the emperor
    this.action(/.*/, access.trustedAndEmperor());

    this.command('say', say());

    this.command('muted', muted());

    this.action(/^muted\+$/, muted.add());
    this.action(/^muted-(\d+)$/, muted.delete());

    // allow following commands only for the emperor
    this.command(access.emperor());

    this.command('trusted', trusted());

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
