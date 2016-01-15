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
   TemporalOperator.call(this, function(index, start, bitStr, cutWrapper) {

      // cut the search if we already know that this bit
      // will be evaluated to 1
      if (cutWrapper.cut) return Symbols.getZero();

      // if the signal is 1 at some time t+k return 1, otherwise return 0
      for (var i = start, j = index, l = bitStr.length; i < l; ++i, ++j) {
         if (bitStr.charAt(j % l) === Symbols.getOne()) return Symbols.getOne();
      }

      cutWrapper.cut = true; // no more execution of the previous for loop
      return Symbols.getZero();
   }, lSignal);
}
inheritPrototype(Eventually, TemporalOperator);

// Override the performBinaryOperator() of the base
// class so the user can't call it from an 'Eventually' object
Eventually.prototype.performBinaryOperator = function() {
   throw new Error("Eventually: Not implemented method");
};