import { Symbols } from 'src/engine/helpers';
import Lexer from './Lexer';
import { TemporalFormula } from 'src/engine/entities';

import {
   Operator, Always, And, Eventually, Implies, Not, Or, WeakUntil
} from 'src/engine/operators';

/**
 * This class defines an interpreter of formulas. It uses the recursive descent
 * to evaluate each part of the formula. The universe is used to fetch the
 * corresponding signals. The result of the evaluation is a BooleanSignal object
 * that will be wrapped in a TemporalFormula object.
 */
var TemporalFormulaInterpreter = function() {

   function Singleton() {

      function parseFormulaExpr(lexer, state) {
         if (!lexer.isVarName()) throw new SyntaxError("TemporalFormulaInterpreter: Expected valid formula name");
         lexer.goToNextToken();

         if (!lexer.isEqualSign()) throw new SyntaxError("TemporalFormulaInterpreter: Expected equal sign");
         lexer.goToNextToken();

         return parseFormula(lexer, state);
      }

      function parseFormula(lexer, state) {
         var bs = parseComponent(lexer, state);

         while (lexer.isDash()) {
            lexer.goToNextToken();

            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.isGreaterThanSign());
            lexer.goToNextToken();

            var thatBs = parseComponent(lexer, state);
            var op = new Implies(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseComponent(lexer, state) {
         var bs = parseTerm(lexer, state);

         while (lexer.isOr()) {
            lexer.goToNextToken();

            var thatBs = parseTerm(lexer, state);
            var op = new Or(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseTerm(lexer, state) {
         var bs = parseFactor(lexer, state);

         while (lexer.isAnd()) {
            lexer.goToNextToken();

            var thatBs = parseFactor(lexer, state);
            var op = new And(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseFactor(lexer, state) {
         var bs = parseAtom(lexer, state);

         if (lexer.isWeaklyUntil()) {
            lexer.goToNextToken();

            var thatBs = parseAtom(lexer, state);
            var op = new WeakUntil(bs, thatBs);
            bs = op.performBinaryOperator();
         }

         return bs;
      }

      function parseAtom(lexer, state) {

         var bs = null;

         if (lexer.isOpeningBracket()) {
            lexer.goToNextToken();

            bs = parseFormula(lexer, state);

            if (!lexer.isClosingBracket())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getClosingBraket());
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            lexer.goToNextToken();

            bs = parseAtom(lexer, state);
            var op = new Not(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();

            if (!lexer.isClosingSquareBracket())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getClosingSquareBraket());
            lexer.goToNextToken();

            bs = parseAtom(lexer, state);
            var op = new Always(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();

            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaInterpreter: Expected " + Symbols.getGreaterThan());
            lexer.goToNextToken();

            bs = parseAtom(lexer, state);
            var op = new Eventually(bs);
            bs = op.performUnaryOperator();

         } else {
            bs = parseProp(lexer, state);
         }
         return bs;
      }

      function parseProp(lexer, state) {
         if (!lexer.isVarName()) {
            console.log(lexer.getCurrentToken());
            throw new SyntaxError("TemporalFormulaInterpreter: Expected valid variable name");
         }
         var bs = state.universe.getEntity(lexer.getCurrentToken());
         // if the boolean signal is not referenced by the temporal formula
         // that is being evaluated, then add it to the references array
         if (state.ids.indexOf(bs.getId()) < 0) {
            state.ids.push(bs.getId());
         }
         // add a reference to the formula being evaluated to the current
         // boolean signal
         bs.addReferencedBy(state.entityId);
         lexer.goToNextToken();
         if (bs instanceof TemporalFormula) {
            return bs.getAssociatedSignal();
         }
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
               throw new TypeError("TemporalEntityInterpreter: Expecting 'expression' to be a 'String' object");

            try {
               // set the universe length so all the operators can have access
               // to the same lengths
               Operator.prototype.setUniverseLength(univ.getLength());
               var lexer = new Lexer(expression);
               lexer.goToNextToken();
               var entityId = expression.split(Symbols.getEqual())[0].trim();
               var state = {
                  entityId: entityId,
                  ids: [],
                  universe: univ,
               };
               var bs = parseFormulaExpr(lexer, state);
               var tf = new TemporalFormula(entityId, expression, bs, state.ids);
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
