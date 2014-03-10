var config = require('./config');
var mongoose = require('./lib/mongoose');

var async = require('async');

var pddParser = require('./lib/pdd_parser');
var hintParser = require('./lib/hint_parser');
var themesInit = require('./lib/init_themes');

var onlyInitDB = false;

process.argv.forEach(function(val, index, array) {
    if (val.trim() === '-init') {
        onlyInitDB = true;
    }
});

if (onlyInitDB) {
    async.series([
        function(cb) {
            themesInit(cb);
        },
        function(cb) {
            mongoose.disconnect();
            cb(null);
        }
    ]);
} else {
    async.series([
        function(cb) {
            pddParser(cb);
        },
        function(cb) {
            hintParser(cb);
        },
        function(cb) {
            mongoose.disconnect();
            cb(null);
        }
    ]);
}