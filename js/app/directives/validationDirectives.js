(function(angular, _) {
   "use strict";

   var app = angular.module('alambic.directives');

   /**
    * A directive to validate the entered signals before processing them in the
    * controller
    */
   app.directive('validateSignals', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     // verify that the signals match the exact syntax
                     var b = BooleanSignalSyntaxDiagram.isValid(value);

                     // if the signals are correct, verify that the ids does'nt
                     // conflict
                     // with the formulas IDs
                     if (b && value.length != 0) {
                        var signalsArray = value.split(Symbols.getSemiColon());
                        if (signalsArray[signalsArray.length - 1] === Symbols.getEmpty()) {
                           signalsArray.splice(signalsArray.length - 1, 1);
                        }

                        b = signalsArray.every(function(signalStr) {
                           var signalParts = signalStr.split(Symbols.getEqual());
                           return !scope.signals.tf.formulasManager.containsFormula(signalParts[0]
                                    .trim());
                        });
                     }

                     ngModel.$setValidity('validateSignals', b);
                     return value;
                  });
               }
      };
   });

   /**
    * Verifies the input signal and set the validity of the input element. The
    * input must verify the following criteria: -> the input must be a single
    * valid signal with no semicolons. e.g. a = 10101/11 -> the identifier of a
    * signal must not conflict with an other signal's identifier
    */
   app.directive('validateEditableSignal', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var arr = value.split(Symbols.getSemiColon());
                     var b = BooleanSignalSyntaxDiagram.isValid(value) && (arr.length == 1)
                              && value.length != 0;

                     // the ID must not be changed
                     if (b) {
                        var sId = value.split(Symbols.getEqual())[0].trim();
                        b = (sId === scope.editable.editableSignal.id);
                     }

                     ngModel.$setValidity('validateEditableSignal', b);
                     return value;
                  });
               }
      };
   });

   /**
    * A directive to validate the formula entered before processing it in the
    * controller
    */
   app.directive('validateFormulas', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = TemporalFormulaSyntaxDiagram.isValid(value);

                     var formulaArr;
                     // if the the formula is correct, verify that its ID
                     // does'nt conflict
                     // with the signals IDs
                     if (b && value.length != 0) {
                        formulaArr = value.split(Symbols.getEqual());
                        var fId = formulaArr[0].trim();
                        if (scope.signals.bs.universe.containsSignal(fId)) {
                           b = false;
                        }
                     }

                     // Verify that all of the referenced signals exist in the
                     // universe
                     if (b && value.length != 0) {
                        var fBody = formulaArr[1].trim();
                        var lexer = new TemporalFormulaLexer(fBody);
                        while (!lexer.hasNoMoreChars() && b) {
                           if (lexer.isVarName()) {
                              if (!scope.signals.bs.universe
                                       .containsSignal(lexer.getCurrentToken())) {
                                 b = false;
                              }
                           }
                           lexer.goToNextToken();
                        }
                        if (lexer.isVarName()) {
                           if (!scope.signals.bs.universe.containsSignal(lexer.getCurrentToken())) {
                              b = false;
                           }
                        }
                     }
                     ngModel.$setValidity('validateFormulas', b);
                     return value;
                  });
               }
      };
   });

   /**
    * A directive to validate the formula being updated
    */
   app.directive('validateEditableFormula', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = TemporalFormulaSyntaxDiagram.isValid(value) && value.length != 0;

                     var formulaArr;
                     // the ID must not be changed
                     if (b) {
                        formulaArr = value.split(Symbols.getEqual());
                        var fId = formulaArr[0].trim();
                        b = (fId === scope.editable.editableFormula.id);
                     }

                     // Verify that all of the referenced signals exist in the
                     // universe
                     if (b) {
                        var formulaBody = formulaArr[1].trim();
                        var lexer = new TemporalFormulaLexer(formulaBody);
                        while (b && !lexer.hasNoMoreChars()) {
                           if (lexer.isVarName()) {
                              if (!scope.signals.bs.universe
                                       .containsSignal(lexer.getCurrentToken())) {
                                 b = false;
                              }
                           }
                           lexer.goToNextToken();
                        }
                        if (b && lexer.isVarName()) {
                           if (!scope.signals.bs.universe.containsSignal(lexer.getCurrentToken())) {
                              b = false;
                           }
                        }
                     }

                     ngModel.$setValidity('validateEditableFormula', b);
                     return value;
                  });
               }
      };
   });

}(angular, _));