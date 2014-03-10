define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!app/home/tpl/theme-item.html'
], function($, _, Backbone, Marionette, itemTpl) {

    var ThemesColl = Backbone.Collection.extend({
        url: '/pdd/themes'
    });

    return Marionette.CollectionView.extend({
        collection: new ThemesColl(),
        tagName: 'ul',
        initialize: function() {
            var self = this;
            this.collection.fetch();
        },
        onShow: function() {

        },
        itemView: Marionette.ItemView.extend({
            tagName: 'li',
            events: {
                'click .show-section': 'onSection'
            },
            ui: {
               'themeSections': '.theme-sections'
            },
            template: _.template(itemTpl),
            initialize: function() {
                if (Modernizr.localstorage) {
                    var value = localStorage.getItem('theme_' + this.model.get('themeNum'));
                    this.examHistory = (value == '') ? '' : parseInt(value);
                }
            },
            onSection: function() {
                this.ui.themeSections.toggle();
            },
            onShow: function() {

            },
            serializeData: function() {
                return _.defaults(this.model.attributes, {
                    "examHistory": this.examHistory
                });
            }
        })
    });

});