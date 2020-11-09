import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';

describe('testing Universe constructor', function() {

   var u = new Universe();

   afterEach(function() {
      u.clear();
   });

   it('New Universe constructor should work', function() {
      expect(u.getLength()).toEqual([0, 1]);
      expect(u.isEmpty()).toBe(true);
   });

   it('addSignal method should work', function() {
      var s1 = new BooleanSignal("a = 100101/10");
      var s2 = new BooleanSignal("b = 1011/010");
      var s3 = new BooleanSignal("c = 1/10110");

      expect(function() {
         u.addSignal({})
      }).toThrow();

      u.addSignal(s1);
      expect(u.getLength()).toEqual([6, 2]);

      u.addSignal(s1);
      expect(u.getLength()).toEqual([6, 2]);

      u.addSignal(s2);
      expect(u.getLength()).toEqual([6, 6]);

      u.addSignal(s3);
      expect(u.getLength()).toEqual([6, 30]);
   });

   it('updateSignal method should work', function() {
      var s1 = new BooleanSignal("a = 100101/10");
      var s2 = new BooleanSignal("b = 1011/010");
      var s3 = new BooleanSignal("c = 1/10110");

      u.addSignal(s1);
      u.addSignal(s2);
      u.addSignal(s3);
      expect(u.getLength()).toEqual([6, 30]);

      expect(function() {
         u.updateSignal({})
      }).toThrow();

      s1 = new BooleanSignal("a = 100101001/1001");
      u.updateSignal("a", s1);
      expect(u.getLength()).toEqual([9, 60]);
   });

   it('removeSignal method should work', function() {
      var s1 = new BooleanSignal("a = 100101/10");
      var s2 = new BooleanSignal("b = 1011/010");
      var s3 = new BooleanSignal("c = 1/10110");

      u.addSignal(s1);
      u.addSignal(s2);
      u.addSignal(s3);
      expect(u.getLength()).toEqual([6, 30]);

      u.removeSignal("f");
      expect(u.getLength()).toEqual([6, 30]);

      u.removeSignal("a");
      expect(u.isEmpty()).toBe(false);
      expect(u.getLength()).toEqual([4, 15]);

      u.removeSignal("c");
      expect(u.isEmpty()).toBe(false);
      expect(u.getLength()).toEqual([4, 3]);

      u.removeSignal("b");
      expect(u.isEmpty()).toBe(true);
      expect(u.getLength()).toEqual([0, 1]);
   });

   it('clear method should work', function() {
      var s1 = new BooleanSignal("a = 100101/10");
      var s2 = new BooleanSignal("b = 1011/010");
      var s3 = new BooleanSignal("c = 1/10110");

      u.addSignal(s1);
      u.addSignal(s2);
      u.addSignal(s3);
      expect(u.getLength()).toEqual([6, 30]);

      u.clear();
      expect(u.isEmpty()).toBe(true);
      expect(u.getLength()).toEqual([0, 1]);
   });
});
