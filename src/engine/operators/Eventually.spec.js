import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Eventually } from 'src/engine/operators';

describe('testing "Eventually" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"Eventually" Operator Should Not Have "performBinaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 1011/01101");
      var not = new Eventually(s1);

      expect(function() {
         not.performBinaryOperator();
      }).toThrow();
      expect(function() {
         not.performUnaryOperator();
      }).not.toThrow();
   });

   it('Correct "Eventually" operation should pass', function() {
      u.putEntity(new BooleanSignal("a = 101/011"));
      u.putEntity(new BooleanSignal("b = 11/0"));
      u.putEntity(new BooleanSignal("c = 11001/01100"));
      Operator.prototype.setUniverseLength(u.getLength()); // length [5, 15]

      var eventually = new Eventually(u.getEntity("a"));
      var r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("a=11111/111111111111111");

      eventually = new Eventually(u.getEntity("b"));
      r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("b=11000/000000000000000");

      eventually = new Eventually(u.getEntity("c"));
      r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("c=11111/111111111111111");
   });
});
