
function Not(lSignal) {
   Operator.call(this, function(bit1) {
      if (bit1 === Symbols.getZero()) return Symbols.getOne();
      return Symbols.getZero();
   }, lSignal);
}
inheritPrototype(Not, Operator);

Not.prototype.performBinaryOperator = function() {
   throw new Error("Not implemented method");
};