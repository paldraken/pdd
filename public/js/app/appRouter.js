define([
    'marionette',
    'backbone',
    'app/app',
    'app/home/home',
    'app/quest/quest'
], function(Marionette, Backbone, App, Home, Quest) {

    var appController = Marionette.Controller.extend({

        initialize: function() {
            this.home = new Home();
        },

        doHome: function(param) {
            this.home.showParam = param;
            App.pddQuestions.show(this.home);
        },
        doQuestion: function(questId) {
            App.pddQuestions.show(new Quest({questId: questId}));
        },
        doTheme: function(themeId) {
            App.pddQuestions.show(new Quest({questId: themeId, questType: 'theme'}));
        }
    });

    return Marionette.AppRouter.extend({
        controller: new appController(),
        appRoutes: {
            '(:param)': 'doHome',
            'b/:id': 'doQuestion',
            't/:id': 'doTheme'
        },
        initialize: function() {
        }
    });

});