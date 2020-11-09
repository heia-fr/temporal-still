import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Or } from 'src/engine/operators';

describe('testing "Or" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"Or" Operator Should Not Have "performUnaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 101/101");
      var s2 = new BooleanSignal("b = 110/011");
      var or = new Or(s1, s2);

      expect(function() {
         or.performUnaryOperator();
      }).toThrow();
      expect(function() {
         or.performBinaryOperator();
      }).not.toThrow();
   });

   it('Correct "Or" operation should pass', function() {
      u.addSignal(new BooleanSignal("a = 101/101"));
      u.addSignal(new BooleanSignal("b = 110/011"));
      Operator.prototype.setUniverseLength(u.getLength());

      var and = new Or(u.signalById("a"), u.signalById("b"));
      var r = and.performBinaryOperator();

      expect(r.getContent()).toEqual("ab=111/111");
   });
});
