angular.module('wikiwash').directive('fixedHeight', function ($window) {
  return {
    scope: {
      offset: "@"
    },
    link: function (scope, element) {
      element.height($window.innerHeight - scope.offset);
    }
  };
});
