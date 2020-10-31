import _ from 'lodash';
import Universe from '../../models/business/Universe';
import Symbols from '../../models/helpers/Symbols';
import TemporalFormulaLexer from '../analysers/TemporalFormulaLexer';

/**
 * Defining ForumlaGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the universe to produce a formula that
 * refers to existing signals The maximum levels of recursion are fixed: 1)
 * maximum nested formulas: 3 2) maximum number of terms: 5 3) maximum number of
 * factors: 5
 */
var FormulaGenerator = function() {

   function Singleton() {

      var universe;

      var formulaLevel;
      var maxNbComponents = 2;
      var maxNbTerms = 1;
      var maxNbFactors = 1;
      var maxPercent = 100;
      var pathOnePercent = 20;
      var pathTwoPercent = 40;
      var pathThreePercent = 60;
      var pathFourPercent = 80;

      function generateProp() {
         var i;
         var id = "";
         do {
            i = _.random(0, Symbols.getCharSet().length - 1);
            id = Symbols.getCharSet().charAt(i);
         } while (universe.containsSignal(id));
         return id;
      }

      function generateAtom() {
         var atom;
         var chance = _.random(1, maxPercent);

         if (chance <= pathOnePercent) {
            if (formulaLevel > 0) {
               --formulaLevel;
               return Symbols.getOpeningBraket() + generateFormula() + Symbols.getClosingBraket();
            } else {
               chance = _.random(pathOnePercent + 1, maxPercent);
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

         if (_.random(0, 1) === 1) {
            factor += Symbols.getWeakUntil() + generateAtom();
         }
         return factor;
      }

      function generateTerm() {
         var term = generateFactor();

         if (_.random(0, 1) === 0) {
            for (var i = 1; i < maxNbFactors; i++) {
               term += " " + Symbols.getAnd() + " " + generateFactor();
            }
         }
         return term;
      }

      function generateComponent() {
         var component = generateTerm();

         if (_.random(0, 1) === 1) {
            for (var i = 1; i < maxNbTerms; i++) {
               component += " " + Symbols.getOr() + " " + generateTerm();
            }
         }
         return component;
      }

      function generateFormula() {
         var formula = generateComponent();

         var nbComponents = _.random(1, maxNbComponents);
         for (var i = 1; i < nbComponents; i++) {
            formula += " " + Symbols.getImplies() + " " + generateComponent();
         }
         return formula;
      }

      function purgeSuccessiveDuplicateOps(formulaStr) {
         var newFormulaStr = "";
         var c = "";
         var lexer = new TemporalFormulaLexer(formulaStr);
         lexer.goToNextToken();
         while (!lexer.hasNoMoreChars()) {
            if (lexer.isOpeningSquareBracket()) {
               lexer.goToNextToken();
               c = Symbols.getAlways();
            } else if (lexer.isLessThanSign()) {
               lexer.goToNextToken();
               c = Symbols.getEventually();
            } else if (lexer.isDash()) {
               lexer.goToNextToken();
               c = Symbols.getImplies();
            } else {
               c = lexer.getCurrentToken();
            }

            if (!_.endsWith(newFormulaStr, c) || !Symbols.isOperator(c)) {
               newFormulaStr += c;
            }

            lexer.goToNextToken();
         }
         c = lexer.getCurrentToken();
         if (!_.endsWith(newFormulaStr, c) || !Symbols.isOperator(c)) {
            newFormulaStr += c;
         }
         return newFormulaStr;
      }

      return {
         generateTemporalFormula: function(univ) {
            if (!(univ instanceof Universe))
               throw new TypeError("FormulaGenerator: Expecting 'univ' to be a 'Universe' object");

            universe = univ;
            formulaLevel = 2;

            var f = generateFormula();
            return generateProp() + Symbols.getEqual() + purgeSuccessiveDuplicateOps(f);
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default FormulaGenerator;
