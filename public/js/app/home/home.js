define([
    'jquery',
    'underscore',
    'marionette',
    'backbone',
    'app/home/theme-view',
    'text!app/home/tpl/home.html'
], function($, _, Marionette, Backbone, ThemeView, tpl) {

    var labelsHelper = {

    };

    return Marionette.ItemView.extend({
        examHistory: {},
        className: 'bilets-home',
        ui: {
            themeListCaption: '.theme-list-caption'
        },
        initialize: function() {

            this.themeView = new ThemeView();
            if (Modernizr.localstorage) {
                for(var i = 1; i <= 40; i++) {
                    var value = localStorage.getItem('bilet_' + i);
                    this.examHistory[i] = (value == '') ? '' : parseInt(value);
                }
            }
        },
        onShow: function() {
            var self = this;
            if(this.showParam == 'th') {
                $('html, body').animate({
                    scrollTop: self.ui.themeListCaption.offset().top
                }, 500);
            }
            this.themeView.$el = $('.themes-list', this.$el);
            this.themeView.render();
        },
        onClose: function() {
            this.themeView.close();
        },
        serializeData: function(){
            return {
                "examHistory": this.examHistory
            }
        },
        template: _.template(tpl)
    });

});