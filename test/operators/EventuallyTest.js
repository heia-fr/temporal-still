import Universe from '../../js/models/business/Universe';
import BooleanSignal from '../../js/models/entities/BooleanSignal';
import Operator from '../../js/models/operators/Operator';
import Eventually from '../../js/models/operators/Eventually';

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
      u.addSignal(new BooleanSignal("a = 101/011"));
      u.addSignal(new BooleanSignal("b = 11/0"));
      u.addSignal(new BooleanSignal("c = 11001/01100"));
      Operator.prototype.setUniverseLength(u.getLength()); // length [5, 15]

      var eventually = new Eventually(u.signalById("a"));
      var r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("a=11111/111111111111111");

      eventually = new Eventually(u.signalById("b"));
      r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("b=11000/000000000000000");

      eventually = new Eventually(u.signalById("c"));
      r = eventually.performUnaryOperator();
      expect(r.getContent()).toEqual("c=11111/111111111111111");
   });
});
