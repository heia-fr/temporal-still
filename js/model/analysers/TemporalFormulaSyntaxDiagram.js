/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
var TemporalFormulaSyntaxDiagram = function() {

   function Singleton() {

      var lexer;

      function parseFormula() {
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
            if (lexer.isClosingBracket())
               throw new SyntaxError("Expected ')'");
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            if (lexer.isClosingSquareBracket())
               throw new SyntaxError("Expected ']'");
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isOpeningLessThanSign()) {
            lexer.goToNextToken();
            if (lexer.isClosingGreaterThanSign())
               throw new SyntaxError("Expected '>'");
            lexer.goToNextToken();
            parseAtom();

         } else {
            parseProp();
         }
      }

      function parseProp() {
         if (lexer.isVarName())
            throw new SyntaxError("Expected valid variable name");
         lexer.goToNextToken();
      }

      return {
         isValid: function(expression) {
            if (expression === "") return false;
            try {
               lexer = new TemporalFormulaLexer(expression);
               lexer.goToNextToken();
               parseFormula();
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