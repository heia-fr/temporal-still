(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining the main controller *********************
    */
   var app = angular.module('alambic.controllers');

   /**
    * This is the main controller where the core features of alambic are coded.
    * the following services are injected by angularJS to this controller: 1)
    * the $scope variable 2) the $window variable (represents the window object
    * of DOM) 3) signalsService a service that provides the data manipulated by
    * the app (save/restore data)
    */
   app.controller('MainController', [
            '$scope',
            '$window',
            'signalsService',
            function($scope, $window, signalsService) {

               // activate Twitter Bootstrap tooltips and enscroll plugin
               $(function() {
                  $('[data-tooltip="tooltip"]').tooltip({
                     'trigger': 'hover'
                  });
                  
                  $('#signalsList, #formulasList, .chart-grid').perfectScrollbar({
                     wheelSpeed: 0.4
                  }); 
               });

               $scope.$window = $window;
               $scope.signals = signalsService; // hook data to the scope
               // variable
               $scope.buttonState = {};
               // a toggle boolean used to change the icon of the signals
               // collapse button
               $scope.buttonState.signalsUp = true;
               // used to change the content of the signals toggle button's
               // tooltip dynamically
               $scope.buttonState.signalsTitle = 'Hide signals panel';
               // a toggle boolean used to change the icon of the formulas
               // collapse button
               $scope.buttonState.formulasUp = true;
               // used to change the content of the formulas toggle button's
               // tooltip dynamically
               $scope.buttonState.formulasTitle = 'Hide formulas panel';

               /**
                * methods to toggle the boolean variables
                */
               $scope.toggleSignalsPanel = function() {
                  $scope.buttonState.signalsUp = !$scope.buttonState.signalsUp;
                  $scope.buttonState.signalsTitle = $scope.buttonState.signalsUp
                           ? 'Hide signals panel' : 'Show signals panel';
               };
               $scope.toggleFormlasPanel = function() {
                  $scope.buttonState.formulasUp = !$scope.buttonState.formulasUp;
                  $scope.buttonState.formulasTitle = $scope.buttonState.formulasUp
                           ? 'Hide formulas panel' : 'Show formulas panel';
               };

               // update chart when launching the app
               updateSignalsCharts();
               updateFormulasCharts();

               /**
                * ****************** private methods *********************
                */

               // save the universe and formulas manager in the local storage
               function saveUniverse() {
                  $scope.signals.save($scope.signals.universeKey, angular
                           .toJson($scope.signals.bs.universe));
               }
               function saveFormulasManager() {
                  $scope.signals.save($scope.signals.formulasManagerKey, angular
                           .toJson($scope.signals.tf.formulasManager));
               }

               // update boolean charts
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

               // after updating a boolean signal, update temporal formulas
               // that reference it
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

               // method to enable the signals editor
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

               // method to disable the signals editor
               $scope.editable.editableSignal.disableEditor = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  s.setEditorEnabled(false);
                  $scope.editable.editableSignal.text = s.getContent();
                  event.stopPropagation();
               };

               // hook an event handle to the window object so when the user
               // clicks outside the editor text field, it will be hidden
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

               // method used to add provided boolean signals to the universe
               $scope.addSignals = function() {
                  // split the string into an array of string representations
                  // of boolean signals
                  var signalsArray = $scope.signalsString.trim().split(Symbols.getSemiColon());
                  // remove the trailing empty string at the end of the array
                  // if necessary
                  if (signalsArray[signalsArray.length - 1] === Symbols.getEmpty()) {
                     signalsArray.splice(signalsArray.length - 1, 1);
                  }

                  signalsArray.forEach(function(signalStr) {
                     var id = signalStr.split(Symbols.getEqual())[0].trim();
                     var bs = null;
                     // add the current signal to the universe
                     if ($scope.signals.bs.universe.containsSignal(id)) {
                        bs = $scope.signals.bs.universe.signalById(id);
                        if (bs.getContent() === signalStr) { return; }
                     }

                     var newS = new BooleanSignal(signalStr);
                     // if a boolean signal with the same ID exists, override it
                     // and update the referencing formulas
                     if (bs && bs.isReferred()) {
                        newS.setReferringTemporalFormulasIds(bs.getReferringTemporalFormulasIds());
                        $scope.signals.bs.universe.updateSignal(id, newS);
                        reevaluateReferringTemporalFormulas(newS);
                     } else {
                        $scope.signals.bs.universe.addSignal(newS);
                     }
                  });

                  $scope.signalsString = Symbols.getEmpty();
                  // update the graphical charts and save the universe's and
                  // formulas manager's states
                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();

                  // clean the text field
                  $scope.alambicSignalsForm.$setPristine();
                  $scope.alambicSignalsForm.$setUntouched();
               };

               // update the boolean signal corresponding to the provided ID
               $scope.updateSignal = function(id) {
                  var s = $scope.signals.bs.universe.signalById(id);
                  var str = $scope.editable.editableSignal.text.trim();
                  // skip the processing if it's not necessary
                  if (s.getContent().trim() === str) {
                     $scope.editable.editableSignal.disableEditor(id);
                     return;
                  }

                  // update the signal and reevaluate the referencing formulas
                  var newS = new BooleanSignal(str);
                  newS.setReferringTemporalFormulasIds(s.getReferringTemporalFormulasIds());
                  $scope.signals.bs.universe.updateSignal(id, newS);
                  reevaluateReferringTemporalFormulas(newS);

                  // update the graphical charts and save the universe's and
                  // formulas manager's states
                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();

                  // hide the editor
                  $scope.editable.editableSignal.disableEditor(id);
               };

               // remove the boolean signal corresponding to the provided ID
               $scope.removeSignal = function(id) {
                  $scope.signals.bs.universe.removeSignal(id);

                  // update the graphical charts and save the universe's and
                  // formulas manager's states
                  updateSignalsCharts();
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();
               };

               // generate random boolean signals
               $scope.generateSignals = function() {
                  $scope.signalsString = BooleanSignalGenerator
                           .generateBooleanSignals($scope.signals.tf.formulasManager);
               };

               // clear the universe
               $scope.clearSignals = function() {
                  $scope.signals.bs.universe.clear();
                  saveUniverse();
               };

               /**
                * ******************** Formulas management ********************
                */
               $scope.formulaString = "";
               $scope.editable.editableFormula = {};

               // method to enable the formulas editor
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

               // method to disable the formulas editor
               $scope.editable.editableFormula.disableEditor = function(id) {
                  var f = $scope.signals.tf.formulasManager.formulaById(id);
                  f.setEditorEnabled(false);
                  $scope.editable.editableFormula.text = f.getContent();
                  event.stopPropagation();
               };

               // add the entered formula to the formulas manager
               $scope.addFormula = function() {
                  var fId = $scope.formulaString.split(Symbols.getEqual())[0].trim();
                  var tf;
                  // it a formula with the same ID exists, override it
                  if ($scope.signals.tf.formulasManager.containsFormula(fId)) {
                     tf = $scope.signals.tf.formulasManager.formulaById(fId);
                     removeReferringFormula(tf);
                  }

                  // evaluate the formula
                  tf = TemporalFormulaInterpreter.evaluate($scope.formulaString,
                           $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.addFormula(tf);

                     // update the graphical charts and save the universe's and
                     // formulas manager's states
                     updateFormulasCharts();
                     saveUniverse();
                     saveFormulasManager();
                     $scope.formulaString = "";

                     // clean the text field
                     $scope.alambicFormulaForm.$setPristine();
                     $scope.alambicFormulaForm.$setUntouched();
                  }
               };

               // update the formula corresponding to the provided ID
               $scope.updateFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);
                  var str = $scope.editable.editableFormula.text.trim();

                  // skip if updating is not necessary
                  if (tf.getContent().trim() === str) {
                     $scope.editable.editableFormula.disableEditor(id);
                     return;
                  }

                  removeReferringFormula(tf);

                  // evaluate the formula
                  tf = TemporalFormulaInterpreter.evaluate(str, $scope.signals.bs.universe);
                  if (tf instanceof TemporalFormula) {
                     $scope.signals.tf.formulasManager.updateFormula(id, tf);

                     // update the graphical charts and save the universe's and
                     // formulas manager's states
                     updateFormulasCharts();
                     saveUniverse();
                     saveFormulasManager();
                     $scope.editable.editableFormula.disableEditor(id);
                  }
               };

               // remove the formula corresponding to provided ID
               $scope.removeFormula = function(id) {
                  var tf = $scope.signals.tf.formulasManager.formulaById(id);

                  removeReferringFormula(tf);

                  $scope.signals.tf.formulasManager.removeFormula(id);

                  // update the graphical charts and save the universe's and
                  // formulas manager's states
                  updateFormulasCharts();
                  saveUniverse();
                  saveFormulasManager();
               };

               // generate a random temporal formulas
               $scope.generateFormula = function() {
                  $scope.formulaString = FormulaGenerator
                           .generateTemporalFormula($scope.signals.bs.universe);
               };

               // clear the formulas manager
               $scope.clearFormulas = function() {
                  $scope.signals.bs.universe.clearReferences();

                  $scope.signals.tf.formulasManager.clear();

                  saveFormulasManager();
                  saveUniverse();
               };
            }]);
}(angular, _));