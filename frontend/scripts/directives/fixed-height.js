angular.module('wikiwash')
  .directive(
    'fixedHeight',
    function($window) {
      return {
        scope: {
          offset: "@"
        },
        link: function (scope, element) {
          var resizeHandler = function() {
            element.height($window.innerHeight - scope.offset - 25);
          };

          angular.element($window).bind('resize', resizeHandler);

          resizeHandler();
        }
      };
    }
  );