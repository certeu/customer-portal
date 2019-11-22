'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:SamplessubmitCtrl
 * @description
 * # SamplessubmitCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('SamplesSubmitCtrl', function ($scope, $location, GridData, notifications) {
    $scope.files = [];
    $scope.submitEnvs = [];
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
      GridData('analysis/static').save({files: $scope.files});
      GridData('analysis/av').save({files: $scope.files}, function(resp){
        notifications.showSuccess(resp);
        $scope.files = [];
        $scope.$broadcast('clear-files');
        $location.path('/samples');
        //$log.debug('start scan... redirect to results page');
      }, function(error){
        notifications.showError(error.data);
      });

      var feAnalysisAvailable = $scope.sampleActions.dynamic_analysis.fireeye;
      var feEnvs = [];
      for (var k in feAnalysisAvailable){
        if(feAnalysisAvailable[k]){
          feEnvs.push(k);
        }
      }
      var dynAnalysis = {
        files: $scope.files,
        dyn_analysis: {
          fireeye: feEnvs
        }
      };

      GridData('analysis/fireeye').save(dynAnalysis,
        function(resp) {
          for(var i in resp.statuses) {
            var st = resp.statuses[i];
            if(st.hasOwnProperty('error')) {
              notifications.showError(st.error);
            } else if (st.hasOwnProperty('sha256')) {
              notifications.showSuccess(st.sha256 + ' has been submitted for dynamic analysis');
            }
          }
        },
        function(err) {
          notifications.showError(err.data);
        }
      );
    };

    $scope.$on('files-uploaded', function(event, files){
      $scope.files = $scope.files.concat(files);
      $scope.canSave = true;
    });

    $scope.$on('upload-error', function(event, error){
      $scope.msg = error;
    });

    $scope.engines = GridData('analysis/av').get({id: 'engines'});

    GridData('analysis/fireeye/environments').get(function(resp){
      $scope.feenvs = resp.environments;
    }, function(err){
      notifications.showError(err.data);
    });
  });
