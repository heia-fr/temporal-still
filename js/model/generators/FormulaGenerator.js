/*******************************************************************************
 * Defining ForumlaGenerator
 ******************************************************************************/
var FormulaGenerator = function() {

   function Singleton() {

      var maxNbTerms = 5;
      var maxNbFactors = 5;
      var level = 3;

      var charSet = "abcdefghijklmnopqrstuvwxyz";

      function generateProp() {
         var i = _.random(0, charSet.length - 1); // TODO
         return charSet.charAt(i);
      }

      function generateAtom(formulaLevel, maxNbTerms, maxNbFactors) {
         var atom;
         var chance =  _.random(1, 100);

         if (chance <= 20) {
            if (formulaLevel > 0) {
               atom = Symbols.getOpeningBraket()
                        + generateFormula(formulaLevel - 1, maxNbTerms, maxNbFactors)
                        + Symbols.getClosingBraket();
            } else {
               chance = _.random(21, 100);
            }
         }

         if (chance <= 40) {
            atom = generateProp();
         } else if (chance <= 60) {
            atom = Symbols.getNot() + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         } else if (chance <= 80) {
            atom = Symbols.getAlways() + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         } else {
            atom = Symbols.getEventually() + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         }
         return atom;
      }

      function generateFactor(formulaLevel, maxNbTerms, maxNbFactors) {
         var factor = generateAtom(formulaLevel, maxNbTerms, maxNbFactors);

         if (_.random(0, 1) === 0) {
            factor += Symbols.getWeakUntil() + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         }
         return factor;
      }

      function generateTerm(formulaLevel, maxNbTerms, maxNbFactors) {
         var term = generateFactor(formulaLevel, maxNbTerms, maxNbFactors);

         if (_.random(0, 1) === 0) {
            var nbFactors = _.random(2, maxNbFactors);
            for (var i = 1; i < nbFactors; i++) {
               term += " " + Symbols.getAnd() + " "
                        + generateFactor(formulaLevel, maxNbTerms, maxNbFactors);
            }
         }
         return term;
      }

      function generateFormula(formulaLevel, maxNbTerms, maxNbFactors) {
         var formula = generateTerm(formulaLevel, maxNbTerms, maxNbFactors);

         if (_.random(0, 1) === 0) {
            var nbTerms = _.random(2, maxNbTerms);
            for (var i = 1; i < nbTerms; i++) {
               formula += " " + Symbols.getOr() + " "
                        + generateTerm(formulaLevel, maxNbTerms, maxNbFactors);
            }
         }
         return formula;
      }

      return {
         generateTemporalFormula: function() {
            return generateProp() + Symbols.getEqual()
                     + generateFormula(level, maxNbTerms, maxNbFactors);
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();