/*******************************************************************************
 * Inheriting "Lexer" using Parasitic Combination Inheritance Pattern. Parasitic
 * combination inheritance is considered the most efficient way to implement
 * type-based inheritance since the "Lexer" constructor is being called only one
 * time, avoiding having unnecessary and unused properties on
 * BooleanSignalLexer.prototype
 ******************************************************************************/
function BooleanSignalLexer(formula) {
   Lexer.call(this, formula);
}
inheritPrototype(BooleanSignalLexer, Lexer);

// adding specific methods to BooleanSignalLexer prototype
BooleanSignalLexer.prototype.isEqualSign = function() {
   return this.getCurrentToken() === "=";
};

BooleanSignalLexer.prototype.isZero = function() {
   return this.getCurrentToken() === "0";
};

BooleanSignalLexer.prototype.isOne = function() {
   return this.getCurrentToken() === "1";
};

BooleanSignalLexer.prototype.isSlash = function() {
   return this.getCurrentToken() === "/";
};

BooleanSignalLexer.prototype.isSemiColon = function() {
   return this.getCurrentToken() === ";";
};