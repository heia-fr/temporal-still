import { Symbols } from 'src/engine/helpers';

/*******************************************************************************
 * Defining a base class "Lexer" using Combination Constructor/Prototype
 * Pattern. This is the most common way of defining custom types in JavaScript.
 * The constructor pattern defines instance properties, whereas the prototype
 * pattern defines methods and shared properties. With this approach, each
 * instance ends up with its own copy of the instance properties, but they all
 * share references to methods, conserving memory.
 ******************************************************************************/
function Lexer(expressionString) {
   if (typeof expressionString !== "string")
      throw new TypeError("Lexer: 'expressionString' is expected to be a String object");
   this.expressionString = expressionString.trim();
   this.currentToken = Symbols.getEmpty();
   this.nextCharIndex = 0;
}

// Overriding Lexer's default prototype with an object containing methods
Lexer.prototype = {
         constructor: Lexer,
         /**
          * Returns the current token
          *
          * @returns {string}
          */
         getCurrentToken: function() {
            return this.currentToken;
         },
         /**
          * Checks whether the string has no more characters left to parse
          *
          * @returns {Boolean}
          */
         hasNoMoreChars: function() {
            return (this.nextCharIndex >= this.expressionString.length);
         },
         /**
          * Moves the cursor to the next token. The blank characters are
          * ignored. Letters are grouped together to form an identifier
          */
         goToNextToken: function() {
            this.currentToken = Symbols.getEmpty();
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
         /**
          * Checks whether the current token is an variable name
          *
          * @returns {Boolean}
          */
         isVarName: function() {
            return /[a-z]+/.test(this.currentToken);
         },
         /**
          * Checks whether the current token is an equal sign
          *
          * @returns {Boolean}
          */
         isEqualSign: function() {
            return this.currentToken === Symbols.getEqual();
         },
         /**
          * Checks whether the current token is an opening bracket
          *
          * @returns {Boolean}
          */
         isOpeningBracket: function() {
            return this.currentToken === Symbols.getOpeningBraket();
         },
         /**
          * Checks whether the current token is an closing bracket
          *
          * @returns {Boolean}
          */
         isClosingBracket: function() {
            return this.currentToken === Symbols.getClosingBraket();
         },
         /**
          * Checks whether the current token is an empty string
          *
          * @returns {Boolean}
          */
         isEmptyToken: function() {
            return this.currentToken === Symbols.getEmpty();
         },
         /**
          * Checks whether the current token is a zero
          *
          * @returns {Boolean}
          */
         isZero: function() {
            return this.getCurrentToken() === Symbols.getZero();
         },
         /**
          * Checks whether the current token is a one
          *
          * @returns {Boolean}
          */
         isOne: function() {
            return this.getCurrentToken() === Symbols.getOne();
         },
         /**
          * Checks whether the current token is a slash
          *
          * @returns {Boolean}
          */
         isSlash: function() {
            return this.getCurrentToken() === Symbols.getSlash();
         },
         /**
          * Checks whether the current token is an or ('|')
          *
          * @returns {Boolean}
          */
         isOr: function() {
            return (this.getCurrentToken() === Symbols.getOr());
         },
         /**
          * Checks whether the current token is an and ('&')
          *
          * @returns {Boolean}
          */
         isAnd: function() {
            return (this.getCurrentToken() === Symbols.getAnd());
         },
         /**
          * Checks whether the current token is a dash ('-')
          *
          * @returns {Boolean}
          */
         isDash: function() {
            return this.getCurrentToken() === Symbols.getDash();
         },
         /**
          * Checks whether the current token is a not ('!')
          *
          * @returns {Boolean}
          */
         isNot: function() {
            return this.getCurrentToken() === Symbols.getNot();
         },
         /**
          * Checks whether the current token is an opening square bracket
          *
          * @returns {Boolean}
          */
         isOpeningSquareBracket: function() {
            return this.getCurrentToken() === Symbols.getOpeningSquareBraket();
         },
         /**
          * Checks whether the current token is a closing square bracket
          *
          * @returns {Boolean}
          */
         isClosingSquareBracket: function() {
            return this.getCurrentToken() === Symbols.getClosingSquareBraket();
         },
         /**
          * Checks whether the current token is a less than sign
          *
          * @returns {Boolean}
          */
         isLessThanSign: function() {
            return this.getCurrentToken() === Symbols.getLessThan();
         },
         /**
          * Checks whether the current token is a greater than sign
          *
          * @returns {Boolean}
          */
         isGreaterThanSign: function() {
            return this.getCurrentToken() === Symbols.getGreaterThan();
         },
         /**
          * Checks whether the current token is a weak until sign
          *
          * @returns {Boolean}
          */
         isWeaklyUntil: function() {
            return this.getCurrentToken() === Symbols.getWeakUntil();
         },
         /**
          * Checks whether the current token is a next sign
          *
          * @returns {Boolean}
          */
         isNext: function() {
            return this.getCurrentToken() === Symbols.getNext();
         },
         /**
          * Checks whether the current token is a until sign
          *
          * @returns {Boolean}
          */
         isUntil: function() {
            return this.getCurrentToken() === Symbols.getUntil();
         },
         /**
          * Checks whether the current token is a release sign
          *
          * @returns {Boolean}
          */
         isRelease: function() {
            return this.getCurrentToken() === Symbols.getRelease();
         },
};

export default Lexer;
