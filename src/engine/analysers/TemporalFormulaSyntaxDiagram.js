import { Symbols } from 'src/engine/helpers';
import Lexer from './Lexer';

/** EBNF
   FormulaExpr ::= VarName '=' Formula
   Formula ::= Component ('-' '>' Component)*
   Component ::= Term ('|' Term)*
   Term ::= Factor ('&' Factor)*
   Factor ::= Atom ('W' Atom)?
   Atom ::= ('(' Formula ')')|('!' Atom)|('[' ']' Atom)|('<' '>' Atom)|(Prop)
   Prop ::= VarName
   VarName ::= Letter+
   Letter ::= 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'
*/
/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
var TemporalFormulaSyntaxDiagram = function() {

   function Singleton() {

      var lexer;

      function parseFormulaExpr() {
         if (!lexer.isVarName())
            throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected valid variable name");
         lexer.goToNextToken();

         if (!lexer.isEqualSign())
            throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected " + Symbols.getEqual());
         lexer.goToNextToken();

         parseFormula();

         if (!lexer.isEmptyToken())
            throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected end of formula");
      }

      function parseFormula() {
         parseComponent();

         while (lexer.isDash()) {
            lexer.goToNextToken();
            if(!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected " + Symbols.isGreaterThanSign());
            lexer.goToNextToken();
            parseComponent();
         }
      }

      function parseComponent() {
         parseTerm();

         while (lexer.isOr()) {
            lexer.goToNextToken();
            parseTerm();
         }
      }

      function parseTerm() {
         parseFactor();

         while (lexer.isAnd()) {
            lexer.goToNextToken();
            parseFactor();
         }
      }

      function parseFactor() {
         parseAtom();

         if (lexer.isWeaklyUntil()) {
            lexer.goToNextToken();
            parseAtom();
         }
      }

      function parseAtom() {
         if (lexer.isOpeningBracket()) {
            lexer.goToNextToken();
            parseFormula();
            if (!lexer.isClosingBracket())
               throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected "
                        + Symbols.getClosingBraket());
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            if (!lexer.isClosingSquareBracket())
               throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected "
                        + Symbols.getClosingSquareBraket());
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();
            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected "
                        + Symbols.getGreaterThan());
            lexer.goToNextToken();
            parseAtom();

         } else {
            parseProp();
         }
      }

      function parseProp() {
         if (!lexer.isVarName())
            throw new SyntaxError("TemporalFormulaSyntaxDiagram: Expected valid variable name");
         lexer.goToNextToken();
      }

      return {
         isValid: function(expression) {
            // permit empty string (that's to be validated in the view)
            if (expression === Symbols.getEmpty()) { return true; }

            try {
               lexer = new Lexer(expression);
               lexer.goToNextToken();
               parseFormulaExpr();
            } catch (ex) {
               return false;
            }
            return lexer.hasNoMoreChars();
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default TemporalFormulaSyntaxDiagram;
