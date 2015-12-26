describe('testing FormulasManager constructor', function() {

   var fm = new FormulasManager();

   afterEach(function() {
      fm.clear();
   });

   it('New FormulasManager constructor should work', function() {
      expect(fm.isEmpty()).toBe(true);
   });

   it('addFormula method should work', function() {
     var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
     var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
     var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
     
     expect(function() {
        u.addFormula({})
     }).toThrow();
     
     fm.addFormula(f1);
     expect(fm.getFormulas().length).toEqual(1);
     expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(f1));
     
     fm.addFormula(f1);
     expect(fm.getFormulas().length).toEqual(1);
     expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(f1));
     
     fm.addFormula(f2);
     fm.addFormula(f3);
     expect(fm.getFormulas().length).toEqual(3);
     expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(f1));
     expect(JSON.stringify(fm.formulaById("g"))).toEqual(JSON.stringify(f2));
     expect(JSON.stringify(fm.formulaById("h"))).toEqual(JSON.stringify(f3));
   });

   it('updateFormula method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
      
      expect(function() {
         u.updateFormula({})
      }).toThrow();
      
      fm.addFormula(f1);
      fm.addFormula(f2);
      fm.addFormula(f3);
      
      var newF2 = new TemporalFormula("g", "g = !a W []b", new BooleanSignal("g = 101001/0"), []);
      fm.updateFormula("g", newF2);
      expect(JSON.stringify(fm.formulaById("g"))).toEqual(JSON.stringify(newF2));
   });
   
   it('removeFormula method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
      fm.addFormula(f1);
      fm.addFormula(f2);
      fm.addFormula(f3);
      
      expect(fm.getFormulas().length).toEqual(3);
      expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(f1));
      expect(JSON.stringify(fm.formulaById("g"))).toEqual(JSON.stringify(f2));
      expect(JSON.stringify(fm.formulaById("h"))).toEqual(JSON.stringify(f3));
      
      fm.removeFormula("h");
      expect(fm.getFormulas().length).toEqual(2);
      expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(f1));
      expect(JSON.stringify(fm.formulaById("g"))).toEqual(JSON.stringify(f2));
      expect(JSON.stringify(fm.formulaById("h"))).toEqual(JSON.stringify(undefined));
      
      fm.removeFormula("f");
      fm.removeFormula("g");
      expect(fm.getFormulas().length).toEqual(0);
      expect(fm.isEmpty()).toBe(true);
      expect(JSON.stringify(fm.formulaById("f"))).toEqual(JSON.stringify(undefined));
      expect(JSON.stringify(fm.formulaById("g"))).toEqual(JSON.stringify(undefined));
      expect(JSON.stringify(fm.formulaById("h"))).toEqual(JSON.stringify(undefined));
      
   });
   
   it('clear method should work', function() {
      var f1 = new TemporalFormula("f", "f = a & b", new BooleanSignal("f = 100101/10"), []);
      var f2 = new TemporalFormula("g", "g = a | b", new BooleanSignal("g = 01000010/010"), []);
      var f3 = new TemporalFormula("h", "h = a W b", new BooleanSignal("h = 10/1001"), []);
      fm.addFormula(f1);
      fm.addFormula(f2);
      fm.addFormula(f3);
      
      expect(fm.getFormulas().length).toEqual(3);
      expect(fm.isEmpty()).toBe(false);
      
      fm.clear();
      
      expect(fm.getFormulas().length).toEqual(0);
      expect(fm.isEmpty()).toBe(true);
   });
});