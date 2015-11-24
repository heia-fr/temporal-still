(function(angular, _) {
   "use strict";
   
   /**
    * ****************** Defining services *********************
    */
   
   var app = angular.module('alambic.services');
   
   app.factory("signalsService", function() {
      var signals = {};
      signals.bs = {};
      signals.bs.universe = new Universe();

      signals.tf = {};

      return signals;
   });
}(angular, _));