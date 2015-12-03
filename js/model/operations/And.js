function And(lSignal, rSignal) {
   Operator.call(this, function(bit1, bit2) {
      if (bit1 === Symbols.getZero() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else if (bit1 === Symbols.getZero() && bit2 === Symbols.getOne()) {
         return Symbols.getZero();
      } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else {
         return Symbols.getOne();
      }
   }, lSignal, rSignal);
}
inheritPrototype(And, Operator);

And.prototype.performUnaryOperator = function() {
   throw new Error("Not implemented method");
};
