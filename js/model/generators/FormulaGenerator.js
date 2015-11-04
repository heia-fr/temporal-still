/*******************************************************************************
 * Defining ForumlaGenerator
 ******************************************************************************/
var FormulaGenerator = function() {

   function Singleton() {

      var maxNbTerms = 5; 
      var maxNbFactors = 5;
      var level = 3;
      
      var generator = new Random();
      var charSet = "abcdefghijklmnopqrstuwxyz"; // 'v' is omitted
      var operator = {
         openingBraket: "(",
         closingBraket: ")",
         eventually: "<>",
         always: "[]",
         not: "!",
         weakUntil: "W",
         and: ".",
         or: "+"
      };

      function generateProp() {
         var i = generator.integer(0, charSet.length - 1);
         return charSet.charAt(i);
      }

      function generateAtom(formulaLevel, maxNbTerms, maxNbFactors) {
         var atom;
         var chance = generator.integer(1, 100);

         if (chance <= 20) {
            if (formulaLevel > 0) {
               atom = operator.openingBraket
                           + generateFormula(formulaLevel - 1, maxNbTerms,
                                       maxNbFactors) + operator.closingBraket;
            } else {
               chance = generator.integer(21, 100);
            }
         }

         if (chance <= 40) {
            atom = generateProp();
         } else if (chance <= 60) {
            atom = operator.not
                        + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         } else if (chance <= 80) {
            atom = operator.always
                        + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         } else {
            atom = operator.eventually
                        + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         }
         return atom;
      }

      function generateFactor(formulaLevel, maxNbTerms, maxNbFactors) {
         var factor = generateAtom(formulaLevel, maxNbTerms, maxNbFactors);

         if (!generator.bool()) {
            factor += operator.weakUntil
                        + generateAtom(formulaLevel, maxNbTerms, maxNbFactors);
         }
         return factor;
      }

      function generateTerm(formulaLevel, maxNbTerms, maxNbFactors) {
         var term = generateFactor(formulaLevel, maxNbTerms, maxNbFactors);

         if (!generator.bool()) {
            var nbFactors = generator.integer(2, maxNbFactors);
            for (var i = 1; i < nbFactors; i++) {
               term += " " + operator.and + " "
               generateFactor(formulaLevel, maxNbTerms, maxNbFactors);
            }
         }
         return term;
      }

      function generateFormula(formulaLevel, maxNbTerms, maxNbFactors) {
         var formula = generateTerm(formulaLevel, maxNbTerms, maxNbFactors);

         if (!generator.bool()) {
            var nbTerms = generator.integer(2, maxNbTerms);
            for (var i = 1; i < nbTerms; i++) {
               formula += " " + operator.or + " "
               generateTerm(formulaLevel, maxNbTerms, maxNbFactors);
            }
         }
         return formula;
      }

      return {
         generateFormula: function() {
            return generateFormula(level, maxNbTerms, maxNbFactors);
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();