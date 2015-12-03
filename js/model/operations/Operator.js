function Operator(operation, lSignal, rSignal) {
   if (this.constructor === Operator) throw new Error("Cannot instantiate abstract class");

   if (typeof operation !== 'function') throw new TypeError("Expected a 'function' object");
   if (!(lSignal instanceof BooleanSignal))
      throw new TypeError("Expected 'lSignal' to be a 'BooleanSignal' object");

   this.eval = operation;
   this.leftSignal = lSignal;
   this.rightSignal = rSignal;
}

Operator.prototype = {
         constructor: Operator,
         performUnaryOperator: function() {
            var thisBody = this.leftSignal.calculateUpdatedFixedPart();
            var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart();

            var whole = Symbols.getEmpty();
            for (var i = 0; i < thisBody.length; ++i) {
               whole += this.eval(thisBody.charAt(i));
            }
            whole += Symbols.getSlash();
            for (var i = 0; i < thisPeriod.length; ++i) {
               whole += this.eval(thisPeriod.charAt(i));
            }

            whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
            return new BooleanSignal(whole);
         },
         performBinaryOperator: function() {
            if (!(this.rightSignal instanceof BooleanSignal))
               throw new TypeError("Expected 'rightSignal' to be a 'BooleanSignal' object");
             var thisBody = this.leftSignal.calculateUpdatedFixedPart();
             var thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart();
            
             var thatBody = this.rightSignal.calculateUpdatedFixedPart();
             var thatPeriod = this.rightSignal.calculateUpdatedPeriodicPart();

            if (thisBody.length != thatBody.length)
               throw new Error("Operator: Incompatible signals lengths");
            if (thisPeriod.length != thatPeriod.length)
               throw new Error("Operator: Incompatible signals lengths");

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
