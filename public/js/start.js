define([
    'app/app',
    'app/appinit'
], function(mainApp, appInit) {
    appInit();
    mainApp.start();
});
