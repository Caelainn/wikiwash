angular.module('wikiwash')
  .directive('scrollPrev', ['SmoothScroll', function(SmoothScroll) {
    return {
      restrict: "E",
      scope: {
        editCount: "=editCount",
        nextEdit: "=nextEdit"
      },
      link: function(scope, element, attr) {
        var _scope = scope;
        var _element = element;

        element.on('click', function(event) {
          event.preventDefault();
          if (_scope.nextEdit <= 0) {
            _scope.nextEdit = _scope.editCount;
          } else {
            _scope.nextEdit--;
          }

        });
      },
      template: '<a href="" class="prev-next">Prev</a>'
    }
    
  }]);
