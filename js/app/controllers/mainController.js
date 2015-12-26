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
               $scope.signals = signals; // hook data to a scope variable
               $scope.buttonState = {};
               $scope.buttonState.signalsUp = true;
               $scope.buttonState.formulasUp = true;

               $scope.toggleSignalsPanel = function() {
                  $scope.buttonState.signalsUp = !$scope.buttonState.signalsUp;
               };
               $scope.toggleFormlasPanel = function() {
                  $scope.buttonState.formulasUp = !$scope.buttonState.formulasUp;
               };

               updateSignalsCharts();
               updateFormulasCharts();

               /**
                * ****************** private methods *********************
                */
               function saveUniverse() {
                  $scope.signals.save($scope.signals.universeKey, angular
                           .toJson($scope.signals.bs.universe));
               }
               function saveFormulasManager() {
                  $scope.signals.save($scope.signals.formulasManagerKey, angular
                           .toJson($scope.signals.tf.formulasManager));
               }
               // update charts
               function updateSignalsCharts() {
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.calculateChartValues($scope.signals.bs.universe.getLength());
                  });
               }
               function updateFormulasCharts() {
                  $scope.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                     f.calculateChartValues($scope.signals.bs.universe.getLength());
                  });
               }

               // when removing a formula, release the referenced
               // boolean signals
               function removeReferringFormula(tf) {
                  tf.getReferredBooleanSignalsIds().forEach(function(id) {
                     var bs = $scope.signals.bs.universe.signalById(id);
                     bs.removeReferringTemporalFormulaId(tf.getId());
                  });
               }

               // after updating a boolean signal => update it's referencing
               // temporal formulas
               function reevaluateReferringTemporalFormulas(s) {
                  s.getReferringTemporalFormulasIds().forEach(
                           function(fId) {
                              var tf = $scope.signals.tf.formulasManager.formulaById(fId);
                              tf = TemporalFormulaInterpreter.evaluate(tf.getContent(),
                                       $scope.signals.bs.universe);
                              if (tf instanceof TemporalFormula) {
                                 $scope.signals.tf.formulasManager.updateFormula(fId, tf);
                              }
                           });
               }

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
                  $scope.alambicSignalsListForm.$setPristine();
                  $scope.alambicSignalsListForm.$setUntouched();
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
                  if (!editor || editor.classList.contains("alambic-editorField")) return;

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
                     var id = signalStr.split(Symbols.getEqual())[0].trim();
                     var bs = null;
                     if ($scope.signals.bs.universe.containsSignal(id)) {
                        bs = $scope.signals.bs.universe.signalById(id);
                        if (bs.getContent() === signalStr) { return; }
                     }

                     var newS = new BooleanSignal(signalStr);
                     if (bs && bs.isReferred()) {
                        newS.setReferringTemporalFormulasIds(bs.getReferringTemporalFormulasIds());
                        $scope.signals.bs.universe.updateSignal(id, newS);
                        reevaluateReferringTemporalFormulas(newS);
                     } else {
                        $scope.signals.bs.universe.addSignal(newS);
                     }
                  });

                  $scope.signalsString = "";
                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();

                  $scope.alambicSignalsForm.$setPristine();
                  $scope.alambicSignalsForm.$setUntouched();
               };

               $scope.updateSignal = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  var str = $scope.editable.editableSignal.text.trim();
                  if (s.getContent().trim() === str) {
                     $scope.editable.editableSignal.disableEditor(id);
                     return;
                  }

                  var newS = new BooleanSignal(str);
                  newS.setReferringTemporalFormulasIds(s.getReferringTemporalFormulasIds());
                  $scope.signals.bs.universe.updateSignal(id, newS);
                  reevaluateReferringTemporalFormulas(newS);

                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();
                  $scope.editable.editableSignal.disableEditor(id);
               };

               $scope.removeSignal = function(id) {
                  $scope.signals.bs.universe.removeSignal(id);

                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();
               };

               $scope.generateSignals = function() {
                  $scope.signalsString = BooleanSignalGenerator
                           .generateBooleanSignals($scope.signals.tf.formulasManager);
               };

               $scope.clearSignals = function() {
                  $scope.signals.bs.universe.clear();
                  saveUniverse();
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
                  $scope.alambicFormulaListForm.$setPristine();
                  $scope.alambicFormulaListForm.$setUntouched();
                  event.stopPropagation();
               };

               $scope.editable.editableFormula.disableEditor = function(id) {
                  var f = $scope.signals.tf.formulasManager.formulaById(id);
                  f.setEditorEnabled(false);
                  $scope.editable.editableFormula.text = f.getContent();
                  event.stopPropagation();
               };

               $scope.addFormula = function() {
                  var fId = $scope.formulaString.split(Symbols.getEqual())[0].trim();
                  var tf;
                  if ($scope.signals.tf.formulasManager.containsFormula(fId)) {
                     tf = $scope.signals.tf.formulasManager.formulaById(fId);
                     removeReferringFormula(tf);
                  }

                  tf = TemporalFormulaInterpreter.evaluate($scope.formulaString,
                           $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.addFormula(tf);

                     updateFormulasCharts();
                     // save the boolean signals state that has changed
                     // while evaluating the formula
                     saveUniverse();
                     saveFormulasManager();
                     $scope.formulaString = "";
                     $scope.alambicFormulaForm.$setPristine();
                     $scope.alambicFormulaForm.$setUntouched();
                  }
               };

               $scope.updateFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);
                  var str = $scope.editable.editableFormula.text.trim();
                  if (tf.getContent().trim() === str) {
                     $scope.editable.editableFormula.disableEditor(id);
                     return;
                  }

                  removeReferringFormula(tf);

                  tf = TemporalFormulaInterpreter.evaluate(str, $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.updateFormula(id, tf);

                     updateFormulasCharts();
                     // save the boolean signals state that has changed
                     // while evaluating the formula
                     saveUniverse();
                     saveFormulasManager();
                     $scope.editable.editableFormula.disableEditor(id);
                  }
               };

               $scope.removeFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);

                  removeReferringFormula(tf);

                  $scope.signals.tf.formulasManager.removeFormula(id);
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();
               };

               $scope.generateFormula = function() {
                  $scope.formulaString = FormulaGenerator
                           .generateTemporalFormula($scope.signals.bs.universe);
               };

               $scope.clearFormulas = function() {
                  $scope.signals.bs.universe.clearReferences();

                  $scope.signals.tf.formulasManager.clear();

                  saveFormulasManager();
                  saveUniverse();
               };
            }]);
}(angular, _));