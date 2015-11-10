(function(angular) {
   "use strict";

   var app = angular.module("alambic", ['nvd3ChartDirectives']);

   app.controller('Controller', function($scope) {

      $scope.signalData = [];

      $scope.n = 10;
      $scope.w = 1000;

      $scope.randomize = function() {
         $scope.signalData = [{
                  "key": "Signal 1",
                  "values": []
         }];

         var x = 0;
         var nextX = 1;
         var oldZ = _.random(0, 1);
         var z;

         $scope.signalData[0].values.push([x, oldZ]);
         $scope.signalData[0].values.push([nextX, oldZ]);

         _.times($scope.n - 2, function(i) {
            x = i + 1;
            nextX = i + 2;
            z = _.random(0, 1);
            if (z != oldZ) {
               $scope.signalData[0].values.push([x, z]);
            }
            $scope.signalData[0].values.push([nextX, z]);
            oldZ = z;
         });
      
         $scope.w = $scope.n * 100;
      };
   });

}(angular));