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

               // restore universe from local storage
               var universeFromJson;
               var universeAsJson = localStorageService.get('universe');
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

               // restore formulas from local storage
               var formulasManagerFromJson;
               var formulasManagerAsJson = localStorageService.get('formulasManager');
               if (formulasManagerAsJson) {
                  formulasManagerFromJson = JSON.parse(formulasManagerAsJson, function(key, value) {
                     if (typeof (value) === 'object' && value.__type === 'FormulasManager')
                        return new FormulasManager(value);

                     return value;
                  });
               } else {
                  formulasManagerFromJson = new FormulasManager();
               }
               signals.tf.formulasManager = formulasManagerFromJson;

               $scope.signals = signals; // hook data to the scope variable

               // save universe and formulas in the local storage
               $scope.saveUniverseState = function() {
                  localStorageService.set('universe', angular.toJson($scope.signals.bs.universe));
               }
               $scope.saveFormulasManagerState = function() {
                  localStorageService.set('formulasManager', angular
                           .toJson($scope.signals.tf.formulasManager));
               }

               // update charts
               $scope.updateSignalsCharts = function() {
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.calculateChartValues();
                  });
               };
               $scope.updateFormulasCharts = function() {
                  $scope.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                     f.calculateChartValues();
                  });
               };

               /**
                * ************* Signals management operations *************
                */
               $scope.signalsString = "";
               $scope.editable = {};
               $scope.editable.editableSignal = {};

               $scope.editable.editableSignal.enableEditor = function(id, event) {
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.setEditorEnabled(false);
                  });

                  var s = $scope.signals.bs.universe.signalById(id);
                  s.setEditorEnabled(true);
                  $scope.editable.editableSignal.text = s.getContent();
                  $scope.editable.editableSignal.id = id;
                  event.stopPropagation();
               };

               $scope.editable.editableSignal.disableEditor = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  s.setEditorEnabled(false);
                  $scope.editable.editableSignal.text = s.getContent();
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

                  $scope.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                     if (f.isEditorEnabled()) {
                        f.setEditorEnabled(false);
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
                  $scope.updateSignalsCharts();
                  $scope.saveUniverseState();
                  $scope.signalsString = "";
               };

               $scope.updateSignal = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  var str = $scope.editable.editableSignal.text.trim();
                  if (s.getContent().trim() === str) {
                     $scope.editable.editableSignal.disableEditor(id);
                     return;
                  }

                  $scope.signals.bs.universe.updateSignal(id, new BooleanSignal(str));
                  $scope.updateSignalsCharts();
                  $scope.saveUniverseState();
                  $scope.editable.editableSignal.disableEditor(id);
               };

               $scope.removeSignal = function(id) {
                  $scope.signals.bs.universe.removeSignal(id);
                  $scope.updateSignalsCharts();
                  $scope.saveUniverseState();
               };

               /**
                * ******************** Formulas management ********************
                */
               $scope.formulaString = "";
               $scope.editable.editableFormula = {};

               $scope.editable.editableFormula.enableEditor = function(id, event) {
                  $scope.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                     f.setEditorEnabled(false);
                  });

                  var f = $scope.signals.tf.formulasManager.formulaById(id);
                  f.setEditorEnabled(true);
                  $scope.editable.editableFormula.text = f.getContent();
                  $scope.editable.editableFormula.id = id;
                  event.stopPropagation();
               };

               $scope.editable.editableFormula.disableEditor = function(id) {
                  var f = $scope.signals.tf.formulasManager.formulaById(id);
                  f.setEditorEnabled(false);
                  $scope.editable.editableFormula.text = f.getContent();
                  event.stopPropagation();
               };

               $scope.addFormula = function() {
                  var tf = TemporalFormulaInterpreter.evaluate($scope.formulaString,
                           $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.addFormula(tf);
                     $scope.updateFormulasCharts();
                     $scope.saveFormulasManagerState();
                  }
                  $scope.formulaString = "";
               };

               $scope.updateFormula = function(id) {
                  var f = $scope.signals.tf.formulasManager.formulaById(id);
                  var str = $scope.editable.editableFormula.text.trim();
                  if (f.getContent().trim() === str) {
                     $scope.editable.editableFormula.disableEditor(id);
                     return;
                  }

                  var tf = TemporalFormulaInterpreter.evaluate(str, $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.updateFormula(id, tf);
                     $scope.updateFormulasCharts();
                     $scope.saveFormulasManagerState();
                     $scope.editable.editableFormula.disableEditor(id);
                  }
               };

               $scope.removeFormula = function(id) {
                  $scope.signals.tf.formulasManager.removeFormula(id);
                  $scope.updateFormulasCharts();
                  $scope.saveFormulasManagerState();
               };
            }]);
}(angular, _));