import _ from 'lodash';
import Universe from '../business/Universe';
import Symbols from '../helpers/Symbols';

/**
 * Defining ForumlaGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the universe to produce a formula that
 * refers to existing signals The maximum levels of recursion are fixed: 1)
 * maximum nested formulas: 3 2) maximum number of terms: 5 3) maximum number of
 * factors: 5
 */
var LTLFormulaGenerator = function() {

   function Singleton() {

      var universe;
      var nbProps = 5;

      function generateProp() {
         var i;
         var id = "";
         do {
            i = _.random(0, Symbols.getCharSet().length - 1);
            id = Symbols.getCharSet().charAt(i);
         } while (universe.containsSignal(id));
         return id;
      }

      function generateUnaryOperator() {
         var choice = _.random(1, 100);
         var unaryOp;
         if (choice <= 33) {
            unaryOp = Symbols.getNot();
         } else if (choice <= 66) {
            unaryOp = Symbols.getAlways();
         } else {
            unaryOp = Symbols.getEventually();
         }
         return unaryOp;
      }

      function generateUnaryOrBinaryOperator() {
         var choice = _.random(1, 100);
         var op;
         if (choice <= 14) {
            op = Symbols.getNot();
         } else if (choice <= 28) {
            op = Symbols.getAlways();
         } else if (choice <= 42) {
            op = Symbols.getEventually();
         } else if (choice <= 56) {
            op = Symbols.getWeakUntil();
         } else if (choice <= 70) {
            op = Symbols.getAnd();
         } else if (choice <= 84) {
            op = Symbols.getOr();
         } else {
            op = Symbols.getImplies();
         }
         return op;
      }

      function generateSignalId() {
         var ids = universe.getSignalsIds();
         return ids[_.random(0, ids.length - 1)];
      }

      function generateFormula(nbProps) {
         if (nbProps === 1) {
            var p = generateSignalId();
            return p;
         } else if (nbProps === 2) {
            var unaryOp = generateUnaryOperator();
            var f = generateFormula(1);
            return unaryOp + f;
         } else {
            var op = generateUnaryOrBinaryOperator();
            if (Symbols.isUnaryOp(op)) {
               var f = generateFormula(nbProps - 1);
               return op + f;
            } else {
               var n = _.random(1, nbProps - 2);
               var f1 = generateFormula(nbProps);
               var f2 = generateFormula(nbProps - n - 1);
               if (op === Symbols.getImplies()) { return Symbols.getOpeningBraket() + f1
                        + Symbols.getClosingBraket() + op + Symbols.getOpeningBraket() + f2
                        + Symbols.getClosingBraket(); }
               return f1 + op + f2;
            }
         }
      }

      return {
         generateTemporalFormula: function(univ) {
            if (!(univ instanceof Universe))
               throw new TypeError("FormulaGenerator: Expecting 'univ' to be a 'Universe' object");

            universe = univ;

            return generateProp() + Symbols.getEqual() + generateFormula(nbProps);
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default LTLFormulaGenerator;
