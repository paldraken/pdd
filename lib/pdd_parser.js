var request = require('request');
var Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');
var async = require('async');
var encode = new Iconv('cp1251','utf-8');
var config = require('../config');

var Pdd = require('../models/pdd').Pdd;

var baseUrl = config.get('parser_pdd:base_url');

module.exports = function(endCallback) {
    var questions = [];

    for(var x = 1; x <= 40; x++) {
        for(var y = 1; y <= 20; y++) {
            questions.push({
                bilet: x,
                quest: y
            });
        }
    }

    function getLink(bilet, quest, isImage) {
        if (bilet < 10) bilet = '0' + bilet;
        if (quest < 10) quest = '0' + quest;
        return baseUrl + bilet + '/' + quest + (isImage ? '.jpg' : '.htm');
    }

    async.eachSeries(questions, getQuest, function(err) {
        if(err) {
            throw new Error(err);
        } else {
            endCallback(null);
        }
    });

    function getQuest(questions, cb) {
        var bilet = questions.bilet;
        var quest = questions.quest;
        var url = getLink(bilet, quest, false);

        request({url: url, encoding:null}, function(err, res, body){
            console.log(url);
            $ = cheerio.load(encode.convert(body).toString());
            var dbUpdate = {},
                dbCondition = {biletNum: bilet, questionNum: quest, examType: 'AB'};

            dbUpdate.examType = 'AB';
            dbUpdate.biletNum = bilet;
            dbUpdate.questionNum = quest;
            dbUpdate.questionText = $('h2').last().text();
            dbUpdate.questionImageRaw = $('img').last().attr('src') || '';
            dbUpdate.questionImageRaw = dbUpdate.questionImageRaw ? getLink(bilet, quest, true) : '';
            dbUpdate.answers = [];

            $('ol li a').each(function(i, elem) {
                dbUpdate.answers.push({
                    answerText: $(this).text(),
                    isRight: $(this).attr('href')[2] == '1'
                });
            });
            Pdd.findOneAndUpdate(dbCondition, dbUpdate,{upsert: true}, function(err, doc) {
                if (err)  {
                    cb(err);
                } else {
                    cb(null);
                }
            });
        });
    }


};

