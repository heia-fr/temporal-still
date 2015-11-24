(function(angular, _) {
   "use strict";

   var app = angular.module('alambic.directives');

   app.directive('validateSignals', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     ngModel.$setValidity('validateSignals', BooleanSignalSyntaxDiagram
                              .isValid(value));
                     return value;
                  });
               }
      };
   });

   app.directive('validateFormulas', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = TemporalFormulaSyntaxDiagram.isValid(value);
                     ngModel.$setValidity('validateFormulas', b);
                     return value;
                  });
               }
      };
   });

}(angular, _));