/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
var BooleanSignalSyntaxDiagram = function() {

   function Singleton() {

      var lexer;

      function parseSignal() {
         if (!lexer.isVarName())
            throw new SyntaxError("Expected valid variable name");
         lexer.goToNextToken();

         if (!lexer.isEqualSign())
            throw new SyntaxError("Expected equal sign");
         lexer.goToNextToken();

         parseSignalBody();
      }

      function parseSignalBody() {
         parseDigits();
         if (!lexer.isSlash()) throw new SyntaxError("Expected slash sign");
         lexer.goToNextToken();
         parseDigits();

         while (lexer.isSemiColon()) {
            lexer.goToNextToken();
            if (lexer.hasNoMoreChars()) return;
            parseSignal();
         }

         if (!lexer.hasNoMoreChars())
            throw new SyntaxError("Expected end of signal");
      }

      function parseDigits() {
         if (!(lexer.isZero() || lexer.isOne()))
            throw new SyntaxError("Expected 0 or 1");
         lexer.goToNextToken();

         while (lexer.isZero() || lexer.isOne()) {
            lexer.goToNextToken();
         }
      }

      return {
         isValid: function(expression) {
            if (expression === "") return false;
            try {
               lexer = new BooleanSignalLexer(expression);
               lexer.goToNextToken();
               parseSignal();
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