const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const config = require('../config.json');

const db = low(new FileSync(config.db.path));
db.defaults({ muted: [] }).write();
module.exports = db;
