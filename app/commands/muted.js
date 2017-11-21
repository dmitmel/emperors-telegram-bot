const { Markup } = require('telegraf');
const mutedIDs = require('../db').get('muted');

function createKeyboard(ctx) {
  return fetchMuted(ctx).then(muted => {
    const buttons = [];

    muted.forEach(user => {
      buttons.push(createUserButton(user));
      buttons.push(Markup.callbackButton('<Delete>', `muted-${user.id}`));
    });

    buttons.push(Markup.callbackButton('<Add>', 'muted+'));

    return Markup.inlineKeyboard(buttons, { columns: 2 });
  });
}

function fetchMuted(ctx) {
  return Promise.all(
    mutedIDs.value().map(userID => ctx.telegram.getChat(userID))
  );
}

function createUserButton({ first_name, last_name, username }) {
  return Markup.urlButton(
    last_name ? `${first_name} ${last_name}` : first_name,
    username ? `https://t.me/${username}` : 'https://t.me/'
  );
}

function updateKeyboard(ctx) {
  return createKeyboard(ctx).then(keyboard =>
    ctx.editMessageReplyMarkup(keyboard)
  );
}

module.exports = () => ctx =>
  createKeyboard(ctx).then(keyboard =>
    ctx.reply('Here are muted users:', keyboard.extra())
  );

module.exports.add = () => ctx => {
  ctx
    .answerCallbackQuery()
    .then(() => ctx.reply('Please, send me a contact'))
    .then(() =>
      ctx.ask({
        validator: msg => msg.contact,
        onInvalid: () => ctx.reply('Please, send me a contact')
      })
    )
    .then(({ contact }) => {
      const userID = contact.user_id;
      if (mutedIDs.includes(userID).value()) return undefined;

      mutedIDs.push(userID).write();
      return updateKeyboard(ctx);
    });
};

module.exports.delete = () => ctx => {
  ctx.answerCallbackQuery().then(() => {
    let userID = parseInt(ctx.match[1], 10);
    mutedIDs.pull(userID).write();

    return updateKeyboard(ctx);
  });
};

module.exports.middleware = () => (ctx, next) => {
  const shouldDelete =
    ctx.chat.type !== 'private' &&
    mutedIDs.find(user => user === ctx.from.id).value();
  if (shouldDelete) ctx.deleteMessage(ctx.message.id);
  return next();
};
