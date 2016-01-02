/**
 * This class represents a 'Eventually' operator. it inherits from
 * TemporalOperator class and passes an eval() callback to be used it the
 * evaluation of 'EVENTUALLY' operation.
 */
function Eventually(lSignal) {
   // call the base class constructor and passing a callback
   // along with the signal to be evaluated.
   //
   // PRE: bitStr is expected to be a set of 0s and 1s
   // index and start are, respectively, the position
   // of the bit to evaluate and the starting point
   // of the evaluation
   TemporalOperator.call(this, function(index, start, bitStr) {
      var l = bitStr.length;
      // if the signal is 1 at some time t+k return 1, otherwise return 0
      for (var i = start, j = index; i < l; ++i, ++j) {
         if (bitStr.charAt(j % l) === Symbols.getOne()) return Symbols.getOne();
      }

      return Symbols.getZero();
   }, lSignal);
}
inheritPrototype(Eventually, TemporalOperator);

// Override the performBinaryOperator() of the base
// class so the user can't call it from an 'Eventually' object
Eventually.prototype.performBinaryOperator = function() {
   throw new Error("Eventually: Not implemented method");
};