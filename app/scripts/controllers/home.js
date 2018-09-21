'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('HomeCtrl', function (Auth, $state) {

    if ( Auth.isLoggedIn() ) {
      $state.go('organization_list');
    }
    else {
      $state.go('login');
    }
  });
