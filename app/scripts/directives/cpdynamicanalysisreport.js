'use strict';

/**
 * @ngdoc directive
 * @name cpApp.directive:cpDynamicAnalysisReport
 * @description
 * # cpDynamicAnalysisReport
 */
angular.module('cpApp')
  .directive('cpDynamicAnalysisReport', function ($q, $filter, $sce, FireEye, notifications, config) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/cp-dynamic-analysis-report.html',
      link: function(scope, elem, attrs){
        FireEye.get({sha256: attrs.hash, sid: attrs.sid}).$promise.then(function(resp) {
          var summaries = [];

          var promises = [];

          var statuses = resp.statuses;
          for (var status_idx in statuses) {
            var status = statuses[status_idx];

            var env = status.env;
            var report_id = status.report_id;
            var submission_status = status.submission_status;

            if (submission_status === 'DONE') {
              promises.push(FireEye.report({sha256: attrs.hash, rid: report_id}).$promise);
            } else {
              var summary = {
                'env': env,
                'submission_status': submission_status
              };

              summaries.push(summary);
            }
          }

          $q.all(promises).then(function(resources) {
            for (var resource_idx in resources) {
              var resource = resources[resource_idx];
              var results = resource.results;
              for (var result_idx in results) {
                var result = results[result_idx];

                var env = result.env;
                var report = result.result;

                var summary = {
                  'env': env,
                  'report': report
                };

                summaries.push(summary);
              }
            }

            scope.summaries = summaries;
          });
        }, function(error) {
          notifications.showError(error.data);
        });
      }
    };
  });
