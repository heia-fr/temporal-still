describe('testing "WeakUntil" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"WeakUntil" Operator Should Not Have "performUnaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 1011/011010");
      var s2 = new BooleanSignal("b = 0100/001011");
      var weakUntil = new WeakUntil(s1, s2);

      expect(function() {
         weakUntil.performUnaryOperator();
      }).toThrow();
      expect(function() {
         weakUntil.performBinaryOperator();
      }).not.toThrow();
   });

   it('Correct "Always" operation should pass', function() {
      u.addSignal(new BooleanSignal("a = 101/011"));     // 10101/101101101101101
      u.addSignal(new BooleanSignal("b = 11/0"));        // 11000/000000000000000
      u.addSignal(new BooleanSignal("c = 11001/01100")); // 11001/011000110001100
      u.addSignal(new BooleanSignal("d = 1100/1"));      // 11001/111111111111111
      Operator.prototype.setUniverseLength(u.getLength()); // length [5, 15]

      weakUntil = new WeakUntil(u.signalById("a"), u.signalById("b"));
      var r = weakUntil.performBinaryOperator();
      expect(r.getContent()).toEqual("ab=11000/000000000000000");

      weakUntil = new WeakUntil(u.signalById("b"), u.signalById("a"));
      var r = weakUntil.performBinaryOperator();
      expect(r.getContent()).toEqual("ba=11101/101101101101101");

      weakUntil = new WeakUntil(u.signalById("a"), u.signalById("c"));
      var r = weakUntil.performBinaryOperator();
      expect(r.getContent()).toEqual("ac=11001/111001110001101");

      weakUntil = new WeakUntil(u.signalById("a"), u.signalById("d"));
      var r = weakUntil.performBinaryOperator();
      expect(r.getContent()).toEqual("ad=11001/111111111111111");

      weakUntil = new WeakUntil(u.signalById("c"), u.signalById("d"));
      var r = weakUntil.performBinaryOperator();
      expect(r.getContent()).toEqual("cd=11001/111111111111111");
   });
});
