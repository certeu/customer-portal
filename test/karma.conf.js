// Karma configuration
// Generated on 2016-05-28

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/ng-notifications-bar/src/ngNotificationsBar.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/ng-csv/build/ng-csv.min.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/angular-ui-scroll/dist/ui-scroll.js',
      'bower_components/angular-ui-scrollpoint/dist/scrollpoint.js',
      'bower_components/angular-ui-event/dist/event.js',
      'bower_components/angular-ui-mask/dist/mask.js',
      'bower_components/angular-ui-validate/dist/validate.js',
      'bower_components/angular-ui-indeterminate/dist/indeterminate.js',
      'bower_components/angular-ui-uploader/dist/uploader.js',
      'bower_components/angular-ui-utils/index.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/jsSHA/src/sha1.js',
      'bower_components/strophe.js/dist/strophe.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
