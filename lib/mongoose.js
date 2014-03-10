var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.get('db:uri'), config.get('mongoose:options'));

module.exports = mongoose;

