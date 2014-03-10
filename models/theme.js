var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var themeSchema = new Schema({
    themeNum: Number,
    themeName: String,
    themeSections: [{
        pddSection: String,
        pddName: String
    }],
    themeQuests: [Number]
});

exports.Theme = mongoose.model('Theme', themeSchema);