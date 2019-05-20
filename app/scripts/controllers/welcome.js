'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('WelcomeCtrl', function ($scope, $location, Auth) {
    if (Auth.isLoggedIn()) {
      $scope.welcomePage = 'welcome-static.html';
    } else {
      $location.path('/login');
    }
  });
