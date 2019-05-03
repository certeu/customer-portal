'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:DeliverablesctrlCtrl
 * @description
 * # DeliverablesctrlCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('DeliverablesCtrl', function ($scope, GridData, config, notifications) {
    $scope.webServiceUrl = config.apiConfig.webServiceUrl;
    $scope.pageChanged = function() {
      $scope.loadPage($scope.currentPage);
    };
    $scope.loadPage = function(no) {
      if(no === undefined) {
        no = 1;
      }
      GridData('files').query({page: no}, function(resp) {
        $scope.files = resp.items;
        $scope.totalItems = resp.count;
        $scope.currentPage = resp.page;
      }, function(err) {
        notifications.showError(err);
      });
    };
    $scope.loadPage();
  });
