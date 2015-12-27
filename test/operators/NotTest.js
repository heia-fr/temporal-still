describe('testing "Not" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"Not" Operator Should Not Have "performBinaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 101/101");
      var not = new Not(s1);

      expect(function() {
         not.performBinaryOperator();
      }).toThrow();
      expect(function() {
         not.performUnaryOperator();
      }).not.toThrow();
   });

   it('Correct "Not" operation should pass', function() {
      u.addSignal(new BooleanSignal("a = 101/011"));
      Operator.prototype.setUniverseLength(u.getLength());

      not = new Not(u.signalById("a"));
      var r = not.performUnaryOperator();

      expect(r.getContent()).toEqual("a=010/100");
   });
});
