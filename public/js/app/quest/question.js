define([
    'app/app',
    'jquery',
    'underscore',
    'marionette',
    'backbone',
    'text!app/quest/tpl/question.html'
], function(App, $, _, Marionette, Backbone, tpl) {

    return Marionette.ItemView.extend({
        template: _.template(tpl),
        ui: {
            confirm: '.confirm',
            answer: '.answer-item',
            hintHead: '.hint-head',
            hintContainer: '.hint-container',
            hintButton: '.show-hint'
        },
        events: {
            'click .confirm': 'onConfirm',
            'click .answer-item': 'onAnswer',
            'click .show-hint': 'onHint'
        },
        serializeData: function() {
            var biletName = this.collection.name;

            return _.defaults(this.model.attributes, {
                "biletName": biletName
            });
        },
        hintUsed: false,
        onHint: function() {
            this.hintUsed = true;
            this.ui.hintButton.hide();
            this.ui.hintHead.text('Подсказка');
            this.ui.hintContainer.html(this.model.get('hint'));
        },
        onKeypress: function(e) {
            var selector = '',
                element;
            switch (e.keyCode) {
                case 49: selector = '[data-pos=0]'; break;
                case 50: selector = '[data-pos=1]'; break;
                case 51: selector = '[data-pos=2]'; break;
                case 52: selector = '[data-pos=3]'; break;
            }
            element = $(selector, this.$el);
            if (selector && element.length) {
                e.preventDefault();
                if (element.hasClass('active')) {
                    this.onConfirm();
                } else {
                    this.applyAnswer(element);
                }
            }
        },
        onConfirm: function() {
            var answer = $('.answer-item.active', this.$el);
            if (answer.length === 1) {
                this.collection.trigger('quest:next', answer.attr('data-id'), this.hintUsed);
            } else {
                $('.choice-alert', this.$el).show();
            }

        },
        onAnswer: function(e) {
            this.applyAnswer($(e.target));
        },
        applyAnswer: function(element) {
            $('.choice-alert', this.$el).hide();
            $('.answer-item', this.$el).removeClass('active');
            element.addClass('active');
        },
        onShow: function() {
            var self = this;
            $(window).on('keyup.question', function(e) {
                self.onKeypress(e);
            });
            this.$el.css({opacity: 0});
            this.$el.animate({
                opacity: 1
            }, "slow" );
        },
        onClose: function() {
            $(window).off('keyup.question');
            this.$el.animate({
                opacity: 0
            }, "slow" );
        }
    });
});