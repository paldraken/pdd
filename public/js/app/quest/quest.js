define([
    'app/app',
    'jquery',
    'underscore',
    'marionette',
    'backbone',
    'app/quest/question',
    'app/quest/progress',
    'app/quest/result',
    'text!app/quest/tpl/layout.html'
],  function(App, $, _, Marionette, Backbone, Question, Progress, Result, layoutTpl) {

    var QuestColl = Backbone.Collection.extend({
        type: 'bilet',
        model: Backbone.Model.extend({
            defaults: {
                result: 0
            }
        })
    });

    return Marionette.Layout.extend({
        template: _.template(layoutTpl),
        regions: {
            progress: '.quest-progress',
            container: '.quest-container'
        },
        currentProgress: 0,
        initialize: function(options) {
            var self = this;
            this.questId = options.questId || 1;
            this.questType = options.questType || 'bilet';
            this.collection = new QuestColl();

            if (this.questType == 'bilet') {
                this.collection.url = '/pdd/' + self.questId;
                this.collection.type = 'bilet';
                this.collection.storeId = 'bilet_' + self.questId;
                this.collection.name = 'Билет № ' + self.questId;
            } else {
                this.collection.url = '/pdd/theme/' + self.questId;
                this.collection.type = 'theme';
                this.collection.storeId = 'theme_' + self.questId;
                this.collection.name = 'Тема: ' + self.questId;
            }

            this.collection.fetch();

            this.collection.on('sync', function() {
                self.onSyncData();
            });

            this.collection.on('quest:next', function(answerId, hintUsed) {
                self.onNext(answerId, hintUsed);
            });

        },
        onNext: function(answerId, hintUsed) {
            var self = this,
                currModel = this.collection.at(this.currentProgress),
                answers = currModel.get('answers'),
                result = -1;

            _.each(answers, function(ans) {
                if (ans._id == answerId && ans.isRight) result = 1;
            });


            if(hintUsed) {
                result = -2;
                currModel.set('hint_used', true);
            }

            currModel.set('choice_id', answerId);

            self.collection.at(this.currentProgress).set('result', result);
            currModel.set('result', result);

            this.currentProgress++;

            if (this.currentProgress < this.collection.length ) {
                this.container.show(new Question({
                    model: self.collection.at(self.currentProgress),
                    collection: self.collection
                }));
            } else {
                this.container.show(new Result({
                    collection: self.collection
                }));
            }
        },
        onSyncData: function() {
            var self = this;

            self.collection.each(function(item, index) {
                item.set('index', index);
            });

            self.container.show(new Question({
                model: self.collection.at(self.currentProgress),
                collection: self.collection
            }));

            this.progress.show(new Progress({
                collection: self.collection
            }));
        }
    });

});