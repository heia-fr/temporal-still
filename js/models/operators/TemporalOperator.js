/**
 * This class represents a base abstract class for all temporal operators used
 * in this application. It implements default behavior for both unary
 * (Eventually, Always) and binary (WeakUntil) temporal operators PRE:
 * operation() must be a valid callback function that handles the logic of one
 * of the temporal operators used in the application
 * 
 * @param function
 *           a function provided by derived temporal operators and used to
 *           evaluate the signal(s).
 * @param BooleanSignal
 *           lSignal is the left operand
 * @param BooleanSignal
 *           rSignal is the right operand
 */
function TemporalOperator(operation, lSignal, rSignal) {
   if (this.constructor === TemporalOperator)
      throw new Error("TemporalOperator: Cannot instantiate abstract class");

   Operator.call(this, operation, lSignal, rSignal);
}
inheritPrototype(TemporalOperator, Operator);

/**
 * Override the default behavior of the unary operators class in order to
 * implement the logic for both unary temporal operators
 * 
 * @returns {BooleanSignal}
 */
TemporalOperator.prototype.performUnaryOperator = function() {
   // update both the fixed and periodic parts to
   // evaluate the signal using the universe's length
   var thisBody = this.leftSignal.calculateUpdatedFixedPart(this.universeLength[0]);
   var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

   // concatenate the fixed and the periodic parts
   // and form a flattened signal. The formed string
   // makes it possible to check the value of each bit by checking the bits in
   // front
   var flattenedSignal = thisBody.concat(thisPeriod);

   // Parse the signal bit by bit and use the eval() callback
   // to calculate the result for both parts (fixed and periodic)
   // for example: Always(110/01) == 000/01
   var whole = Symbols.getEmpty();
   for (var i = 0; i < thisBody.length; ++i) {
      whole += this.eval(i, i, flattenedSignal);
   }
   whole += Symbols.getSlash();
   for (var i = 0; i < thisPeriod.length; ++i) {
      whole += this.eval(i, 0, thisPeriod);
   }

   // construct and return a fresh signal as a result of the operation
   whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
   return new BooleanSignal(whole);
};

/**
 * Override the default behavior for binary temporal operators it has the same
 * logic as performUnaryOperator() but for two operands (see
 * performUnaryOperator() method)
 */
TemporalOperator.prototype.performBinaryOperator = function() {
   if (!(this.rightSignal instanceof BooleanSignal))
      throw new TypeError("TemporalOperator: Expected 'rightSignal' to be a 'BooleanSignal' object");
   var thisBody = this.leftSignal.calculateUpdatedFixedPart(this.universeLength[0]);
   var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

   var thatBody = this.rightSignal.calculateUpdatedFixedPart(this.universeLength[0]);
   var thatPeriod = this.rightSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

   var lFlattenedSignal = thisBody.concat(thisPeriod);
   var rFlattenedSignal = thatBody.concat(thatPeriod);

   if (lFlattenedSignal.length != rFlattenedSignal.length)
      throw new Error("TemporalOperator: Incompatible signals lengths");

   var whole = Symbols.getEmpty();
   for (var i = 0; i < thisBody.length; ++i) {
      whole += this.eval(i, i, 0, lFlattenedSignal, rFlattenedSignal);
   }
   whole += Symbols.getSlash();
   for (var i = 0; i < thisPeriod.length; ++i) {
      whole += this.eval(i, 0, thisBody.length, thisPeriod, thatPeriod);
   }

   whole = this.leftSignal.getId() + this.rightSignal.getId() + Symbols.getEqual() + whole;
   return new BooleanSignal(whole);
};