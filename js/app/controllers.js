(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining the main controller *********************
    */
   
   var app = angular.module('alambic.controllers');
   
   app.controller('Controller', function($scope, signalsService) {

      $scope.signals = signalsService;

      $scope.signalsString = "";
      $scope.formulaString = "";
      $scope.editableSignal = "";

      /**
       * ************* Signals management operations ********************
       */
      $scope.addSignals = function() {
         var signalsArray = $scope.signalsString.split(";");
         var bs;
         signalsArray.forEach(function(signalStr) {
            signalsService.bs.universe.addSignal(bs = new BooleanSignal(signalStr));
            bs.calculateChartValues();
         });
         console.log(signalsService.bs.universe.getSignals());
         $scope.signalsString = "";
      };

      $scope.enableEditor = function(index) {
         signalsService.bs.universe.getSignals().forEach(function(s) {
            s.setEditorEnabled(false);
         });
         var s = signalsService.bs.universe.signalAt(index);
         s.setEditorEnabled(true);
         $scope.editableSignal = s.getContent();
      };

      $scope.disableEditor = function(index) {
         var s = signalsService.bs.universe.signalAt(index);
         s.setEditorEnabled(false);
      };

      $scope.updateSignal = function(index) {
         var s = signalsService.bs.universe.signalAt(index);
         if (s.getContent().trim() === $scope.editableSignal.trim()) {
            $scope.disableEditor(index);
            return;
         }

         var bs;
         signalsService.bs.universe.updateSignal(index, bs = new BooleanSignal(s.getContent()));
         bs.calculateChartValues();
         $scope.disableEditor(index);
      };

      $scope.deleteSignal = function(index) {
         signalsService.bs.universe.removeSignal(index);
      };

      /**
       * ******************** Formulas management ************************
       */
      $scope.addFormula = function() {
         // TODO
      }
   });
}(angular, _));