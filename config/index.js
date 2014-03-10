var path = require('path');
var nconf = require('nconf');
var fs = require('fs');

var confFile = '';

if (fs.existsSync(path.join(__dirname, 'config.json'))) {
    confFile = path.join(__dirname, 'prod_conf.json');
} else {
    confFile = path.join(__dirname, 'config.json')
}

var conf = nconf
    .argv()
    .env()
    .file(confFile);

module.exports = conf;

