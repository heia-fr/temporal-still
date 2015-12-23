/*******************************************************************************
 * Defining a base class "Lexer" using Combination Constructor/Prototype
 * Pattern. This is the most common way of defining custom types in JavaScript.
 * The constructor pattern defines instance properties, whereas the prototype
 * pattern defines methods and shared properties. With this approach, each
 * instance ends up with its own copy of the instance properties, but they all
 * share references to methods, conserving memory.
 ******************************************************************************/
function Lexer(expressionString) {
   if (typeof expressionString != "string")
      throw new TypeError("'expressionString' is expected to be a String object");
   this.expressionString = expressionString.trim();
   this.currentToken = "";
   this.nextCharIndex = 0;
}

// Overriding Lexer's default prototype with an object containing methods
Lexer.prototype = {
         constructor: Lexer,
         getCurrentToken: function() {
            return this.currentToken;
         },
         hasNoMoreChars: function() {
            return (this.nextCharIndex >= this.expressionString.length);
         },
         goToNextToken: function() {
            this.currentToken = "";
            if (this.hasNoMoreChars()) return;

            var pattern = /\s/; // match a space character
            var c = this.expressionString.charAt(this.nextCharIndex);
            while (pattern.test(c)) {
               this.nextCharIndex++;
               if (this.hasNoMoreChars()) return;

               c = this.expressionString.charAt(this.nextCharIndex);
            }
            if (this.hasNoMoreChars()) return;

            pattern = /[a-z]/; // match a lower-case letter
            c = this.expressionString.charAt(this.nextCharIndex);
            if (pattern.test(c)) {
               do {
                  this.currentToken += c;
                  this.nextCharIndex++;
                  if (this.hasNoMoreChars()) return;

                  c = this.expressionString.charAt(this.nextCharIndex);
               } while (pattern.test(c));
            } else {
               this.currentToken += c;
               this.nextCharIndex++;
            }
         },
         isVarName: function() {
            return /[a-z]+/.test(this.currentToken);
         },
         isEqualSign: function() {
            return this.currentToken === Symbols.getEqual();
         },
         isOpeningBracket: function() {
            return this.currentToken === Symbols.getOpeningBraket();
         },
         isClosingBracket: function() {
            return this.currentToken === Symbols.getClosingBraket();
         },
         isEmptyToken: function() {
            return this.currentToken === Symbols.getEmpty();
         }
};