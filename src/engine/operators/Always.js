import { Symbols, inheritPrototype } from 'src/engine/helpers';
import TemporalOperator from './TemporalOperator';

/**
 * This class represents a 'Always' operator. it inherits from TemporalOperator
 * class and passes an eval() callback to be used it the evaluation of 'ALWAYS'
 * operation.
 */
function Always(lSignal) {
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
      if (cutWrapper.cut) return Symbols.getOne();

      // if the signal is 0 at some time t+k return o, otherwise return 1
      for (var i = start, j = index, l = bitStr.length; i < l; ++i, ++j) {
         if (bitStr.charAt(j % l) === Symbols.getZero()) return Symbols.getZero();
      }

      cutWrapper.cut = true; // no more execution of the previous for..loop
      return Symbols.getOne();
   }, lSignal);
}
inheritPrototype(Always, TemporalOperator);

// Override the performBinaryOperator() of the base
// class so the user can't call it from an 'Always' object
Always.prototype.performBinaryOperator = function() {
   throw new Error("Always: Not implemented method");
};

export default Always;
