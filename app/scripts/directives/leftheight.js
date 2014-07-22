angular.module('wikiwash').directive('leftheight', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.styleleft = function () {
                return {
                    'height': (newValue.h - 140) + 'px'
                };
            };

        }, true);

        w.bind('leftheight', function () {
            scope.$apply();
        });
    }
})
