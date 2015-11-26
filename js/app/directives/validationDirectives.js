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

   /**
    * Verifies the input signal and set the validity of the input element.
    * The input must verify the following criteria:
    * -> the input must be a single valid signal with no semicolons. e.g. a = 10101/11
    * -> the identifier of a signal must not conflict with an already existing signal
    */
   app.directive('validateEditableSignal', [
            'signalsService',
            function(signalsService) {
               return {
                        require: 'ngModel',
                        link: function(scope, elem, attr, ngModel) {
                           ngModel.$parsers
                                    .unshift(function(value) {
                                       var arr = value.split(";");
                                       var b = BooleanSignalSyntaxDiagram.isValid(value)
                                                && (arr.length == 1) && value.length != 0;
                                       if (b) {
                                          var i = value.indexOf("=");
                                          var sId = value.substring(0, i).trim();
                                          var c = (typeof signalsService.bs.universe
                                                   .signalById(sId) === 'undefined')
                                                   || (sId === scope.editableSignal.id);

                                          b = b && c;
                                       }
                                       ngModel.$setValidity('validateEditableSignal', b);
                                       return value;
                                    });
                        }
               };
            }]);

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