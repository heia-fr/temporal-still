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
                        templateUrl: 'pages/home.html',
                        controller: 'MainController'
               }).when('/howto', {
                        templateUrl: 'pages/how-to.html',
                        controller: 'HowToController'
               }).when('/about', {
                        templateUrl: 'pages/about.html',
                        controller: 'AboutController'
               }).otherwise({
                  redirectTo: '/'
               });
            }]);

   angular.module('alambic.controllers', []);
   angular.module('alambic.services', []);
   angular.module('alambic.filters', []);
   angular.module('alambic.directives', []);
}(angular));