import Symbols from '../../models/helpers/Symbols';
import inheritPrototype from '../helpers/Extend';
import Operator from './Operator';

/**
 * This class represents a 'And' operator. it inherits from Operator class and
 * passes an eval() callback to be used it the evaluation of 'AND' operation.
 */
function And(lSignal, rSignal) {
   // call the base class constructor and passing a callback
   // along with the signal to be evaluated.
   //
   // PRE: bit1 and bit2 are expected to have 0 or 1 as a value for
   // this operator to work fine
   Operator.call(this, function(bit1, bit2) {
      if (bit1 === Symbols.getZero() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else if (bit1 === Symbols.getZero() && bit2 === Symbols.getOne()) {
         return Symbols.getZero();
      } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getZero()) {
         return Symbols.getZero();
      } else if(bit1 === Symbols.getOne() && bit2 === Symbols.getOne()) {
         return Symbols.getOne();
      } else {
         throw new Error("And: bit1 and bit2 must be 0 or 1");
      }
   }, lSignal, rSignal);
}
inheritPrototype(And, Operator);

// Override the performUnaryOperator() of the base
// class so the user can't call it from an 'And' object
And.prototype.performUnaryOperator = function() {
   throw new Error("Not implemented method");
};

export default And;
