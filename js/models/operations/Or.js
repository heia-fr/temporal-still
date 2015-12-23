function Or(lSignal, rSignal) {
   Operator.call(this, function(bit1, bit2) {
      if (bit1 === Symbols.getZero() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else if (bit1 === Symbols.getZero() && bit2 === Symbols.getOne()) {
         return Symbols.getOne();
      } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getZero()) {
         return Symbols.getOne();
      } else {
         return Symbols.getOne();
      }
   }, lSignal, rSignal);
}
inheritPrototype(Or, Operator);

Or.prototype.performUnaryOperator = function() {
   throw new Error("Not implemented method");
};