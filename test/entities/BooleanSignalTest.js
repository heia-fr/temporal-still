describe('testing BooleanSignal constructor', function() {

   it('BooleanSignal constructor with uncorrect parameters should throw an exception', function() {
      expect(function() {
         new BooleanSignal()
      }).toThrow();
      expect(function() {
         new BooleanSignal(undefined)
      }).toThrow();
      expect(function() {
         new BooleanSignal(null)
      }).toThrow();
      expect(function() {
         new BooleanSignal(2015)
      }).toThrow();
      expect(function() {
         new BooleanSignal(new Date())
      }).toThrow();
      expect(function() {
         new BooleanSignal(true)
      }).toThrow();
      expect(function() {
         new BooleanSignal([])
      }).toThrow();
      expect(function() {
         new BooleanSignal({})
      }).toThrow();
      expect(function() {
         new BooleanSignal(function() {
         })
      }).toThrow();

      expect(function() {
         new BooleanSignal("a = 1001/11", 2016)
      }).toThrow();
      expect(function() {
         new BooleanSignal(undefined, [])
      }).toThrow();
      expect(function() {
         new BooleanSignal("", {})
      }).toThrow();
      expect(function() {
         new BooleanSignal(undefined, function() {
         })
      }).toThrow();
   });

   it('BooleanSignal constructor with correct parameters should not throw an exception',
            function() {
               expect(function() {
                  new BooleanSignal("a = 100101/101")
               }).not.toThrow();
               expect(function() {
                  new BooleanSignal("b = 11/0", undefined)
               }).not.toThrow();

               expect(function() {
                  new BooleanSignal(undefined, new BooleanSignal("c=1001/01"))
               }).not.toThrow();
            });

   it('BooleanSignal state should be as expected', function() {
      var bs = new BooleanSignal("signal = 10110101/01");

      expect(bs.getId()).toMatch("signal");
      expect(bs.getContent()).toMatch("signal = 10110101/01");
      expect(bs.body).toMatch("10110101");
      expect(bs.period).toMatch("01");
      expect(bs.getFixedPartLength()).toEqual(8);
      expect(bs.getPeriodicPartLength()).toEqual(2);
   });

   it('New BooleanSignal should be referenced correctly', function() {
      var bs = new BooleanSignal("signal = 10110101/01");

      expect(bs.getReferringTemporalFormulasIds()).toEqual([]);
      expect(bs.isReferred()).toBe(false);

      bs.addReferringTemporalFormulaId("f");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(1);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["f"]);

      bs.addReferringTemporalFormulaId("f");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(1);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["f"]);
      expect(bs.isReferred()).toBe(true);

      bs.addReferringTemporalFormulaId("y");
      bs.addReferringTemporalFormulaId("q");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(3);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["f", "y", "q"]);
      expect(bs.isReferred()).toBe(true);

      bs.setReferringTemporalFormulasIds(["z", "t"]);

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(2);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["z", "t"]);
      expect(bs.isReferred()).toBe(true);

      bs.removeReferringTemporalFormulaId("z");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(1);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["t"]);
      expect(bs.isReferred()).toBe(true);

      bs.removeReferringTemporalFormulaId("z");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(1);
      expect(bs.getReferringTemporalFormulasIds()).toEqual(["t"]);
      expect(bs.isReferred()).toBe(true);

      bs.removeReferringTemporalFormulaId("t");

      expect(bs.getReferringTemporalFormulasIds().length).toEqual(0);
      expect(bs.getReferringTemporalFormulasIds()).toEqual([]);
      expect(bs.isReferred()).toBe(false);
   });

   it('BooleanSignal body and period should be as updated correctly', function() {
      var bs = new BooleanSignal("signal = 10110101/01");

      expect(bs.body).toMatch("10110101");
      expect(bs.period).toMatch("01");
      expect(bs.getFixedPartLength()).toEqual(8);
      expect(bs.getPeriodicPartLength()).toEqual(2);

      bs.setFixedPartNewLength(-1);
      bs.setPeriodicPartNewLength(-1);

      expect(bs.calculateUpdatedFixedPart()).toMatch("10110101");
      expect(bs.calculateUpdatedPeriodicPart()).toMatch("01");

      bs.setFixedPartNewLength(0);
      bs.setPeriodicPartNewLength(0);

      expect(bs.calculateUpdatedFixedPart()).toMatch("10110101");
      expect(bs.calculateUpdatedPeriodicPart()).toMatch("01");

      bs.setFixedPartNewLength(5);
      bs.setPeriodicPartNewLength(10);

      expect(bs.calculateUpdatedFixedPart()).toMatch("1011010101010");
      expect(bs.calculateUpdatedPeriodicPart()).toMatch("1010101010");

      expect(bs.body).toMatch("10110101");
      expect(bs.period).toMatch("01");
      expect(bs.getFixedPartLength()).toEqual(8);
      expect(bs.getPeriodicPartLength()).toEqual(2);
   });

   it('BooleanSignal chart data should be calculated correctly', function() {
      var bs = new BooleanSignal("signal = 101101/10");

      bs.calculateChartValues();
      var data = bs.getChartData();
      var expectedValues = [[0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [3, 1], [3, 1], [4, 1], [4, 0],
               [5, 0], [5, 1], [6, 1], [6, 1], [7, 1], [7, 0], [8, 0]];

      expect(data instanceof Array).toBe(true);
      expect(data.length).toEqual(1);
      expect(data[0] instanceof Object).toBe(true);
      expect(data[0].key).toEqual("Signal " + bs.getId());
      expect(data[0].values instanceof Array).toBe(true);
      expect(data[0].values.length).toEqual(16);
      expect(data[0].values).toEqual(expectedValues);
   });
});