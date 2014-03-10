var Pdd = require('../models/pdd').Pdd;
var Theme = require('../models/theme').Theme;


module.exports = function(app) {

    app.get('/pdd/:id([0-9]+)', function(req, res, next) {
        var biletNum = req.params.id || 1;
        Pdd
            .find({examType: 'AB', biletNum: biletNum})
            .sort('questionNum')
            .exec(function(err, questions) {
                if (err) return next(err);
                questions = questions || [];
                res.json(questions);
            });
    });

    app.get('/pdd/themes', function(req, res, next) {
        Theme.find().sort('themeNum')
            .exec(function(err, themes) {
                if (err) return next(err);
                res.json(themes);
            });
    });

    app.get('/pdd/theme/:id([0-9]+)', function(req, res, next) {
        var themeNum = req.params.id || 1;
        Theme.findOne({themeNum: themeNum}, 'themeQuests', function(err, theme) {
            if (err) return next(err);
            Pdd.find({questionNum: { $in: theme.themeQuests}, examType: 'AB'})
                .sort()
                .exec(function(err, bilets) {
                    if (err) return next(err);
                    res.json(bilets);
                });
        })
    });
};