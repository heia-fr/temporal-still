function Eventually(lSignal) {
   Operator.call(this, function(index, bitStr) {
      for (var i = index; i < bitStr.length; ++i) {
         if (bitStr.charAt(i) === Symbols.getOne()) return Symbols.getOne();
      }

      return Symbols.getZero();
   }, lSignal);
}
inheritPrototype(Eventually, Operator);

Eventually.prototype.performUnaryOperator = function() {
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

Eventually.prototype.performBinaryOperator = function() {
   throw new Error("Not implemented method");
};