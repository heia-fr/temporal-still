/**
 * This class represents a 'Material implication' operator. it inherits from Operator class and
 * passes an eval() callback to be used it the evaluation of 'Implies' operation.
 */
function Implies(lSignal, rSignal) {
   // call the base class constructor and passing a callback
   // along with the signal to be evaluated.
   //
   // PRE: bit1 and bit2 are expected to have 0 or 1 as a value for
   // this operator to work fine
   // Implies basic operation is evaluated as such:
   // p -> q is equivalent to !p | q where p and q are two boolean signals
   Operator.call(this, function(bit1, bit2) {
      if (bit1 === Symbols.getZero() && bit2 === Symbols.getZero()) {
         return Symbols.getOne();
      } else if (bit1 === Symbols.getZero() && bit2 === Symbols.getOne()) {
         return Symbols.getOne();
      } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else if(bit1 === Symbols.getOne() && bit2 === Symbols.getOne()) {
         return Symbols.getOne();
      } else {
         throw new Error("Implies: bit1 and bit2 must be 0 or 1");
      }
   }, lSignal, rSignal);
}
inheritPrototype(Implies, Operator);

// Override the performUnaryOperator() of the base
// class so the user can't call it from an 'Implies' object
Implies.prototype.performUnaryOperator = function() {
   throw new Error("Not implemented method");
};
