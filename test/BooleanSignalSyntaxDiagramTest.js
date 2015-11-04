var charSet = "abcdefghijklmnopqrstuwxyz"; // 'v' is omitted

function testCorrectSignals(nbrOfTests) {
   var result = true;
   var signals = "";
   for (var i = 0; i < nbrOfTests; i++) {
      signals = BooleanSignalGenerator.generateBooleanSignals();
      result = BooleanSignalSyntaxDiagram.isValid(signals) && result;
   }
   return result;
}

function testUncorrectSignals(generator, nbrOfTests) {
   var result = false;
   var signals = "";
   var pool = "[<à$]!?)(\>.:@,-_*+'/&%2345678" + charSet;
   for (var i = 0; i < nbrOfTests; i++) {
      signals = BooleanSignalGenerator.generateBooleanSignals();

      var nb = generator.integer(1, signals.length);
      for(var j = 0; j < nb; ++j) {
         var idx = generator.integer(0, signals.length - 1);
         signals = signals.replace(signals.charAt(idx), generator.string(1, pool));
      }
      var r = BooleanSignalSyntaxDiagram.isValid(signals);
      if(r) {
         console.log(signals);
      }
      result = r || result;
   }
   return result;
}

describe('testing BooleanSignalSyntaxDiagram constructor', function() {
   
   var nbrOfTest = 1000;
   var r = new Random();

   it('Correct signals are expected to be accepted', function() {
      var result = testCorrectSignals(nbrOfTest);
      expect(result).toBe(true);
   });

   it('Uncorrect signals are expected to be refused', function() {
      var result = false;
      result = BooleanSignalSyntaxDiagram.isValid("") || result;
      result = BooleanSignalSyntaxDiagram.isValid("v") || result;
      result = BooleanSignalSyntaxDiagram.isValid("x=") || result;
      result = BooleanSignalSyntaxDiagram.isValid(">=/;") || result;
      result = BooleanSignalSyntaxDiagram.isValid(">=10101/0101;") || result;

      result = testUncorrectSignals(r, nbrOfTest)
                  || result;

      expect(result).toBe(false);
   });
});