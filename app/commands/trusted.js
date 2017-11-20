const { Markup } = require('telegraf');
const trustedIDs = require('../db').get('trusted');

function createKeyboard(ctx) {
  return fetchTrusted(ctx).then(trusted => {
    const buttons = [];

    trusted.forEach(user => {
      buttons.push(createUserButton(user));
      buttons.push(Markup.callbackButton('<Delete>', `trusted-${user.id}`));
    });

    buttons.push(Markup.callbackButton('<Add>', 'trusted+'));

    return Markup.inlineKeyboard(buttons, { columns: 2 });
  });
}

function fetchTrusted(ctx) {
  return Promise.all(
    trustedIDs.value().map(userID => ctx.telegram.getChat(userID))
  );
}

function createUserButton({ first_name, last_name, username }) {
  return Markup.urlButton(
    last_name ? `${first_name} ${last_name}` : first_name,
    username ? `https://t.me/${username}` : 'https://t.me/'
  );
}

function updateKeyboard(ctx) {
  createKeyboard(ctx).then(keyboard => ctx.editMessageReplyMarkup(keyboard));
}

module.exports = () => ctx => {
  createKeyboard(ctx).then(keyboard =>
    ctx.reply('Here are trusted people:', keyboard.extra())
  );
};

module.exports.add = () => ctx => {
  ctx.answerCallbackQuery();

  ctx.reply('Please, send me a contact');
  ctx
    .ask({
      validator: msg => msg.contact,
      onInvalid: () => {
        ctx.reply('Please, send me a contact');
      }
    })
    .then(({ contact }) => {
      const userID = contact.user_id;
      if (trustedIDs.includes(userID).value()) return;

      trustedIDs.push(userID).write();
      updateKeyboard(ctx);
    });
};

module.exports.delete = () => ctx => {
  ctx.answerCallbackQuery();

  let userID = parseInt(ctx.match[1], 10);
  trustedIDs.pull(userID).write();

  updateKeyboard(ctx);
};
