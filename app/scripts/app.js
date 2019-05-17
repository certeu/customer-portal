'use strict';

/**
 * @ngdoc overview
 * @name cpApp
 * @description
 * # cpApp
 *
 * Main module of the application.
 */
angular
  .module('cpApp', ['ngAnimate', 'ngCookies', 'ngMessages', 'ngResource', 'ngSanitize',
    'ngTouch', 'ngCsv', 'ngFileUpload', 'ui.bootstrap', 'ui.select', 'uiSwitch', 'ui.router',
    'ngNotificationsBar', 'angular-loading-bar', 'services.config'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          content: {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('two-factor', {
        url: '/two-factor',
        views:{
          content:{
            templateUrl: 'views/two-factor.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('organizations', {
        url: '/organizations',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/organization-edit.html',
            controller: 'OrganizationeditCtrl'
          }
        }
      })
      .state('welcome', {
        url: '/welcome',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/welcome.html',
            controller: 'WelcomeCtrl'
          }
        }
      })
      .state('vulnerabilities', {
        url: '/vulnerabilities',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/vulnerabilities.html',
            controller: 'VulnerabilitiesCtrl'
          }
        }
      })
      .state('typosquats', {
        url: '/typosquats',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/typosquats.html',
            controller: 'TyposquatsCtrl'
          }
        }
      })
      .state('account', {
        url: '/account',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            template: '<cp-my-account></cp-my-account>'
          }
        }
      })
      .state('deliverables', {
        url: '/deliverables',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/deliverables.html',
            controller: 'DeliverablesCtrl'
          }
        }
      })
      .state('samples', {
        url: '/samples',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/samples.html',
            controller: 'SamplesCtrl'
          }
        }
      })
      .state('sample-submit', {
        url: '/samples/submit',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/sample-submit.html',
            controller: 'SamplesSubmitCtrl'
          }
        }
      })
      .state('url-submit', {
        url: '/samples/submit-url',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/url-submit.html',
            controller: 'URLsSubmitCtrl'
          }
        }
      })
      .state('nessus-scan', {
        url: '/scans/nessus',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/nessus.html',
            controller: 'NessusCtrl'
          }
        }
      })
      .state('viewReport', {
        url: '/report/:sha256',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/report.html',
            controller: function($scope, $stateParams){
              $scope.sha256 = $stateParams.sha256;
            }
          }
        }
      })
      .state('viewAllReports', {
        url: '/multiav/all/:sha256',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/multiav-all-reports.html',
            controller: 'MultiAVAllReportsController'
          }
        }
      })
      .state('investigation', {
        url: '/investigation/:room',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/investigation.html',
            controller: 'InvestigationCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/organizations');
  })
  .config(['notificationsConfigProvider', function(notificationsConfigProvider) {
    // auto hide
    notificationsConfigProvider.setAutoHide(true);

    // delay before hide
    notificationsConfigProvider.setHideDelay(3000);

    // support HTML
    notificationsConfigProvider.setAcceptHTML(false);

    // Set an animation for hiding the notification
    notificationsConfigProvider.setAutoHideAnimation('fadeOutNotifications');

    // delay between animation and removing the nofitication
    //notificationsConfigProvider.setAutoHideAnimationDelay(1000);
  }])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    //cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 250; //ms
  }])
  .config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.defaults.withCredentials = true;
  }])
  .run(function($rootScope){
    $rootScope.alerts = [];
    $rootScope.closeAlert = function(index){
      $rootScope.alerts.splice(index, 1);
    };
  });
