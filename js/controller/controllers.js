(function(angular) {
   "use strict";

   var app = angular.module("alambic", ['nvd3ChartDirectives']);

   app.controller('Controller', function($scope) {

      var colors = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40", "#01FF70",
               "#FFDC00", "#FF851B", "#FF4136", "#85144b", "#5B3822", "#F012BE", "#B10DC9",
               "#2B0F0E", "#111111", "#AAAAAA", "#3F5D7D", "#927054", "#279B61", "#008AB8",
               "#993333", "#CC3333", "#006495", "#004C70", "#0093D1", "#F2635F", "#F4D00C",
               "#E0A025", "#462066", "#FFB85F", "#FF7A5A", "#00AAA0", "#5D4C46", "#7B8D8E",
               "#632528", "#3F2518", "#333333", "#FFCC00", "#669966", "#993366", "#F14C38",
               "#144955", "#6633CC", "#EF34A2", "#FD9308", "#462D44", "#3399FF", "#99D21B",
               "#B08749", "#FFA3D6", "#00D9FF", "#000000", "#0000FF", "#FF0000", "#00FF00"];

      $scope.signalsData = [];
      $scope.signals = "";
      $scope.chartWrapperClass = '';

      $scope.process = function() {
         $scope.signalsData = [];
         var signalsArray = $scope.signals.split(";");
         signalsArray.forEach(function(signal) {
            var bs = new BooleanSignal(signal);
            $scope.signalsData.push([{
                     "key": "Signal " + bs.getId(),
                     "values": bs.getData(),
                     color: colors[_.random(0, colors.length - 1)]
            }]);
         });
         $scope.chartWrapperClass = 'chart--wrapper';
      };
   });

   // Defining a validation directive
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

}(angular, _));