(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining formatter filters for signals and formulas
    * *********************
    */

   var app = angular.module('alambic.filters');

   app.filter('signalFormatter', function($sce) {

      return function(signal) {

         var transformedSignal = "";

         if (signal === '') {
            return signal;
         } else {
            var parts = signal.split("=");
            var bodyParts = parts[1].split("/");
            transformedSignal = parts[0] + " = " + bodyParts[0]
                     + "<span style='text-decoration: overline;'>" + bodyParts[1] + "</span>";

            return $sce.trustAsHtml(transformedSignal);
         }
      }
   });

   app.filter('formulaFormatter', function($sce) {

      return function(formula) {

         var transformedFormula = "";

         if (formula === '') {
            return formula;
         } else {
            var lexer = new TemporalFormulaLexer(formula);

            while (!lexer.hasNoMoreChars()) {
               if (lexer.isAnd()) {
                  transformedFormula += " " + Symbols.getPrettyAnd() + " ";
               } else if (lexer.isOr()) {
                  transformedFormula += " " + Symbols.getPrettyOr() + " ";
               } else if (lexer.isNot()) {
                  transformedFormula += Symbols.getPrettyNot();
               } else if (lexer.isOpeningSquareBracket()) {
                  lexer.goToNextToken();
                  transformedFormula += Symbols.getPrettyAlways();
               } else if (lexer.isLessThanSign()) {
                  lexer.goToNextToken();
                  transformedFormula += Symbols.getPrettyEventually();
               } else if (lexer.isWeaklyUntil() || lexer.isEqualSign()) {
                  transformedFormula += " " + lexer.getCurrentToken() + " ";
               } else {
                  transformedFormula += lexer.getCurrentToken();
               }
               lexer.goToNextToken();
            }
            transformedFormula += lexer.getCurrentToken();

            return $sce.trustAsHtml(transformedFormula);
         }
      }
   });
}(angular, _));