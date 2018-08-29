'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:HeaderctrlCtrl
 * @description
 * # HeaderctrlCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('HeaderCtrl', function ($scope, $location, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.logout = function () {
      Auth.logout().then(function () {
        $location.path('/login');
      });
    };
  });
