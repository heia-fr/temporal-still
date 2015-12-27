describe('testing "Always" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"Always" Operator Should Not Have "performBinaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 1011/01101");
      var not = new Always(s1);

      expect(function() {
         not.performBinaryOperator();
      }).toThrow();
      expect(function() {
         not.performUnaryOperator();
      }).not.toThrow();
   });

   it('Correct "Always" operation should pass', function() {
      u.addSignal(new BooleanSignal("a = 101/011"));
      u.addSignal(new BooleanSignal("b = 11/0"));
      u.addSignal(new BooleanSignal("c = 11001/01100"));
      u.addSignal(new BooleanSignal("d = 1100/1"));
      Operator.prototype.setUniverseLength(u.getLength()); // length [5, 15]

      always = new Always(u.signalById("a"));
      var r = always.performUnaryOperator();
      expect(r.getContent()).toEqual("a=00000/000000000000000");

      always = new Always(u.signalById("b"));
      r = always.performUnaryOperator();
      expect(r.getContent()).toEqual("b=00000/000000000000000");
      
      always = new Always(u.signalById("c"));
      r = always.performUnaryOperator();
      expect(r.getContent()).toEqual("c=00000/000000000000000");
      
      always = new Always(u.signalById("d"));
      r = always.performUnaryOperator();
      expect(r.getContent()).toEqual("d=00001/111111111111111");
   });
});
