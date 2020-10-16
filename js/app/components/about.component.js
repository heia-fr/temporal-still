(function(angular, _) {
    "use strict";

    var app = angular.module('alambic.components');

    /**
     * Defines a component for the About tab
     */
    app.component('about', {
        templateUrl: 'js/app/components/about.component.html',
        controllerAs: 'vm',
        controller: function AboutController() {
        }
    });

 }(angular, _));
