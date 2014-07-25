angular.module('wikiwash')
  .directive('wwScroll', ['SmoothScroll', function(SmoothScroll) {
    return {
      link: function(scope, element, attr) {

        scope.$watch('nextEdit', function (current, last) {
          var edit = $('#edit-' + last);

          if (edit.length > 0) {
            $('.ww-edit').css('text-decoration', 'none');
            edit.css('text-decoration', 'underline');
            setTimeout(function () {
              element.animate({
                scrollTop: edit.offset().top - element.offset().top + element.scrollTop()
              });
            }, 500);
          }
          
          console.log("ww-sroll");
        });
      }
    }
    
  }]);
