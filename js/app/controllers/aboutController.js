(function(angular, _) {
   "use strict";
   
   var app = angular.module('alambic.controllers');

   app.controller('AboutController', function($scope) {
        $scope.message = "Hey come and see my angular app!";
   });
   
}(angular, _));