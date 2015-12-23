function Always(lSignal) {
   TemporalOperator.call(this, function(index, start, bitStr) {
      var l = bitStr.length;
      for (var i = start, j = index; i < l; ++i, ++j) {
         if (bitStr.charAt(j % l) === Symbols.getZero()) return Symbols.getZero();
      }

      return Symbols.getOne();
   }, lSignal);
}
inheritPrototype(Always, TemporalOperator);

Always.prototype.performBinaryOperator = function() {
   throw new Error("Always: Not implemented method");
};