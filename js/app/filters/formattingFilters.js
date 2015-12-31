(function(angular, _) {
   "use strict";

   /**
    * ******** Defining formatter filters for signals and formulas ********
    */

   var app = angular.module('alambic.filters');

   /**
    * Define a filter to prettify the signals
    */
   app.filter('signalFormatter', function($sce) {

      return function(signal) {

         var transformedSignal = Symbols.getEmpty();

         if (signal === Symbols.getEmpty()) {
            return signal;
         } else {
            var parts = signal.split(Symbols.getEqual());
            var bodyParts = parts[1].split(Symbols.getSlash());
            transformedSignal = parts[0] + " " + Symbols.getEqual() + " " + bodyParts[0]
                     + "<span style='text-decoration: overline;'>" + bodyParts[1] + "</span>";

            return $sce.trustAsHtml(transformedSignal);
         }
      }
   });

   /**
    * Define a filter to prettify the formulas
    */
   app.filter('formulaFormatter', function($sce) {

      return function(formula) {

         var transformedFormula = Symbols.getEmpty();

         if (formula === Symbols.getEmpty()) {
            return formula;
         } else {
            var lexer = new TemporalFormulaLexer(formula);

            while (!lexer.hasNoMoreChars()) {
               if (lexer.isAnd()) {
                  transformedFormula += " " + Symbols.getPrettyAnd() + " ";
               } else if (lexer.isOr()) {
                  transformedFormula += " " + Symbols.getPrettyOr() + " ";
               } else if(lexer.isDash()) {
                  lexer.goToNextToken();
                  transformedFormula += " " + Symbols.getPrettyImplies() + " ";
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