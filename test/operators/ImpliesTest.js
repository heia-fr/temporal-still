import Universe from '../../js/models/business/Universe';
import BooleanSignal from '../../js/models/entities/BooleanSignal';
import Operator from '../../js/models/operators/Operator';
import Implies from '../../js/models/operators/Implies';

describe('testing "Implies" constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('"Implies" Operator Should Not Have "performUnaryOperator" Implemented', function() {
      var s1 = new BooleanSignal("a = 101/101");
      var s2 = new BooleanSignal("b = 110/011");
      var implies = new Implies(s1, s2);

      expect(function() {
         implies.performUnaryOperator();
      }).toThrow();
      expect(function() {
         implies.performBinaryOperator();
      }).not.toThrow();
   });

   it('Correct "Implies" operation should pass', function() {
      u.addSignal(new BooleanSignal("a = 101/101"));
      u.addSignal(new BooleanSignal("b = 110/011"));
      Operator.prototype.setUniverseLength(u.getLength());

      var implies = new Implies(u.signalById("a"), u.signalById("b"));
      var r = implies.performBinaryOperator();

      expect(r.getContent()).toEqual("ab=110/011");
   });
});
