angular.module('wikiwash').factory('api', ['$http', function($http) {

  function getRequestPromise(url) {
    return $http({
      method: 'GET', 
      url: url,
    }).
    success(function (data, status, headers, config) {
      console.log("SUCCESS", status, data);
      return data;
    }).
    error(function (data, status, headers, config) {
      return "ERROR: " + status;
    });
  }
  
  return {
    getRevisionDiff: function (revId, diffId) {
      var url = "/api/revisions/" + revId + "?diff=" + diffId;
      return getRequestPromise(url);
    },
    getRevision: function (revId) {
      var url = "/api/revisions/" + revId;
      return getRequestPromise(url);
    }
  };

}]);
