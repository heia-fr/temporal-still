(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining services *********************
    */

   var app = angular.module('alambic.services');

   app.factory("signalsService", function() {
      var signals = {};
      signals.bs = {};
      signals.tf = {};

      signals.bs.universe = null;
      signals.tf.formulasManager = null;

      return signals;
   });
}(angular, _));