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
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          content: {
            template: '',
            controller: 'HomeCtrl'
          }
        }
      })
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
      .state('lost_password', {
        url: '/lost_password',
        views: {
          content: {
            templateUrl: 'views/lost-password.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('organization_list', {
        url: '/organization_list',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/organization-list.html',
            controller: 'OrganizationListCtrl'
          }
        }
      })
      .state('organization_create', {
        url: '/organizations?edit=1',
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
      .state('organizations', {
        url: '/organizations/:id',
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
      .state('user_export', {
        url: '/user_export',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/user-export.html',
            controller: 'UserListCtrl'
          }
        }
      })
      .state('user_list', {
        url: '/user_list',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/user-list.html',
            controller: 'UserListCtrl'
          }
        }
      })
      .state('user_create', {
        url: '/users',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/user-edit.html',
            controller: 'UsereditCtrl'
          }
        }
      })
      .state('user_edit', {
        url: '/users/:id',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl'
          },
          content: {
            templateUrl: 'views/user-edit.html',
            controller: 'UsereditCtrl'
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
      });
  })
  .config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }])
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
    notificationsConfigProvider.setAutoHideAnimationDelay(1200);
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
