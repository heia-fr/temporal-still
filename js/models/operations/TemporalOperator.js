function TemporalOperator(func, lSignal, rSignal) {
   if (this.constructor === TemporalOperator)
      throw new Error("TemporalOperator: Cannot instantiate abstract class");

   Operator.call(this, func, lSignal, rSignal);
}
inheritPrototype(TemporalOperator, Operator);

TemporalOperator.prototype.performUnaryOperator = function() {
   var thisBody = this.leftSignal.calculateUpdatedFixedPart(this.universeLength[0]);
   var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(this.universeLength[1]);

   var flattenedSignal = thisBody.concat(thisPeriod);

   var whole = Symbols.getEmpty();
   for (var i = 0; i < thisBody.length; ++i) {
      whole += this.eval(i, i, flattenedSignal);
   }
   whole += Symbols.getSlash();
   for (var i = 0; i < thisPeriod.length; ++i) {
      whole += this.eval(i, 0, thisPeriod);
   }

   whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
   return new BooleanSignal(whole);
};

TemporalOperator.prototype.performBinaryOperator = function() {
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