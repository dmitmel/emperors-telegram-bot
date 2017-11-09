// enable debug output
process.env.DEBUG = 'emperors-bot,emperors-bot:*';

const Bot = require('./app/bot');
new Bot().start();
