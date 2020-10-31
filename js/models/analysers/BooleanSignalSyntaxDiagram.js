import BooleanSignalLexer from './BooleanSignalLexer';

/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
var BooleanSignalSyntaxDiagram = function() {

   function Singleton() {

      var lexer;

      function parseSignal() {
         if (!lexer.isVarName())
            throw new SyntaxError("BooleanSignalSyntaxDiagram: Expected valid variable name");
         lexer.goToNextToken();

         if (!lexer.isEqualSign())
            throw new SyntaxError("BooleanSignalSyntaxDiagram: Expected equal sign");
         lexer.goToNextToken();

         parseDigits();

         if (!lexer.isSlash())
            throw new SyntaxError("BooleanSignalSyntaxDiagram: Expected slash sign");
         lexer.goToNextToken();

         parseDigits();

         if (lexer.isSemiColon()) {
            lexer.goToNextToken();
            if (lexer.isEmptyToken()) return;
            parseSignal();
         }

         if (!lexer.isEmptyToken())
            throw new SyntaxError("BooleanSignalSyntaxDiagram: Expected end of signals");
      }

      function parseDigits() {
         if (!(lexer.isZero() || lexer.isOne()))
            throw new SyntaxError("BooleanSignalSyntaxDiagram: Expected 0 or 1");
         lexer.goToNextToken();

         while (lexer.isZero() || lexer.isOne()) {
            lexer.goToNextToken();
         }
      }

      return {
         isValid: function(expression) {
            // permit empty string (that's to be validated in the view)
            if (expression === "") return true;
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

export default BooleanSignalSyntaxDiagram;
