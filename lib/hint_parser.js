var http = require('http');
var async = require('async');
var Pdd = require('../models/pdd').Pdd;
var config = require('../config');

var baseHost = config.get('parser_hint:host');
var baseUrl = config.get('parser_hint:base_url');

module.exports = function(endCallback) {

    var url = '';
    var bilets = [];

    for(var x = 1; x <= 40; x++) {
        bilets.push(x);
    }

    async.eachSeries(bilets, getBilet, function(err) {
        if (err) throw new Error('Parse hints error');
        endCallback(null);
    });

    function getBilet(biletNum, cb) {
        url = baseUrl + biletNum + '.json';
        var options = {
            hostname: baseHost,
            port: 80,
            path: url,
            method: 'GET'
        };

        var req = http.request(options, function(res){
            var data = '';

            res.on('data', function (chunk){
                data += chunk;
            });

            res.on('end',function(){
                var obj = JSON.parse(data);

                function getQuestion(bilet, callback) {
                    var biletNum = bilet.biletNumber;
                    var questionNum = bilet.questNumber;
                    var hint = bilet.comments.replace(/(<([^>]+)>)/ig,"");
                    var dbCondition = {biletNum: biletNum, questionNum: questionNum, examType: 'AB'};

                    Pdd.findOneAndUpdate(dbCondition, {hint: hint}, function(err, doc) {
                        if (err) throw new Error('Mongo hint error');
                        callback(null);
                    });
                }

                async.eachSeries(obj, getQuestion, function() {
                    cb(null);
                });

            })
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    }

};


