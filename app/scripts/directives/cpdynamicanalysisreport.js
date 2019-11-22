'use strict';

/**
 * @ngdoc directive
 * @name cpApp.directive:cpDynamicAnalysisReport
 * @description
 * # cpDynamicAnalysisReport
 */
angular.module('cpApp')
  .directive('cpDynamicAnalysisReport', function ($q, $filter, $sce, FireEye, notifications) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/cp-dynamic-analysis-report.html',
      link: function(scope, elem, attrs){
        FireEye.get({sha256: attrs.hash, sid: attrs.sid}).$promise.then(function(resp) {
          var summaries = [];

          var promises = [];

          var statuses = resp.statuses;
          for (var statusIdx in statuses) {
            var status = statuses[statusIdx];

            var env = status.env;
            var reportId = status.report_id;
            var submissionStatus = status.submission_status;

            if (submissionStatus === 'DONE') {
              promises.push(FireEye.report({sha256: attrs.hash, rid: reportId}).$promise);
            } else {
              var summary = {
                'env': env,
                'submission_status': submissionStatus
              };

              summaries.push(summary);
            }
          }

          $q.all(promises).then(function(resources) {
            for (var resourceIdx in resources) {
              var resource = resources[resourceIdx];
              var results = resource.results;
              for (var resultIdx in results) {
                var result = results[resultIdx];

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
