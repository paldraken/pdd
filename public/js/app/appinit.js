define([
    'app/app',
    'app/appRouter'
], function(App, AppRouter) {

    return function() {

        console.log('init');

        App.addRegions({
            pddQuestions: "#pdd-questions",
            pddHeader: "#pdd-header"
        });

        App.addInitializer(function(options) {

            this.mainRouter = new AppRouter();
        });

        App.on("initialize:after", function(options){
            if (Backbone.history){
                Backbone.history.start();
            }
        });
    };

});