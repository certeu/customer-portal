'use strict';

/**
 * @ngdoc service
 * @name cpApp.FireEye
 * @description
 * # FireEye
 * Factory in the cpApp.
 */
angular.module('cpApp')
  .factory('FireEye', function ($resource, config) {
    var urlPrefix = config.apiConfig.webServiceUrl;
    return $resource(urlPrefix + '/analysis/fireeye/:sha256/:sid', {}, {
      query: {
        method: 'GET',
        isArray: false,
        params: {sha256: '@sha256', sid: '@sid'}
      },
      envs: {
        url: urlPrefix + '/analysis/fireeye/environments',
        method: 'GET',
        cache: true
      },
      report: {
        url: urlPrefix + '/analysis/fireeye/report/:sha256/:rid',
        method: 'GET',
        params: {sha256: '@sha256', rid: '@rid'},
        cache: true
      }
    });
  });
