'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('WelcomeCtrl', function ($scope) {
    $scope.welcomePage = 'welcome-static.html';
  });
