(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining services *********************
    */
   var app = angular.module('alambic.services');

   /**
    * Define a service that provides data manipulated by the app
    */
   app.factory('signalsService', [
            'localStorageService',
            function(localStorageService) {
               var signals = {};
               signals.bs = {};
               signals.tf = {};

               signals.bs.universe = null;
               signals.tf.formulasManager = null;
               
               signals.universeKey = 'universe';
               signals.formulasManagerKey = 'formulasManager';

               // methods to save and restore data in/from the local storage
               signals.save = function(key, data) {
                  localStorageService.set(key, data);
               };
               signals.restore = function(key) {
                  return localStorageService.get(key);
               };

               // restore universe from local storage
               var universeFromJson;
               var universeAsJson = signals.restore(signals.universeKey);
               if (universeAsJson) {
                  universeFromJson = JSON.parse(universeAsJson, function(key, value) {
                     if (typeof (value) === 'object' && value.__type === 'Universe')
                        return new Universe(value);

                     return value;
                  });
               } else { // set the default signals
                  universeFromJson = new Universe();
                  universeFromJson.addSignal(new BooleanSignal("b = 111000100011/1"));
                  universeFromJson.addSignal(new BooleanSignal("a = 110000101000/0"));
               }
               signals.bs.universe = universeFromJson;

               // restore formulas from local storage
               var formulasManagerFromJson;
               var formulasManagerAsJson = signals.restore(signals.formulasManagerKey);
               if (formulasManagerAsJson) {
                  formulasManagerFromJson = JSON.parse(formulasManagerAsJson, function(key, value) {
                     if (typeof (value) === 'object' && value.__type === 'FormulasManager')
                        return new FormulasManager(value);

                     return value;
                  });
               } else { // set the default formulas
                  formulasManagerFromJson = new FormulasManager();
                  var tfs = ["f = b W !a", "g = !a W b", "h = <>(a & b)", "i = b & []!a"];

                  tfs.forEach(function(f) {
                     var tf = TemporalFormulaInterpreter.evaluate(f, signals.bs.universe);
                     if (tf instanceof TemporalFormula) {
                        formulasManagerFromJson.addFormula(tf);
                     }
                  });
               }
               signals.tf.formulasManager = formulasManagerFromJson;

               return signals;
            }]);
}(angular, _));