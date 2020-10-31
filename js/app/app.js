import Util from '../models/helpers/Util';

(function(angular) {
   "use strict";

   // register all of the modules under one named module
   var app = angular.module('alambic', ['alambic.components', 'alambic.services',
            'alambic.filters', 'alambic.directives', 'nvd3ChartDirectives', 'LocalStorageModule',
            'ngRoute']);

   // configure the app
   app.config(['localStorageServiceProvider', '$routeProvider', '$locationProvider',
            function(localStorageServiceProvider, $routeProvider, $locationProvider) {
               // set the prefix under which the app variables will be saved in
               // the local storage
               localStorageServiceProvider.setPrefix('alambic');
               // set the type of the local storage to sessionStorage
               localStorageServiceProvider.setStorageType('sessionStorage');

               // use the HTML5 History API
               // $locationProvider.html5Mode(true);
               // $locationProvider.hashPrefix();

               $routeProvider.otherwise({
                  redirectTo: '/'
               });
            }]);

   // create modules
   angular.module('alambic.components', []);
   angular.module('alambic.services', []);
   angular.module('alambic.filters', []);
   angular.module('alambic.directives', []);

   // make sure Array.forEach and Array.every exist
   Util.ensureEvery();
   Util.ensureForEach();
}(angular));
