(function(angular) {
   "use strict";

   var app = angular.module("alambic", ['nvd3ChartDirectives']);

   app.controller('Controller', function($scope) {

      var colors = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40", "#01FF70",
               "#FFDC00", "#FF851B", "#FF4136", "#85144b", "#F012BE", "#B10DC9", "#111111",
               "#AAAAAA", "#3F5D7D", "#279B61", "#008AB8", "#993333", "#CC3333"];

      $scope.signalsData = [];
      $scope.signals = "";
      $scope.w = 1000;

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