import BooleanSignalSyntaxDiagram from '../../js/models/analysers/BooleanSignalSyntaxDiagram';
import BooleanSignalGenerator from '../../js/models/generators/BooleanSignalGenerator';
import FormulasManager from '../../js/models/business/FormulasManager';
import Symbols from '../../js/models/helpers/Symbols';

function testCorrectSignals(nbrOfTests) {
   var result = true;
   var signals = Symbols.getEmpty();
   for (var i = 0; i < nbrOfTests; i++) {
      signals = BooleanSignalGenerator.generateBooleanSignals(new FormulasManager());
      result = BooleanSignalSyntaxDiagram.isValid(signals) && result;
   }
   return result;
}

function testUncorrectSignals(generator, nbrOfTests) {
   var result = false;
   var signals = Symbols.getEmpty();
   var pool = "[<à$]!?)(\>.:@,-_*+'/&2345%6789" + Symbols.getCharSet();
   String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index + character.length);
   }
   for (var i = 0; i < nbrOfTests; i++) {
      signals = BooleanSignalGenerator.generateBooleanSignals(new FormulasManager());

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

   it('Correct signals are expected to be accepted', function() {
      var result = true;

      result = BooleanSignalSyntaxDiagram.isValid("a = 100101/010;b = 00101/01;") && result;
      result = testCorrectSignals(nbrOfTest) && result;
      expect(result).toBe(true);
   });

   it('Uncorrect signals are expected to be refused', function() {
      var r = new Random();
      var result = false;

      result = BooleanSignalSyntaxDiagram.isValid("v") || result;
      result = BooleanSignalSyntaxDiagram.isValid("x=") || result;
      result = BooleanSignalSyntaxDiagram.isValid(">=/;") || result;
      result = BooleanSignalSyntaxDiagram.isValid(">=10101/0101;") || result;

      result = testUncorrectSignals(r, nbrOfTest) || result;

      expect(result).toBe(false);
   });
});
