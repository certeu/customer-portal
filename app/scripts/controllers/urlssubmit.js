'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:UrlsSubmitCtrl
 * @description
 * # UrlsSubmitCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('URLsSubmitCtrl', function ($scope, GridData, notifications) {
    $scope.urls = '';
    $scope.urls_ = [];
    $scope.sampleActions = {
      av_scan: true,
      static_analysis: true,
      dynamic_analysis: {
        fireeye: {
          'win10x64m': true
        }
      }
    };

    $scope.save = function(){
      var feAnalysisAvailable = $scope.sampleActions.dynamic_analysis.fireeye;
      var feEnvs = [];
      for (var k in feAnalysisAvailable){
        if(feAnalysisAvailable[k]){
          feEnvs.push(k);
        }
      }

      $scope.urls_ = $scope.urls.split('\n');

      var dynAnalysis = {
        urls: $scope.urls_,
        dyn_analysis: {
          fireeye: feEnvs
        }
      };

      GridData('analysis/fireeye-url').save(dynAnalysis, function(resp) {
        for(var i in resp.statuses){
          var st = resp.statuses[i];
          if(st.hasOwnProperty('error')){
            notifications.showError(st.error);
          }else if(st.hasOwnProperty('sha256')){
            notifications.showSuccess(
              $scope.urls_[i] + ' has been submitted for dynamic analysis');
          }
        }
      }, function(error){
        notifications.showError(error.data);
      });
    };

    GridData('analysis/fireeye/environments').get(
      function(resp) {
        $scope.feenvs = resp.environments;
      },
      function(err) {
        notifications.showError(err.data);
      }
    );
  });
