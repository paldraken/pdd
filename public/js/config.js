require.config({
    baseUrl: '/js/',
    paths: {
        "jquery": '../lib/jquery/jquery',
        "underscore": '../lib/underscore/underscore',
        "backbone": '../lib/backbone/backbone',
        "marionette": '../lib/marionette/backbone.marionette',
        "backbone.wreqr": '../lib/backbone.wreqr/backbone.wreqr',
        "backbone.babysitter": '../lib/backbone.babysitter/backbone.babysitter',
        "text": '../lib/requirejs-text/text',
        "modernizr": '../lib/modernizr/modernizr'
    },
    shim: {
        "jquery": {
            exports: '$'
        },
        "underscore": {
            exports: '_'
        },
        "backbone": {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        "backbone.babysitter": {
            deps: ['backbone']
        },
        "marionette": {
            deps: ['backbone', 'jquery', 'underscore'],
            exports: 'Marionette'
        }
    }
});

define([
    'app/app',
    'app/appinit'
], function(mainApp, appInit) {
    appInit();
    mainApp.start();
});

//require( [ "app/app", "app/appinit", "backbone", "marionette"], function () {
//    require(["app/app", "app/appinit"], function (mainApp, appInit) {
//        console.log(111);
//        appInit();
//        mainApp.start();
//    });
//});
