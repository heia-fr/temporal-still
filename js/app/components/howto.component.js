(function(angular, _) {
    "use strict";

    var app = angular.module('alambic.components');

    /**
     * Defines a component for the HowTo Tab. A set of symbols has been hooked
     * to the scope variable in order to be used in the HowTo tab page
     */
    app.component('howto', {
        templateUrl: 'js/app/components/howto.component.html',
        controllerAs: 'vm',
        controller: ['$sce', function HowToController($sce) {
            this.symbols = {};
            this.symbols.prettyAnd = $sce.trustAsHtml(Symbols.getPrettyAnd());
            this.symbols.prettyOr = $sce.trustAsHtml(Symbols.getPrettyOr());
            this.symbols.prettyImplies = $sce.trustAsHtml(Symbols.getPrettyImplies());
            this.symbols.prettyNot = $sce.trustAsHtml(Symbols.getPrettyNot());
            this.symbols.prettyEventually = $sce.trustAsHtml(Symbols.getPrettyEventually());
            this.symbols.prettyAlways = $sce.trustAsHtml(Symbols.getPrettyAlways());
            this.symbols.equal = Symbols.getEqual();
            this.symbols.slash = Symbols.getSlash();
            this.symbols.semiColon = Symbols.getSemiColon();
        }]
    });

}(angular, _));
