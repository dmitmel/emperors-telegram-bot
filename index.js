// enable debug output
process.env.DEBUG = 'emperors-bot,emperors-bot:*';

const config = require('./config.json');
const Bot = require('./app/bot');
new Bot(config).start();
