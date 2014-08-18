angular.module('wikiwash').factory('pageParser', [function() {
  return {
    getPageName: function (url) {
      return url.replace("en.wikipedia.org/wiki/", "")
                .replace(/http(s|):\/\//, "")
                .replace(/ /g, "_");
    }
  };
}]);
