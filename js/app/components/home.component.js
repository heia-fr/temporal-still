import PerfectScrollbar from 'perfect-scrollbar';
import Symbols from '../../models/helpers/Symbols';
import TemporalFormulaInterpreter from '../../models/analysers/TemporalFormulaInterpreter';
import FormulaGenerator from '../../models/generators/FormulaGenerator';
import BooleanSignalGenerator from '../../models/generators/BooleanSignalGenerator';
import BooleanSignal from '../../models/entities/BooleanSignal';
import TemporalFormula from '../../models/entities/TemporalFormula';

(function(angular, _) {
    "use strict";

    var app = angular.module('alambic.components');

   /**
    * This is the main controller where the core features of alambic are coded.
    * the following services are injected by angularJS to this controller: 1)
    * the $scope variable 2) the $window variable (represents the window object
    * of DOM) 3) signalsService a service that provides the data manipulated by
    * the app (save/restore data)
    */
    app.component('home', {
        templateUrl: 'js/app/components/home.component.html',
        controllerAs: 'vm',
        controller: [
            '$scope',
            '$window',
            'signalsService',
            function HomeController($scope, $window, signalsService) {
                var vm = this;

                vm.signals = signalsService; // hook data to the scope

                vm.ps = {};
                function initPerfectScrollbar(selector) {
                    vm.ps[selector] = new PerfectScrollbar(selector, {
                        wheelSpeed: 0.4,
                        wheelPropagation: false,
                    });
                }

                // configure bootstrap JavaScript components in the context of
                // angularJS
                $(function() {
                    $('[data-tooltip="tooltip"]').tooltip({
                        'trigger': 'hover'
                    });

                    initPerfectScrollbar('#signalsList');
                    initPerfectScrollbar('#formulasList');
                    //initPerfectScrollbar('.chart-grid');
                });

                // variable
                vm.buttonState = {};
                // a toggle boolean used to change the icon of the signals
                // collapse button
                vm.buttonState.signalsUp = true;
                // used to change the content of the signals toggle button's
                // tooltip dynamically
                vm.buttonState.signalsTitle = 'Hide signals panel';
                // a toggle boolean used to change the icon of the formulas
                // collapse button
                vm.buttonState.formulasUp = true;
                // used to change the content of the formulas toggle button's
                // tooltip dynamically
                vm.buttonState.formulasTitle = 'Hide formulas panel';

                /**
                 * methods to toggle the boolean variables
                 */
                vm.toggleSignalsPanel = function() {
                    vm.buttonState.signalsUp = !vm.buttonState.signalsUp;
                    vm.buttonState.signalsTitle = vm.buttonState.signalsUp
                                ? 'Hide signals panel' : 'Show signals panel';
                };
                vm.toggleFormlasPanel = function() {
                    vm.buttonState.formulasUp = !vm.buttonState.formulasUp;
                    vm.buttonState.formulasTitle = vm.buttonState.formulasUp
                                ? 'Hide formulas panel' : 'Show formulas panel';
                };

                // update chart when launching the app
                updateSignalsCharts();
                updateFormulasCharts();

                /**
                 * ****************** private methods *********************
                 */

                // update the scroll bar associated with provided element's selector
                function updateScrollBar(selector) {
                    var perfectScrollbar = vm.ps[selector];
                    if (perfectScrollbar == null) return;
                    perfectScrollbar.update();
                }

                // save the universe and formulas manager in the local storage
                function saveUniverse() {
                    vm.signals.save(vm.signals.universeKey, angular
                                .toJson(vm.signals.bs.universe));
                }
                function saveFormulasManager() {
                    vm.signals.save(vm.signals.formulasManagerKey, angular
                                .toJson(vm.signals.tf.formulasManager));
                }

                // update boolean charts
                function updateSignalsCharts() {
                    vm.signals.bs.universe.getSignals().forEach(function(s) {
                        s.calculateChartValues(vm.signals.bs.universe.getLength());
                    });
                }
                function updateFormulasCharts() {
                    vm.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                        f.calculateChartValues(vm.signals.bs.universe.getLength());
                    });
                }

                // when removing a formula, release the referenced
                // boolean signals
                function removeReferringFormula(tf) {
                    tf.getReferredBooleanSignalsIds().forEach(function(id) {
                        var bs = vm.signals.bs.universe.signalById(id);
                        bs.removeReferringTemporalFormulaId(tf.getId());
                    });
                }

                // after updating a boolean signal, update temporal formulas
                // that reference it
                function reevaluateReferringTemporalFormulas(s) {
                    s.getReferringTemporalFormulasIds().forEach(
                                function(fId) {
                                    var tf = vm.signals.tf.formulasManager.formulaById(fId);
                                    tf = TemporalFormulaInterpreter.evaluate(tf.getContent(),
                                                vm.signals.bs.universe);
                                    if (tf instanceof TemporalFormula) {
                                        vm.signals.tf.formulasManager.updateFormula(fId, tf);
                                    }
                                });
                }

                /**
                 * ************* Signals management operations *************
                 */
                vm.signalsString = "";
                vm.editable = {};
                vm.editable.editableSignal = {};

                // method to enable the signals editor
                vm.editable.editableSignal.enableEditor = function(id, event, form) {
                    vm.signals.bs.universe.getSignals().forEach(function(s) {
                        s.setEditorEnabled(false);
                    });

                    var s = vm.signals.bs.universe.signalById(id);
                    s.setEditorEnabled(true);
                    vm.editable.editableSignal.text = s.getContent();
                    vm.editable.editableSignal.id = id;
                    form.$setPristine();
                    form.$setUntouched();
                    event.stopPropagation();
                };

                // method to disable the signals editor
                vm.editable.editableSignal.disableEditor = function(id) {
                    var s = vm.signals.bs.universe.signalById(id);
                    s.setEditorEnabled(false);
                    vm.editable.editableSignal.text = s.getContent();
                    event.stopPropagation();
                };

                // hook an event handle to the window object so when the user
                // clicks outside the editor text field, it will be hidden
                $window.onclick = function(event) {
                    var editor = event.target;
                    if (!editor || editor.classList.contains("alambic-editorField")) return;

                    vm.signals.bs.universe.getSignals().forEach(function(s) {
                        if (s.isEditorEnabled()) {
                            s.setEditorEnabled(false);
                            $scope.$apply();
                            return;
                        }
                    });

                    vm.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                        if (f.isEditorEnabled()) {
                            f.setEditorEnabled(false);
                            $scope.$apply();
                            return;
                        }
                    });
                };

                // method used to add provided boolean signals to the universe
                vm.addSignals = function(form) {
                    // split the string into an array of string representations
                    // of boolean signals
                    var signalsArray = vm.signalsString.trim().split(Symbols.getSemiColon());
                    // remove the trailing empty string at the end of the array
                    // if necessary
                    if (signalsArray[signalsArray.length - 1] === Symbols.getEmpty()) {
                        signalsArray.splice(signalsArray.length - 1, 1);
                    }

                    signalsArray.forEach(function(signalStr) {
                        var id = signalStr.split(Symbols.getEqual())[0].trim();
                        var bs = null;
                        // add the current signal to the universe
                        if (vm.signals.bs.universe.containsSignal(id)) {
                            bs = vm.signals.bs.universe.signalById(id);
                            if (bs.getContent() === signalStr) { return; }
                        }

                        var newS = new BooleanSignal(signalStr);
                        // if a boolean signal with the same ID exists, override it
                        // and update the referencing formulas
                        if (bs && bs.isReferred()) {
                            newS.setReferringTemporalFormulasIds(bs.getReferringTemporalFormulasIds());
                            vm.signals.bs.universe.updateSignal(id, newS);
                            reevaluateReferringTemporalFormulas(newS);
                        } else {
                            vm.signals.bs.universe.addSignal(newS);
                        }
                    });

                    vm.signalsString = Symbols.getEmpty();
                    // update the graphical charts and save the universe's and
                    // formulas manager's states
                    updateSignalsCharts();
                    updateFormulasCharts();
                    // update scroll bar
                    updateScrollBar('#signalsList');
                    updateScrollBar('.chart-grid');
                    saveUniverse();
                    saveFormulasManager();

                    // clean the text field
                    form.$setPristine();
                    form.$setUntouched();
                };

                // update the boolean signal corresponding to the provided ID
                vm.updateSignal = function(id) {
                    var s = vm.signals.bs.universe.signalById(id);
                    var str = vm.editable.editableSignal.text.trim();
                    // skip the processing if it's not necessary
                    if (s.getContent().trim() === str) {
                        vm.editable.editableSignal.disableEditor(id);
                        return;
                    }

                    // update the signal and reevaluate the referencing formulas
                    var newS = new BooleanSignal(str);
                    newS.setReferringTemporalFormulasIds(s.getReferringTemporalFormulasIds());
                    vm.signals.bs.universe.updateSignal(id, newS);
                    reevaluateReferringTemporalFormulas(newS);

                    // update the graphical charts and save the universe's and
                    // formulas manager's states
                    updateSignalsCharts();
                    updateFormulasCharts();
                    saveUniverse();
                    saveFormulasManager();

                    // hide the editor
                    vm.editable.editableSignal.disableEditor(id);
                };

                // remove the boolean signal corresponding to the provided ID
                vm.removeSignal = function(id) {
                    vm.signals.bs.universe.removeSignal(id);
                    // recalculate the universe's length by
                    // taking into account the formulas' associated
                    // boolean signals
                    vm.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                        vm.signals.bs.universe.calculateMaxLength(f.getAssociatedSignal());
                    });

                    // update the graphical charts and save the universe's and
                    // formulas manager's states
                    updateSignalsCharts();
                    updateFormulasCharts();
                    saveUniverse();
                    saveFormulasManager();

                    // update scroll bar
                    updateScrollBar('#signalsList');
                    updateScrollBar('.chart-grid');
                };

                // generate random boolean signals
                vm.generateSignals = function() {
                    vm.signalsString = BooleanSignalGenerator
                                .generateBooleanSignals(vm.signals.tf.formulasManager);
                };

                // clear the universe
                vm.clearSignals = function() {
                    vm.signals.bs.universe.clear();
                    // update scroll bar
                    updateScrollBar('#signalsList');
                    updateScrollBar('.chart-grid');
                    saveUniverse();
                };

                /**
                 * ******************** Formulas management ********************
                 */
                vm.formulaString = "";
                vm.editable.editableFormula = {};

                // method to enable the formulas editor
                vm.editable.editableFormula.enableEditor = function(id, event, form) {
                    vm.signals.tf.formulasManager.getFormulas().forEach(function(f) {
                        f.setEditorEnabled(false);
                    });

                    var f = vm.signals.tf.formulasManager.formulaById(id);
                    f.setEditorEnabled(true);
                    vm.editable.editableFormula.text = f.getContent();
                    vm.editable.editableFormula.id = id;
                    form.$setPristine();
                    form.$setUntouched();
                    event.stopPropagation();
                };

                // method to disable the formulas editor
                vm.editable.editableFormula.disableEditor = function(id) {
                    var f = vm.signals.tf.formulasManager.formulaById(id);
                    f.setEditorEnabled(false);
                    vm.editable.editableFormula.text = f.getContent();
                    event.stopPropagation();
                };

                // add the entered formula to the formulas manager
                vm.addFormula = function(form) {
                    var fId = vm.formulaString.split(Symbols.getEqual())[0].trim();
                    var tf;
                    // it a formula with the same ID exists, override it
                    if (vm.signals.tf.formulasManager.containsFormula(fId)) {
                        tf = vm.signals.tf.formulasManager.formulaById(fId);
                        removeReferringFormula(tf);
                    }

                    // evaluate the formula
                    tf = TemporalFormulaInterpreter.evaluate(vm.formulaString,
                                vm.signals.bs.universe);
                    if (tf instanceof TemporalFormula) {
                        vm.signals.tf.formulasManager.addFormula(tf);

                        // update the graphical charts and save the universe's and
                        // formulas manager's states
                        updateFormulasCharts();
                        // update scroll bar
                        updateScrollBar('#formulasList');
                        updateScrollBar('.chart-grid');
                        saveUniverse();
                        saveFormulasManager();
                        vm.formulaString = "";

                        // clean the text field
                        form.$setPristine();
                        form.$setUntouched();
                    }
                };

                // update the formula corresponding to the provided ID
                vm.updateFormula = function(id) {
                    var tf = vm.signals.tf.formulasManager.formulaById(id);
                    var str = vm.editable.editableFormula.text.trim();

                    // skip if updating is not necessary
                    if (tf.getContent().trim() === str) {
                        vm.editable.editableFormula.disableEditor(id);
                        return;
                    }

                    removeReferringFormula(tf);

                    // evaluate the formula
                    tf = TemporalFormulaInterpreter.evaluate(str, vm.signals.bs.universe);
                    if (tf instanceof TemporalFormula) {
                        vm.signals.tf.formulasManager.updateFormula(id, tf);

                        // update the graphical charts and save the universe's and
                        // formulas manager's states
                        updateFormulasCharts();
                        saveUniverse();
                        saveFormulasManager();
                        vm.editable.editableFormula.disableEditor(id);
                    }
                };

                // remove the formula corresponding to provided ID
                vm.removeFormula = function(id) {
                    var tf = vm.signals.tf.formulasManager.formulaById(id);

                    removeReferringFormula(tf);

                    vm.signals.tf.formulasManager.removeFormula(id);

                    // update the graphical charts and save the universe's and
                    // formulas manager's states
                    updateFormulasCharts();
                    // update scroll bar
                    updateScrollBar('#formulasList');
                    updateScrollBar('.chart-grid');
                    saveUniverse();
                    saveFormulasManager();
                };

                // generate a random temporal formulas
                vm.generateFormula = function() {
                    // LTLFormulaGenerator
                    vm.formulaString = FormulaGenerator
                                .generateTemporalFormula(vm.signals.bs.universe);
                };

                // clear the formulas manager
                vm.clearFormulas = function() {
                    vm.signals.bs.universe.clearReferences();

                    vm.signals.tf.formulasManager.clear();
                    // update scroll bar
                    updateScrollBar('#formulasList');
                    updateScrollBar('.chart-grid');
                    saveFormulasManager();
                    saveUniverse();
                };
            }]
    });

}(angular, _));
