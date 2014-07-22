angular.module('wikiwash').directive('rightheight', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.styleright = function () {
                return {
                    'height': (newValue.h - 60) + 'px'
                };
            };

        }, true);

        w.bind('rightheight', function () {
            scope.$apply();
        });
    }
})
