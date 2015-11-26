(function(angular, _) {
   "use strict";

   /**
    * ****************** Defining services *********************
    */

   var app = angular.module('alambic.services');

   app.factory("signalsService", function() {
      var signals = {};
      signals.bs = {};

      signals.bs.universe = null;

      return signals;
   });
}(angular, _));