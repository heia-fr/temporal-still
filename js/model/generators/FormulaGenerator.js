/*******************************************************************************
 * Defining ForumlaGenerator
 ******************************************************************************/
var FormulaGenerator = function() {

   function Singleton() {

      var universe;

      var formulaLevel;
      var maxNbTerms = 5;
      var maxNbFactors = 5;
      var maxPercent = 100;
      var pathOnePercent = 20;
      var pathTwoPercent = 40;
      var pathThreePercent = 60;
      var pathFourPercent = 80;

      var charSet = "abcdefghijklmnopqrstuvwxyz";

      function generateProp(ids) {
         var i;
         var id;
         do {
            i = _.random(0, charSet.length - 1);
            id = charSet.charAt(i);
         } while (universe.containsSignal(id));
         return id;
      }

      function generateAtom() {
         var atom;
         var chance = _.random(1, maxPercent);

         if (chance <= pathOnePercent) {
            if (formulaLevel > 0) {
               --formulaLevel;
               atom = Symbols.getOpeningBraket() + generateFormula() + Symbols.getClosingBraket();
            } else {
               chance = _.random(21, 100);
            }
         }

         if (chance <= pathTwoPercent) {
            var ids = universe.getSignalsIds();
            atom = ids[_.random(0, ids.length - 1)];
         } else if (chance <= pathThreePercent) {
            atom = Symbols.getNot() + generateAtom();
         } else if (chance <= pathFourPercent) {
            atom = Symbols.getAlways() + generateAtom();
         } else {
            atom = Symbols.getEventually() + generateAtom();
         }
         return atom;
      }

      function generateFactor() {
         var factor = generateAtom();

         if (_.random(0, 1) === 0) {
            factor += Symbols.getWeakUntil() + generateAtom();
         }
         return factor;
      }

      function generateTerm() {
         var term = generateFactor();

         if (_.random(0, 1) === 0) {
            var nbFactors = _.random(2, maxNbFactors);
            for (var i = 1; i < nbFactors; i++) {
               term += " " + Symbols.getAnd() + " " + generateFactor();
            }
         }
         return term;
      }

      function generateFormula() {
         var formula = generateTerm();

         if (_.random(0, 1) === 0) {
            var nbTerms = _.random(2, maxNbTerms);
            for (var i = 1; i < nbTerms; i++) {
               formula += " " + Symbols.getOr() + " " + generateTerm();
            }
         }
         return formula;
      }

      return {
         generateTemporalFormula: function(univ) {
            if (!(univ instanceof Universe))
               throw new TypeError("FormulaGenerator: Expecting 'univ' to be a 'Universe' object");

            universe = univ;
            formulaLevel = 3;

            return generateProp() + Symbols.getEqual() + generateFormula();
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();