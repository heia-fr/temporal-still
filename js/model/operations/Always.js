function Always(lSignal) {
   Operator.call(this, function(index, bitStr) {
      for (var i = index; i < bitStr.length; ++i) {
         if (bitStr.charAt(i) === Symbols.getZero()) return Symbols.getZero();
      }

      return Symbols.getOne();
   }, lSignal);
}
inheritPrototype(Always, Operator);

Always.prototype.performUnaryOperator = function() {
   // var notSignal = new Not(this.leftSignal).performUnaryOperator();
   // var eventuallySignal = new Eventually(notSignal).performUnaryOperator();
   // return new Not(eventuallySignal).performUnaryOperator();

   var thisBody = this.leftSignal.calculateUpdatedFixedPart();
   var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart();

   var flattenedSignal = thisBody + thisPeriod;

   var whole = Symbols.getEmpty();
   for (var i = 0; i < thisBody.length; ++i) {
      whole += this.eval(i, flattenedSignal);
   }
   whole += Symbols.getSlash();
   var dupThisPeriod = thisPeriod + thisPeriod;
   for (var i = 0; i < thisPeriod.length; ++i) {
      whole += this.eval(i, dupThisPeriod);
   }

   whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
   return new BooleanSignal(whole);
};

Always.prototype.performBinaryOperator = function() {
   throw new Error("Not implemented method");
};