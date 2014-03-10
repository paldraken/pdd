var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var pddSchema = new Schema({
    examType: {
        type: String,
        required: true
    },
    biletNum: {
        type: Number,
        required: true
    },
    questionNum: {
        type: Number,
        required: true
    },
    questionText: {
        type: String
    },
    questionImage: {
        type: String
    },
    questionImageRaw: {
        type: String
    },
    answers: [
        {answerText: String, isRight: Boolean}
    ],
    hint: {
        type: String
    }
});


pddSchema.index({examType: 2, biletNum: 1, questionNum: -1}, {unique: true});

// todo enable for production
//pddShema.set('autoIndex', false);

exports.Pdd = mongoose.model('Pdd', pddSchema);

