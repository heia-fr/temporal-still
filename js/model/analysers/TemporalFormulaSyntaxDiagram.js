/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
var TemporalFormulaSyntaxDiagram = function() {

   function Singleton() {

      var lexer;
      
      function parseFormulaExpr() {
         if (!lexer.isVarName()) throw new SyntaxError("Expected valid variable name");
         lexer.goToNextToken();

         if (!lexer.isEqualSign()) throw new SyntaxError("Expected equal sign");
         lexer.goToNextToken();
         
         parseFormula();
      }

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
            if (!lexer.isClosingBracket())
               throw new SyntaxError("Expected ')'");
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            if (!lexer.isClosingSquareBracket())
               throw new SyntaxError("Expected ']'");
            lexer.goToNextToken();
            parseAtom();

         } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();
            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("Expected '>'");
            lexer.goToNextToken();
            parseAtom();

         } else {
            parseProp();
         }
      }

      function parseProp() {
         if (!lexer.isVarName())
            throw new SyntaxError("Expected valid variable name");
         lexer.goToNextToken();
      }

      return {
         isValid: function(expression) {
            if (expression === "") { // permit empty string (that's to be validated in the view)
               return true;
            }
            try {
               lexer = new TemporalFormulaLexer(expression);
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