function WeakUntil(lSignal, rSignal) {
   TemporalOperator.call(this, function(index, start, offset, lbitStr, rbitStr) {
      // if rSignal is 1 at time t, then return 1
      if (rbitStr.charAt(index) === Symbols.getOne()) return Symbols.getOne();

      var i, j;
      var l = rbitStr.length;
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