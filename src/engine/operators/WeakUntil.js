import { Symbols, inheritPrototype } from 'src/engine/helpers';
import TemporalOperator from './TemporalOperator';
import Always from './Always';

/**
 * This class represents a 'WeakUntil' operator. it inherits from
 * TemporalOperator class and passes an eval() callback to be used it the
 * evaluation of 'WEAKLY UNTIL' operation.
 */
function WeakUntil(lSignal, rSignal) {
   // call the base class constructor and passing a callback
   // along with the signal to be evaluated.
   //
   // PRE: lbitStr and rbitStr are expected to be a set of 0s and 1s
   // index and start are, respectively, the position
   // of the bit to evaluate and the starting point
   // of the evaluation
   TemporalOperator.call(this, function(index, start, offset, lbitStr, rbitStr) {
      // if rSignal is 1 at time t, then return 1
      if (rbitStr.charAt(index) === Symbols.getOne()) return Symbols.getOne();

      var i, j;
      var l = rbitStr.length;
      // search the time t+k when the right boolean signal becomes 1
      for (i = start, j = index; i < l; ++i, ++j) {
         if (rbitStr.charAt(j % l) === Symbols.getOne()) break;
      }

      if (i < l) {
         // if rSignal is 1 at time t+k, then lSignal must be 1 at times t and
         // t+1 ... and t+k-1
         var k;
         for (k = start, j = index; k < i; ++k, ++j) {
            if (lbitStr.charAt(j % l) === Symbols.getZero()) return Symbols.getZero();
         }
      } else { // otherwise, lSignal must ALWAYS be 1 at time t
         var bs = (new Always(lSignal)).performUnaryOperator();
         var flattenedSignal = bs.getBody().concat(bs.getPeriod());

         if (flattenedSignal.charAt(index + offset) === Symbols.getZero())
            return Symbols.getZero();
      }

      return Symbols.getOne();
   }, lSignal, rSignal);
}
inheritPrototype(WeakUntil, TemporalOperator);

WeakUntil.prototype.performUnaryOperator = function() {
   throw new Error("Not implemented method");
};

export default WeakUntil;
