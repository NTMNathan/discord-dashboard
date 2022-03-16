const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
	serverId: String,
	prefix: String,
});

module.exports = mongoose.model('server', serverSchema);