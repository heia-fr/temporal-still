(function(angular) {
   "use strict";

   var app = angular.module("alambic", ['nvd3ChartDirectives']);

   /**
    * ************** Defining services *******************
    */
   app.factory("signals", function() {
      var signals = {};
      signals.bs = {};
      signals.bs.data = [];
      signals.bs.signalsChartData = [];

      signals.tf = {};
      signals.tf.data = [];
      signals.tf.formulasChartData = [];

      signals.colors = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40",
               "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#85144b", "#5B3822", "#F012BE",
               "#B10DC9", "#2B0F0E", "#111111", "#AAAAAA", "#3F5D7D", "#927054", "#279B61",
               "#008AB8", "#993333", "#CC3333", "#006495", "#004C70", "#0093D1", "#F2635F",
               "#F4D00C", "#E0A025", "#462066", "#FFB85F", "#FF7A5A", "#00AAA0", "#5D4C46",
               "#7B8D8E", "#632528", "#3F2518", "#333333", "#FFCC00", "#669966", "#993366",
               "#F14C38", "#144955", "#6633CC", "#EF34A2", "#FD9308", "#462D44", "#3399FF",
               "#99D21B", "#B08749", "#FFA3D6", "#00D9FF", "#000000", "#0000FF", "#FF0000",
               "#00FF00"];

      return signals;
   });

   /**
    * ****************** Defining the controller *********************
    */
   app.controller('Controller', function($scope, signals) {

      $scope.signals = signals;
      var universe = new Universe();

      $scope.signalsString = "";
      $scope.formulaString = "";

      /**
       * ************* Signals management operations ********************
       */
      $scope.addSignals = function() {
         var signalsArray = $scope.signalsString.split(";");
         var bs;
         signalsArray.forEach(function(signalStr) {
            signals.bs.data.push({
                     id: $scope.signals.bs.data.length + 1,
                     content: signalStr
            });
            universe.addSignal(bs = new BooleanSignal(signalStr));
            bs.calculateChartValues();
            signals.bs.signalsChartData.push([{
                     "key": "Signal " + bs.getId(),
                     "values": bs.getChartData(),
                     "color": signals.colors[_.random(0, signals.colors.length - 1)]
            }]);
         });
         $scope.signalsString = "";
      }

      $scope.deleteSignal = function(index) {
         signals.bs.data.splice(index, 1);
         signals.bs.signalsChartData.splice(index, 1);
         universe.removeSignal(index);
      }

      /**
       * ******************** Formulas management ************************
       */
      $scope.addFormula = function() {
         signals.tf.data.push({
                  id: $scope.signals.tf.data.length + 1,
                  content: $scope.formulaString
         });
         // var bs = new BooleanSignal($scope.formulaString); TODO
         // bs.calculateChartValues();
         // signals.tf.formulasChartData.push([{
         // "key": "Formula " + bs.getId(),
         // "values": bs.getChartData(),
         // "color": signals.colors[_.random(0, signals.colors.length - 1)]
         // }]);
         $scope.formulaString = "";
      }
   });

   /**
    * ******************** Defining a validation directives ********************
    */
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
                     // var b = !TemporalFormulaSyntaxDiagram.isValid(value);
                     // TODO
                     ngModel.$setValidity('validateFormulas', true);
                     return value;
                  });
               }
      };
   });

   /**
    * ***************** Defining filters ***********************
    */
   app.filter('signalFormatter', function($sce) {

      return function(signal) {

         var transformedSignal = "";

         if (signal === '') {
            return signal;
         } else {
            var parts = signal.split("/");
            console.log(parts[0] + " " + parts[1]);
            transformedSignal = parts[0] + "<span style='text-decoration: overline;'>" + parts[1]
                     + "</span>";

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
                  transformedFormula += "&#9720;";
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