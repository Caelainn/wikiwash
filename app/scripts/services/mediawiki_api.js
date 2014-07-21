angular.module('wikiwash').factory('mediawikiApi', ['$http', function($http) {
  
  return {
    getPage: function (page, func) {

      var url = "api/pages/" + page;

      $http({
        method: 'GET', 
        url: url,
      }).
      success(function (data, status, headers, config) {
        console.log("SUCCESS", status, data);
        func(data);
      }).
      error(function (data, status, headers, config) {
        console.log("ERROR", status, data);
      });
    }

  };

}]);
