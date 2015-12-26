/**
 * This class represents a base abstract class for all logical
 * operators used in this application. It implements default behavior for both
 * unary (Not, Eventually, Always) and binary (And, Or, WeakUntil) operators
 * 
 * PRE: operation() must be a valid callback function that handles the logic
 *      of one of the logical operators used in the application
 * 
 * @param function
 *           a function provided by derived Operators and used to evaluate the
 *           signal(s).
 * @param BooleanSignal
 *           lSignal is the left operand
 * @param BooleanSignal
 *           rSignal is the right operand
 */
function Operator(operation, lSignal, rSignal) {
   // This class cannot be instantiated and it has to be derived
   // in order to be used
   if (this.constructor === Operator)
      throw new Error("Operator: Cannot instantiate abstract class");

   // Be sure that the operation and the left operand are of the expected types
   if (typeof operation !== 'function')
      throw new TypeError("Operator: Expected a 'function' object");
   if (!(lSignal instanceof BooleanSignal))
      throw new TypeError("Operator: Expected 'lSignal' to be a 'BooleanSignal' object");

   // this is a callback function that handles the logic
   // each concrete operator uses to evaluate its operand(s)
   this.eval = operation;
   this.leftSignal = lSignal;
   this.rightSignal = rSignal;
}

Operator.prototype = {
         constructor: Operator,
         // This is the length of the universe to be used
         // by all the concrete operators
         universeLength: [0, 1],
         setUniverseLength: function(universeLength) {
            if (!(universeLength instanceof Array))
               throw new TypeError("Operator: Expected 'universeLength' to be an 'Array' object");
            if (universeLength.length != 2)
               throw new Error("Operator: Expected 'universeLength' length to be 2");
            this.universeLength = universeLength;
         },
         // implement the default behavior for unary operators
         performUnaryOperator: function() {
            // update both the fixed and periodic parts of the signal to
            // evaluate
            // using the universe's length
            var thisBody = this.leftSignal.calculateUpdatedFixedPart(this.universeLength[0]);
            var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

            // Parse the signal bit by bit and use the eval() callback
            // to calculate the result
            var whole = Symbols.getEmpty();
            for (var i = 0; i < thisBody.length; ++i) {
               whole += this.eval(thisBody.charAt(i));
            }
            whole += Symbols.getSlash();
            for (var i = 0; i < thisPeriod.length; ++i) {
               whole += this.eval(thisPeriod.charAt(i));
            }

            // form and return a fresh signal as a result of the operation
            whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
            return new BooleanSignal(whole);
         },
         // implement the default behavior for binary operators
         // it has the same logic as performUnaryOperator()
         // but for two operands see performUnaryOperator() method
         performBinaryOperator: function() {
            if (!(this.rightSignal instanceof BooleanSignal))
               throw new TypeError(
                        "Operator: Expected 'rightSignal' to be a 'BooleanSignal' object");
            var thisBody = this.leftSignal.calculateUpdatedFixedPart(this.universeLength[0]);
            var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

            var thatBody = this.rightSignal.calculateUpdatedFixedPart(this.universeLength[0]);
            var thatPeriod = this.rightSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

            if (thisBody.length != thatBody.length)
               throw new Error("Operator: Incompatible fixed part lengths");
            if (thisPeriod.length != thatPeriod.length)
               throw new Error("Operator: Incompatible periodic part lengths");

            var whole = Symbols.getEmpty();
            for (var i = 0; i < thisBody.length; ++i) {
               whole += this.eval(thisBody.charAt(i), thatBody.charAt(i));
            }
            whole += Symbols.getSlash();
            for (var i = 0; i < thisPeriod.length; ++i) {
               whole += this.eval(thisPeriod.charAt(i), thatPeriod.charAt(i));
            }

            whole = this.leftSignal.getId() + this.rightSignal.getId() + Symbols.getEqual() + whole;
            return new BooleanSignal(whole);
         }
};
