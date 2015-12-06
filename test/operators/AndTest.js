
describe('testing "And" constructor', function() {

   var s1;
   var s2;
   var and;
   
   it('"And" Operator Should Not Have "performUnaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 101/101");
      var s2 = new BooleanSignal("b = 110/011");
      var and = new And(s1, s2);

//      expect(and.performUnaryOperator()).toThrow();
      expect(and.performBinaryOperator()).not.toThrow();
   });

   it('Correct "And" operation should pass', function() {
      s1 = new BooleanSignal("a = 101/101");
      s2 = new BooleanSignal("b = 110/011");
      and = new And(s1, s2);
      
      var r = and.performBinaryOperator();
      
      expect(r.getContent()).toEqual("ab=100/001");
   });
});
