function Eventually(lSignal) {
   TemporalOperator.call(this, function(index, start, bitStr) {
      var l = bitStr.length;
      for (var i = start, j = index; i < l; ++i, ++j) {
         if (bitStr.charAt(j % l) === Symbols.getOne()) return Symbols.getOne();
      }

      return Symbols.getZero();
   }, lSignal);
}
inheritPrototype(Eventually, TemporalOperator);

Eventually.prototype.performBinaryOperator = function() {
   throw new Error("Eventually: Not implemented method");
};