(function(angular, _) {
   "use strict";

   var app = angular.module('alambic.controllers');

   app.controller('HowToController', function($scope, $sce) {
      $scope.symbols = {};
      $scope.symbols.prettyAnd = $sce.trustAsHtml(Symbols.getPrettyAnd());
      $scope.symbols.prettyOr = $sce.trustAsHtml(Symbols.getPrettyOr());
      $scope.symbols.prettyNot = $sce.trustAsHtml(Symbols.getPrettyNot());
      $scope.symbols.prettyEventually = $sce.trustAsHtml(Symbols.getPrettyEventually());
      $scope.symbols.prettyAlways = $sce.trustAsHtml(Symbols.getPrettyAlways());
      $scope.symbols.equal = Symbols.getEqual();
      $scope.symbols.slash = Symbols.getSlash();
      $scope.symbols.semiColon = Symbols.getSemiColon();
   });

}(angular, _));