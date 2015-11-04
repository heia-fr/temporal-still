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
   var pool = "[<à$]!?)(\>.:@,-_*+'/&2345%6789" + charSet;
   String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index + character.length);
   }
   for (var i = 0; i < nbrOfTests; i++) {
      signals = BooleanSignalGenerator.generateBooleanSignals();

      if (generator.bool()) {
         signals += generator.string(10, pool);
      } else {
         var min = generator.integer(0, signals.length / 2);
         signals = signals.replace(signals.substring(min, min + 11), generator.string(10, pool));
      }

      result = BooleanSignalSyntaxDiagram.isValid(signals) || result;
   }
   String.prototype.replaceAt = null;
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

      result = testUncorrectSignals(r, nbrOfTest) || result;

      expect(result).toBe(false);
   });
});