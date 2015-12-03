var TemporalFormulaInterpreter = function() {

   function Singleton() {

      var lexer;
      var universe;

      function parseFormulaExpr() {
         // ------------------------------------------------------------------------------
         // not necessary in our case (validation is assumed to be done before
         // calling the interpreter)
         if (!lexer.isVarName()) throw new SyntaxError("Expected valid variable name");
         lexer.goToNextToken();
         if (!lexer.isEqualSign()) throw new SyntaxError("Expected equal sign");
         lexer.goToNextToken();
         // ------------------------------------------------------------------------------

         var bs = parseFormula();
         return bs;
      }

      function parseFormula() {
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
            // TODO: perfom WEAKLY UNTIL operation
         }

         return bs;
      }

      function parseAtom() {

         var bs = null;

         if (lexer.isOpeningBracket()) {
            lexer.goToNextToken();
            bs = parseFormula();
            if (!lexer.isClosingBracket()) throw new SyntaxError("Expected ')'");
            lexer.goToNextToken();

         } else if (lexer.isNot()) {
            bs = parseAtom();
            var op = new Not(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            if (!lexer.isClosingSquareBracket()) throw new SyntaxError("Expected ']'");
            lexer.goToNextToken();
            bs = parseAtom();
            var op = new Always(bs);
            bs = op.performUnaryOperator();

         } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();
            if (!lexer.isGreaterThanSign())
               throw new SyntaxError("Expected " + Symbols.getGreaterThan());
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
         if (!lexer.isVarName()) throw new SyntaxError("Expected valid variable name");
         var bs = universe.signalById(lexer.getCurrentToken());
         lexer.goToNextToken();
         return bs;
      }

      return {
         evaluate: function(expression, univ) {
            if (typeof expression !== 'string')
               throw new TypeError("Expecting 'expression' to be a 'String' object");
            if (!(univ instanceof Universe))
               throw new TypeError("Expecting 'universe' to be a 'Universe' object");

            try {
               universe = univ;
               lexer = new TemporalFormulaLexer(expression);
               lexer.goToNextToken();
               var bs = parseFormulaExpr();
               return new TemporalFormula(expression, bs);
            } catch (ex) {
               console.log(ex.message);
               return null;
            }
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();