import Symbols from '../../models/helpers/Symbols';
import inheritPrototype from '../helpers/Extend';
import Lexer from './Lexer';

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
   return (this.getCurrentToken() === Symbols.getOr());
};

TemporalFormulaLexer.prototype.isAnd = function() {
   return (this.getCurrentToken() === Symbols.getAnd());
};

TemporalFormulaLexer.prototype.isDash = function() {
   return this.getCurrentToken() === Symbols.getDash();
};

TemporalFormulaLexer.prototype.isNot = function() {
   return this.getCurrentToken() === Symbols.getNot();
};

TemporalFormulaLexer.prototype.isOpeningSquareBracket = function() {
   return this.getCurrentToken() === Symbols.getOpeningSquareBraket();
};

TemporalFormulaLexer.prototype.isClosingSquareBracket = function() {
   return this.getCurrentToken() === Symbols.getClosingSquareBraket();
};

TemporalFormulaLexer.prototype.isLessThanSign = function() {
   return this.getCurrentToken() === Symbols.getLessThan();
};

TemporalFormulaLexer.prototype.isGreaterThanSign = function() {
   return this.getCurrentToken() === Symbols.getGreaterThan();
};

TemporalFormulaLexer.prototype.isWeaklyUntil = function() {
   return this.getCurrentToken() === Symbols.getWeakUntil();
};

export default TemporalFormulaLexer;
