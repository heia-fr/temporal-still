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
               $scope.signals = signals; // hook data to the scope variable

               updateSignalsCharts();
               updateFormulasCharts();

               /**
                * ****************** private operations *********************
                */
               // save universe and formulas in the local storage
               function saveUniverseState() {
                  localStorageService.set('universe', angular.toJson($scope.signals.bs.universe));
               }
               function saveFormulasManagerState() {
                  localStorageService.set('formulasManager', angular
                           .toJson($scope.signals.tf.formulasManager));
               }

               // update charts
               function updateSignalsCharts() {
                  $scope.signals.bs.universe.getSignals().forEach(function(s) {
                     s.calculateChartValues();
                  });
               }
               function updateFormulasCharts() {
                  $scope.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                     f.calculateChartValues();
                  });
               }

               // when removing a formula, release the referenced
               // boolean signals
               function removeReferencingFormula(tf) {
                  tf.getReferencedBooleanSignalsIds().forEach(function(id) {
                     var bs = $scope.signals.bs.universe.signalById(id);
                     bs.removeReferencingTemporalFormulaId(tf.getId());
                  });
               }

               // after updating a boolean signal => update it's referencing
               // temporal formulas
               function reevaluateReferencingTemporalFormulas(s) {
                  s.getReferencingTemporalFormulasIds().forEach(
                           function(fId) {
                              var tf = $scope.signals.tf.formulasManager.formulaById(fId);
                              var tf = TemporalFormulaInterpreter.evaluate(tf.getContent(),
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

                  updateSignalsCharts();
                  saveUniverseState();
                  $scope.signalsString = "";
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
                  newS.setReferencingTemporalFormulasIds(s.getReferencingTemporalFormulasIds());
                  $scope.signals.bs.universe.updateSignal(id, newS);

                  reevaluateReferencingTemporalFormulas(newS);

                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverseState();
                  saveFormulasManagerState();
                  $scope.editable.editableSignal.disableEditor(id);
               };

               $scope.removeSignal = function(id) {
                  $scope.signals.bs.universe.removeSignal(id);
                  updateSignalsCharts();
                  saveUniverseState();
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
                  var tf = TemporalFormulaInterpreter.evaluate($scope.formulaString,
                           $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.addFormula(tf);

                     updateFormulasCharts();
                     saveFormulasManagerState();
                     saveUniverseState();
                  }
                  $scope.formulaString = "";
                  $scope.alambicFormulaForm.$setPristine();
                  $scope.alambicFormulaForm.$setUntouched();
               };

               $scope.updateFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);
                  var str = $scope.editable.editableFormula.text.trim();
                  if (tf.getContent().trim() === str) {
                     $scope.editable.editableFormula.disableEditor(id);
                     return;
                  }

                  removeReferencingFormula(tf);

                  tf = TemporalFormulaInterpreter.evaluate(str, $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.updateFormula(id, tf);

                     updateFormulasCharts();
                     saveFormulasManagerState();
                     saveUniverseState();
                     $scope.editable.editableFormula.disableEditor(id);
                  }
               };

               $scope.removeFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);

                  removeReferencingFormula(tf);

                  $scope.signals.tf.formulasManager.removeFormula(id);
                  updateFormulasCharts();
                  saveFormulasManagerState();
                  saveUniverseState();
               };
            }]);
}(angular, _));