/*******************************************************************************
 * Inheriting "Lexer" using Parasitic Combination Inheritance Pattern. Parasitic
 * combination inheritance is considered the most efficient way to implement
 * type-based inheritance since the "Lexer" constructor is being called only one
 * time, avoiding having unnecessary and unused properties on
 * TemporalFormulaLexer.prototype
 ******************************************************************************/
function TemporalFormulaLexer(formula) {
   Lexer.call(this, formula);
}
inheritPrototype(TemporalFormulaLexer, Lexer);

// adding specific methods to TemporalFormulaLexer prototype
TemporalFormulaLexer.prototype.isOr = function() {
   return (this.getCurrentToken() === "|" || this.getCurrentToken() === "+");
};

TemporalFormulaLexer.prototype.isAnd = function() {
   return (this.getCurrentToken() === "&" || this.getCurrentToken() === ".");
};

TemporalFormulaLexer.prototype.isNot = function() {
   return this.getCurrentToken() === "!";
};

TemporalFormulaLexer.prototype.isOpeningSquareBracket = function() {
   return this.getCurrentToken() === "[";
};

TemporalFormulaLexer.prototype.isClosingSquareBracket = function() {
   return this.getCurrentToken() === "]";
};

TemporalFormulaLexer.prototype.isLessThanSign = function() {
   return this.getCurrentToken() === "<";
};

TemporalFormulaLexer.prototype.isGreaterThanSign = function() {
   return this.getCurrentToken() === ">";
};

TemporalFormulaLexer.prototype.isWeaklyUntil = function() {
   return this.getCurrentToken() === "W";
};