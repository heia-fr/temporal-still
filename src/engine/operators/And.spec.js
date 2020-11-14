import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, And } from 'src/engine/operators';

describe('testing "And" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"And" Operator Should Not Have "performUnaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 101/101");
      var s2 = new BooleanSignal("b = 110/011");
      var and = new And(s1, s2);

      expect(function() {
         and.performUnaryOperator();
      }).toThrow();
      expect(function() {
         and.performBinaryOperator();
      }).not.toThrow();
   });

   it('Correct "And" operation should pass', function() {
      u.putEntity(new BooleanSignal("a = 101/101"));
      u.putEntity(new BooleanSignal("b = 110/011"));
      Operator.prototype.setUniverseLength(u.getLength());

      var and = new And(u.getEntity("a"), u.getEntity("b"));
      var r = and.performBinaryOperator();

      expect(r.getContent()).toEqual("ab=100/001");
   });
});
