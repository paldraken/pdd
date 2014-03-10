define([
    'jquery',
    'underscore',
    'marionette',
    'backbone'
], function($, _, Marionette, Backbone) {

    return Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'progress-container text-center',
        itemView: Marionette.ItemView.extend({
            tagName: 'li',
            className: 'progress-item badge default',
            template: _.template('<%= (index+1) %>'),
            templateHelpers: {
            },
            onShow: function() {
                var self = this;
                this.model.on('change', function() {
                    var result = self.model.get('result');
                    self.$el.removeClass('default');
                    switch (result) {
                        case -2: self.$el.addClass('warning'); break;
                        case -1: self.$el.addClass('danger'); break;
                        case 1: self.$el.addClass('secondary'); break;
                        default: self.$el.addClass('default');
                    }
                });
            }
        })
    });
});