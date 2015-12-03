(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining the main controller *********************
    */
   var app = angular.module('alambic.controllers');

   app.controller('MainController', [
            '$scope',
            '$window',
            'localStorageService',
            'signalsService',
            function($scope, $window, localStorageService, signals) {

               $scope.$window = $window;

               var universeAsJson = localStorageService.get('universe');
               var universeFromJson;
               if (universeAsJson) {
                  universeFromJson = JSON.parse(universeAsJson, function(key, value) {
                     if (typeof (value) === 'object' && value.__type === 'Universe')
                        return new Universe(value);

                     return value;
                  });
               } else {
                  universeFromJson = new Universe();
               }

               signals.bs.universe = universeFromJson;

               $scope.signals = signals;

               $scope.saveState = function() {
                  localStorageService.set('universe', angular.toJson($scope.signals.bs.universe));
               }

               $scope.updateCharts = function() {
                  $scope.signals.tf.formulas.values().forEach(function(f) {
                     f.calculateChartValues();
                  });
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.calculateChartValues();
                  });
               };

               /**
                * ************* Signals management operations *************
                */
               $scope.signalsString = "";
               $scope.formulaString = "";
               $scope.editableSignal = {};

               $scope.enableEditor = function(id, event) {
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.setEditorEnabled(false);
                  });

                  var s = $scope.signals.bs.universe.signalById(id);
                  s.setEditorEnabled(true);
                  $scope.editableSignal.text = s.getContent();
                  $scope.editableSignal.id = id;
                  event.stopPropagation();
               };

               $scope.disableEditor = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  s.setEditorEnabled(false);
                  $scope.editableSignal.text = s.getContent();
                  event.stopPropagation();
               };

               // hook a event handle to the window object so when the user
               // clicks outside the update text field, it will be hidden
               $scope.$window.onclick = function(event) {
                  var editor = event.target;
                  if (!editor || editor.classList.contains("alambic--editorField")) return;

                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     if (s.isEditorEnabled()) {
                        s.setEditorEnabled(false);
                        $scope.$apply();
                        return;
                     }
                  });
               };

               $scope.addSignals = function() {
                  var signalsArray = $scope.signalsString.trim().split(Symbols.getSemiColon());
                  if (signalsArray[signalsArray.length - 1] === "") {
                     signalsArray.splice(signalsArray.length - 1, 1);
                  }

                  signalsArray.forEach(function(signalStr) {
                     $scope.signals.bs.universe.addSignal(new BooleanSignal(signalStr));
                  });
                  $scope.updateCharts();
                  $scope.saveState();
                  $scope.signalsString = "";
               };

               $scope.updateSignal = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  if (s.getContent().trim() === $scope.editableSignal.text.trim()) {
                     $scope.disableEditor(id);
                     return;
                  }

                  $scope.signals.bs.universe.updateSignal(id, new BooleanSignal(
                           $scope.editableSignal.text.trim()));
                  $scope.updateCharts();
                  $scope.saveState();
                  $scope.disableEditor(id);
               };

               $scope.deleteSignal = function(id) {
                  $scope.signals.bs.universe.removeSignal(id);
                  $scope.updateCharts();
                  $scope.saveState();
               };

               /**
                * ******************** Formulas management ********************
                */
               $scope.addFormula = function() {
                  var tf = TemporalFormulaInterpreter.evaluate($scope.formulaString,
                           $scope.signals.bs.universe);
                  $scope.signals.tf.formulas.put(tf.getId(), tf);
                  $scope.updateCharts();
               };
            }]);
}(angular, _));