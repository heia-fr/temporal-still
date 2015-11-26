(function(angular) {
   "use strict";

   angular.module(
            'alambic',
            ['alambic.controllers', 'alambic.services', 'alambic.filters', 'alambic.directives',
                     'nvd3ChartDirectives', 'LocalStorageModule']).config(
            ['localStorageServiceProvider', function(localStorageServiceProvider) {
               localStorageServiceProvider.setPrefix('alambic');
            }])

   angular.module('alambic.controllers', []);
   angular.module('alambic.services', []);
   angular.module('alambic.filters', []);
   angular.module('alambic.directives', []);
}(angular));