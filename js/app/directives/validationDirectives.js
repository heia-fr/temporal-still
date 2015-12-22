(function(angular, _) {
   "use strict";

   var app = angular.module('alambic.directives');

   app.directive('validateSignals', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = BooleanSignalSyntaxDiagram.isValid(value);

                     if (b && value.length != 0) {
                        var signalsArray = value.split(Symbols.getSemiColon());
                        if (signalsArray[signalsArray.length - 1] === Symbols.getEmpty()) {
                           signalsArray.splice(signalsArray.length - 1, 1);
                        }

                        signalsArray.forEach(function(signalStr) {
                           var signalParts = signalStr.split(Symbols.getEqual());
                           if (scope.signals.tf.formulasManager.containsFormula(signalParts[0].trim())) {
                              b = false;
                           }
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

   app.directive('validateFormulas', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = TemporalFormulaSyntaxDiagram.isValid(value);

                     var formulaArr;
                     if (b && value.length != 0) {
                        formulaArr = value.split(Symbols.getEqual());
                        var fId = formulaArr[0].trim();
                        if (scope.signals.bs.universe.containsSignal(fId)) {
                           b = false;
                        }
                     }

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

   app.directive('validateEditableFormula', function() {
      return {
               require: 'ngModel',
               link: function(scope, elem, attr, ngModel) {
                  ngModel.$parsers.unshift(function(value) {
                     var b = TemporalFormulaSyntaxDiagram.isValid(value) && value.length != 0;

                     var formulaArr;
                     if (b) {
                        formulaArr = value.split(Symbols.getEqual());
                        var fId = formulaArr[0].trim();
                        b = (fId === scope.editable.editableFormula.id);
                     }

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