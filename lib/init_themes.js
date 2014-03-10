
var Theme = require('../models/theme').Theme;
var config = require('../config');
var async = require('async');


var initThemes = require('../config/init_theme.json');

module.exports = function(endCallback) {

    async.series([
        function(callback){
            Theme.remove({}, function (err) {
                if (err) { callback(err) }
                else callback(null);
            });
        },
        function(callback){

            function createTheme(theme, createCb) {
                Theme.create(theme, function (err, resut) {
                    if (err) { createCb(err) }
                    else createCb(null);
                })
            }

            async.each(initThemes, createTheme, function(err) {
                if (err) throw new Error(err);
                console.log('add complite');
                callback(null);
            });

        }
    ],
    function(err){
        if (err) {
            throw new Error(err);
        } else {
            endCallback(null);
        }
    });


};
