(function(angular, _) {
   "use strict";

   var app = angular.module('alambic.directives');

   /**
    * Create a directive the gives focus to the update editor being enabled
    */
   app.directive('gainFocus', function($timeout, $parse) {
      return {
         link: function(scope, element, attrs) {
            var model = $parse(attrs.gainFocus);
            scope.$watch(model, function(value) {
               if (value === true) {
                  $timeout(function() {
                     element[0].focus();
                     scope[model] = false;
                  });
               }
            });
         }
      };
   });

   /**
    * Create a directive that handle the 'escape' event when updating a signal
    * or a formula
    */
   app.directive('onEsc', function() {
      return function(scope, element, attrs) {
         element.bind("keypress keydown keyup", function(event) {
            var key = typeof event.which === "undefined" ? event.keyCode : event.which;
            if (key === 27) { // esc keycode is 27
               scope.$apply(function() {
                  scope.$eval(attrs.onEsc);
               });

               event.preventDefault();
            }
         });
      };
   });

   /**
    * Create a directive that handle the 'enter' event when updating a signal or
    * a formula
    */
   app.directive('onEnter', function() {
      return function(scope, element, attrs) {
         element.bind("keypress keydown keyup", function(event) {
            var key = typeof event.which === "undefined" ? event.keyCode : event.which;
            if (key === 13) { // enter keycode is 13
               scope.$apply(function() {
                  scope.$eval(attrs.onEnter);
               });

               event.preventDefault();
            }
         });
      };
   });

   app.directive('unwrap', function () {
      return {
          restrict: 'A',
          link: function (scope, el, attrs) {
              el.replaceWith(el.children());
          }
      };
  });
}(angular, _));
