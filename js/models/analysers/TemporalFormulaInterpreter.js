import _ from 'lodash';
import Universe from '../business/Universe';
import Symbols from '../helpers/Symbols';
import Operator from '../operators/Operator';
import TemporalFormulaLexer from '../analysers/TemporalFormulaLexer';
import TemporalFormula from '../entities/TemporalFormula';

import Always from '../operators/Always';
import And from '../operators/And';
import Eventually from '../operators/Eventually';
import Implies from '../operators/Implies';
import Not from '../operators/Not';
import Or from '../operators/Or';
import WeakUntil from '../operators/WeakUntil';

/**
 * This class defines an interpreter of formulas. It uses the recursive descent
 * to evaluate each part of the formula. The universe is used to fetch the
 * corresponding signals. The result of the evaluation is a BooleanSignal object
 * that will be wrapped in a TemporalFormula object.
 */
var TemporalFormulaInterpreter = function() {

   function Singleton() {

      var lexer;
      var universe;
      var fId;
      var ids = [];

      function parseFormulaExpr() {
         if (!lexer.isVarName()) throw new SyntaxError("TemporalFormulaInterpreter: Expected valid formula name");
         lexer.goToNextToken();
         if (!lexer.isEqualSign()) throw new SyntaxError("TemporalFormulaInterpreter: Expected equal sign");
         lexer.goToNextToken();

         var bs = parseFormula();
         return bs;
      }

      function parseFormula() {
         var bs = parseComponent();

         while (lexer.isDash()) {
            lexer.goToNextToken();
            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.isGreaterThanSign());
            lexer.goToNextToken();
            var thatBs = parseComponent();
            var op = new Implies(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseComponent() {
         var bs = parseTerm();

         while (lexer.isOr()) {
            lexer.goToNextToken();
            var thatBs = parseTerm();
            var op = new Or(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseTerm() {
         var bs = parseFactor();

         while (lexer.isAnd()) {
            lexer.goToNextToken();
            var thatBs = parseFactor();
            var op = new And(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseFactor() {
         var bs = parseAtom();
         if (lexer.isWeaklyUntil()) {
            lexer.goToNextToken();
            var thatBs = parseAtom();
            var op = new WeakUntil(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseAtom() {

         var bs = null;

         if (lexer.isOpeningBracket()) {
            lexer.goToNextToken();
            bs = parseFormula();
            if (!lexer.isClosingBracket())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getClosingBraket());
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            lexer.goToNextToken();
            bs = parseAtom();
            var op = new Not(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            if (!lexer.isClosingSquareBracket())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getClosingSquareBraket());
            lexer.goToNextToken();
            bs = parseAtom();
            var op = new Always(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();
            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getGreaterThan());
            lexer.goToNextToken();
            bs = parseAtom();
            var op = new Eventually(bs);
            bs = op.performUnaryOperator();

         } else {
            bs = parseProp();
         }
         return bs;
      }

      function parseProp() {
         if (!lexer.isVarName()) {
            console.log(lexer.getCurrentToken());
            throw new SyntaxError("TemporalFormulaInterpreter: Expected valid variable name");
         }
         var bs = universe.signalById(lexer.getCurrentToken());
         // if the boolean signal is not referenced by the temporal formula
         // that is being evaluated, then add it to the references array
         if (!_.includes(ids, bs.getId())) {
            ids.push(bs.getId());
         }
         // add a reference to the formula being evaluated to the current
         // boolean signal
         bs.addReferringTemporalFormulaId(fId);
         lexer.goToNextToken();
         return bs;
      }

      return {
         /**
          * Evaluates the formula represented by the provided string.
          *
          * @param expression
          *           is a string that represents the formula to evaluate
          * @param univ
          *           is the universe of BooleanSignal objects
          */
         evaluate: function(expression, univ) {
            if (typeof expression !== 'string')
               throw new TypeError(
                        "TemporalFormulaInterpreter: Expecting 'expression' to be a 'String' object");
            if (!(univ instanceof Universe))
               throw new TypeError(
                        "TemporalFormulaInterpreter: Expecting 'universe' to be a 'Universe' object");

            try {
               universe = univ;
               // set the universe length so all the operators can have access
               // to the same lengths
               Operator.prototype.setUniverseLength(universe.getLength());
               lexer = new TemporalFormulaLexer(expression);
               lexer.goToNextToken();
               fId = expression.split(Symbols.getEqual())[0].trim();
               var bs = parseFormulaExpr();
               var tf = new TemporalFormula(fId, expression, bs, ids);
               ids = [];
               return tf;
            } catch (ex) {
               console.error(ex);
               return null;
            }
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default TemporalFormulaInterpreter;
