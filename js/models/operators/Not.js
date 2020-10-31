import Symbols from '../../models/helpers/Symbols';
import inheritPrototype from '../helpers/Extend';
import Operator from './Operator';

/**
 * This class represents a 'Not' operator. it inherits from Operator class and
 * passes an eval() callback to be used it the evaluation of 'NOT' operation.
 */
function Not(lSignal) {
   // Call the base class constructor and passing a callback
   // along with the signal to be evaluated.
   //
   // PRE: bit1 is expected to be 0 or 1 for this operator
   // to work fine
   Operator.call(this, function(bit1) {
      if (bit1 === Symbols.getZero()) {
         return Symbols.getOne();
      } else if (bit1 === Symbols.getOne()) {
         return Symbols.getZero();
      }
      throw new Error("Not: bit1 must be 0 or 1");
   }, lSignal);
}
inheritPrototype(Not, Operator);

// Override the performBinaryOperator() of the base
// class so the user can't call it from a 'Not' object
Not.prototype.performBinaryOperator = function() {
   throw new Error("Not implemented method");
};

export default Not;
