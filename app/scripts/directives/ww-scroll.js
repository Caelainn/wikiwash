angular.module('wikiwash')
  .directive('wwScroll', ['SmoothScroll', function(SmoothScroll) {
    return {
      link: function(scope, element, attr) {

        scope.$watch('nextEdit', function (current, last) {
          var edit = $('#edit-' + last);

          if (edit.length > 0) {
            element.animate({
              scrollTop: edit.offset().top - element.offset().top + element.scrollTop()
            });
          }
          
          console.log("ww-sroll");
        });
      }
    }
    
  }]);
