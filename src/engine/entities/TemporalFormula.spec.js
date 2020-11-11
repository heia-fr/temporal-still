import {
   BooleanSignal,
   TemporalFormula,
} from 'src/engine/entities';

describe('testing TemporalFormula constructor', function() {

   it('TemporalFormula constructor with uncorrect parameters should throw an exception',
            function() {
               expect(function() {
                  new TemporalFormula();
               }).toThrow();
               expect(function() {
                  new TemporalFormula(undefined);
               }).toThrow();
               expect(function() {
                  new TemporalFormula(undefined, undefined);
               }).toThrow();
               expect(function() {
                  new TemporalFormula(undefined, undefined, undefined);
               }).toThrow();
               expect(function() {
                  new TemporalFormula(undefined, undefined, undefined, undefined);
               }).toThrow();
               expect(function() {
                  new TemporalFormula(undefined, undefined, undefined, undefined, undefined);
               }).toThrow();
               expect(function() {
                  new TemporalFormula(2015);
               }).toThrow();
               expect(function() {
                  new TemporalFormula("", new Date());
               }).toThrow();
               expect(function() {
                  new TemporalFormula("", "", null);
               }).toThrow();
               expect(function() {
                  new TemporalFormula("", "", new BooleanSignal(""), null);
               }).toThrow();
               expect(function() {
                  new TemporalFormula("", "", new BooleanSignal(""), [], function() {
                  });
               }).toThrow();

               expect(function() {
                  new TemporalFormula("f", "f = a | b", 2016)
               }).toThrow();
            });

   it('TemporalFormula constructor with correct parameters should not throw an exception',
            function() {
               expect(function() {
                  new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
               }).not.toThrow();
               expect(function() {
                  new TemporalFormula("f", "f = a & b", new BooleanSignal("k = 100101/10"), [],
                           undefined);
               }).not.toThrow();

               expect(function() {
                  new TemporalFormula(undefined, undefined, undefined, undefined,
                           new TemporalFormula("f", "f = a & b", new BooleanSignal("k = 100101/10"), []))
               }).not.toThrow();
            });

   it('TemporalFormula state should be as expected', function() {
      var tf = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), ["a", "b"]);

      expect(tf.getId()).toMatch("f");
      expect(tf.getContent()).toMatch("f = a & b");
      expect(tf.getReferredBooleanSignalsIds()).toEqual(["a", "b"]);
   });
});
