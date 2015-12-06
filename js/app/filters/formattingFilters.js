(function(angular, _) {
   "use strict";
   
   /**
    * ****************** Defining formatter filters for signals and formulas *********************
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
                  transformedFormula += " &#8226; "; // &#8743;
               } else if (lexer.isOr()) {
                  transformedFormula += " + "; // &#8744;
               } else if (lexer.isNot()) {
                  transformedFormula += "&#172;";
               } else if (lexer.isOpeningSquareBracket()) {
                  lexer.goToNextToken();
                  transformedFormula += "&#9723;";
               } else if (lexer.isLessThanSign()) {
                  lexer.goToNextToken();
                  transformedFormula += "&#9674;";
               } else if (lexer.isOpeningBracket()) {
                  transformedFormula += lexer.getCurrentToken();
               } else {
                  transformedFormula += " " + lexer.getCurrentToken() + " ";
               }
               lexer.goToNextToken();
            }
            transformedFormula += " " + lexer.getCurrentToken() + " ";

            return $sce.trustAsHtml(transformedFormula);
         }
      }
   });
}(angular, _));