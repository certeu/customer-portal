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
    $scope.query = undefined;

    $scope.pageChanged = function() {
      $scope.loadPage($scope.currentPage);
    };

    $scope.filterPage = function() {
      var query = $scope.search.trim();
      if (query.length >= 3) {
        $scope.query = query;
      } else {
        $scope.query = undefined;
      }
      $scope.loadPage();
    };

    $scope.loadPage = function(no){
      if(no === undefined){
        no = 1;
      }
      var params = {
        page: no
      };
      if($scope.query !== undefined){
        params.query = $scope.query;
      }
      GridData('files').query(params, function(resp){
        $scope.files = resp.items;
        $scope.totalItems = resp.count;
        $scope.currentPage = resp.page;
      }, function(err){
        notifications.showError(err);
      });
    };

    $scope.loadPage();
  });
