module.exports = () => (ctx, next) => ctx.chat.type === 'private' && next();
