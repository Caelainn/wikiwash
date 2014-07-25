angular.module('wikiwash')
  .directive('wwScroll', ['SmoothScroll', function(SmoothScroll) {
    return {
      link: function(scope, element, attr) {
        var _scope = scope;

        scope.$watch('nextEdit', function () {
          console.log("ww-sroll");
        });
      }
    }
    
  }]);
