define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!app/quest/tpl/result.html',
    'text!app/quest/tpl/bad.html'
], function($, _, Backbone, Marionette, tpl, badTpl) {

    var BadQuestions = Marionette.CollectionView.extend({
        itemView: Marionette.ItemView.extend({
            template: _.template(badTpl),
            className: 'bad-answers',
            serializeData: function() {
                var choiceId = this.model.get('choice_id');
                var rightAnswer = _.findWhere(this.model.get('answers'), {isRight: true}).answerText;
                var userAnswer = _.findWhere(this.model.get('answers'), {_id: choiceId}).answerText;

                return _.defaults(this.model.attributes, {
                    "rightAnswer": rightAnswer,
                    "userAnswer": userAnswer
                });
            }
        })
    });

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        badQuestions: [],
        hintQuestions: [],
        badQuestionsView: null,
        className: 'questions-result',
        initialize: function() {
            this.badQuestions = this.collection.where({result: -1});
            this.hintQuestions = this.collection.where({result: -2});
        },
        serializeData: function(){

            return {
                "badCount": this.badQuestions.length + this.hintQuestions.length,
                "allCount": this.collection.length,
                "hintQuestions": this.hintQuestions.length,
                "biletNum": this.collection.at(0).get('biletNum')
            };
        },
        onShow: function() {
            var badColl,
                allFail = 0;
            if (this.badQuestions.length) {
                badColl = new Backbone.Collection();
                badColl.add(this.badQuestions);
                this.badQuestionsView = new BadQuestions({
                    collection: badColl,
                    el: $('.bad-question-list', this.$el)
                }).render();
            }
            allFail = this.badQuestions.length + this.hintQuestions.length;
            if (Modernizr.localstorage) {
                var storeId = this.collection.storeId;
                localStorage.setItem(storeId, allFail);
            }


        },
        onClose: function() {
            if (this.badQuestionsView) {
                this.badQuestionsView.close();
            }
        }
    });
});
