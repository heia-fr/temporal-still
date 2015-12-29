(function(angular) {
   "use strict";

   var app = angular.module('alambic', ['alambic.controllers', 'alambic.services',
            'alambic.filters', 'alambic.directives', 'nvd3ChartDirectives', 'LocalStorageModule',
            'ngRoute']);

   app.config(['localStorageServiceProvider', '$routeProvider',
            function(localStorageServiceProvider, $routeProvider) {
               localStorageServiceProvider.setPrefix('alambic');
               localStorageServiceProvider.setStorageType('sessionStorage');

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

   angular.module('alambic.controllers', []);
   angular.module('alambic.services', []);
   angular.module('alambic.filters', []);
   angular.module('alambic.directives', []);

   // make sure the Array.some, Array.forEach and Array.every exists
   Util.ensureSome();
   Util.ensureEvery();
   Util.ensureForEach();
}(angular));