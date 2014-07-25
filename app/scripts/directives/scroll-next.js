angular.module('wikiwash')
  .directive('scrollNext', ['SmoothScroll', function(SmoothScroll) {
    return {
      restrict: "E",
      scope: {
        editCount: "=",
        nextEdit: "="
      },
      link: function(scope, element, attr) {
        var _scope = scope;
        var _element = element;

        element.on('click', function(event, t) {
          event.preventDefault();
          if (_scope.nextEdit >= _scope.editCount) {
            _scope.nextEdit = 0;
          } else {
            _scope.nextEdit++;
          }
          console.log("=========>", _scope.editCount);
          
        });
      },
      template: '<a href="" class="prev-next">Next</a>'
    }
    
  }]);
