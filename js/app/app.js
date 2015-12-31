(function(angular) {
   "use strict";

   // register all of the modules under one named module
   var app = angular.module('alambic', ['alambic.controllers', 'alambic.services',
            'alambic.filters', 'alambic.directives', 'nvd3ChartDirectives', 'LocalStorageModule',
            'ngRoute']);

   // configure the app
   app.config(['localStorageServiceProvider', '$routeProvider',
            function(localStorageServiceProvider, $routeProvider) {
               // set the prefix under which the app variables will be saved in
               // the local storage
               localStorageServiceProvider.setPrefix('alambic');
               // set the type of the local storage to sessionStorage
               localStorageServiceProvider.setStorageType('sessionStorage');

               // routing for the first version TODO: to be removed later
               $routeProvider.when('/', {
                        templateUrl: 'home.html', // pages/home.html
                        controller: 'MainController'
               }).when('/howto', {
                        templateUrl: 'how-to.html', // pages/how-to.html
                        controller: 'HowToController'
               }).when('/about', {
                        templateUrl: 'about.html', // pages/about.html
                        controller: 'AboutController'
               }).otherwise({
                  redirectTo: '/'
               });
            }]);

   // create modules
   angular.module('alambic.controllers', []);
   angular.module('alambic.services', []);
   angular.module('alambic.filters', []);
   angular.module('alambic.directives', []);

   // make sure Array.forEach and Array.every exist
   Util.ensureEvery();
   Util.ensureForEach();
}(angular));