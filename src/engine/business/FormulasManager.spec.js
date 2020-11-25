import { Universe } from 'src/engine/business';
import {
   BooleanSignal,
   TemporalFormula,
} from 'src/engine/entities';

describe('testing FormulasManager constructor', function() {

   var fm = new Universe();

   afterEach(function() {
      fm.clear();
   });

   it('New FormulasManager constructor should work', function() {
      expect(fm.isEmpty()).toBe(true);
   });

   it('putEntity method should work', function() {
     var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
     var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
     var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);

     expect(function() {
        u.putEntity({})
     }).toThrow();

     fm.putEntity(f1);
     expect(fm.getEntities().length).toEqual(1);
     expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(f1));

     fm.putEntity(f1);
     expect(fm.getEntities().length).toEqual(1);
     expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(f1));

     fm.putEntity(f2);
     fm.putEntity(f3);
     expect(fm.getEntities().length).toEqual(3);
     expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(f1));
     expect(JSON.stringify(fm.getEntity("g"))).toEqual(JSON.stringify(f2));
     expect(JSON.stringify(fm.getEntity("h"))).toEqual(JSON.stringify(f3));
   });

   it('putEntity method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);

      expect(function() {
         u.putEntity({})
      }).toThrow();

      fm.putEntity(f1);
      fm.putEntity(f2);
      fm.putEntity(f3);

      var newF2 = new TemporalFormula("g", "g = !a W []b", new BooleanSignal("g = 101001/0"), []);
      fm.putEntity(newF2);
      expect(JSON.stringify(fm.getEntity("g"))).toEqual(JSON.stringify(newF2));
   });

   it('removeEntity method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
      fm.putEntity(f1);
      fm.putEntity(f2);
      fm.putEntity(f3);

      expect(fm.getEntities().length).toEqual(3);
      expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(f1));
      expect(JSON.stringify(fm.getEntity("g"))).toEqual(JSON.stringify(f2));
      expect(JSON.stringify(fm.getEntity("h"))).toEqual(JSON.stringify(f3));

      fm.removeEntity("h");
      expect(fm.getEntities().length).toEqual(2);
      expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(f1));
      expect(JSON.stringify(fm.getEntity("g"))).toEqual(JSON.stringify(f2));
      expect(JSON.stringify(fm.getEntity("h"))).toEqual(JSON.stringify(undefined));

      fm.removeEntity("f");
      fm.removeEntity("g");
      expect(fm.getEntities().length).toEqual(0);
      expect(fm.isEmpty()).toBe(true);
      expect(JSON.stringify(fm.getEntity("f"))).toEqual(JSON.stringify(undefined));
      expect(JSON.stringify(fm.getEntity("g"))).toEqual(JSON.stringify(undefined));
      expect(JSON.stringify(fm.getEntity("h"))).toEqual(JSON.stringify(undefined));

   });

   it('clear method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
      fm.putEntity(f1);
      fm.putEntity(f2);
      fm.putEntity(f3);

      expect(fm.getEntities().length).toEqual(3);
      expect(fm.isEmpty()).toBe(false);

      fm.clear();

      expect(fm.getEntities().length).toEqual(0);
      expect(fm.isEmpty()).toBe(true);
   });
});
