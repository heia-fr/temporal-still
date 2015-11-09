var app = angular.module("alambic", ['nvd3ChartDirectives']);

app.controller('Controller', function($scope) {

   $scope.exampleData = [];

   $scope.n = 10;

   $scope.randomize = function() {
      $scope.exampleData = [{
               "key": "Signal 1",
               "values": []
      }];

      var x = 0;
      var nextX = 1;
      var oldZ = _.random(0, 1);
      var z;

      $scope.exampleData[0].values.push([x, oldZ]);
      $scope.exampleData[0].values.push([nextX, oldZ]);

      _.times($scope.n - 2, function(i) {
         x = i + 1;
         nextX = i + 2;
         z = _.random(0, 1);
         if (z != oldZ) {
            $scope.exampleData[0].values.push([x, z]);
         }
         $scope.exampleData[0].values.push([nextX, z]);
         oldZ = z;
      });
   };
});