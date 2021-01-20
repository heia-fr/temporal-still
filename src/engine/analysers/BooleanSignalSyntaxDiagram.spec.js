import { Random } from 'random-js';
import { TemporalEntitySyntaxDiagram } from 'src/engine/analysers';
import { generateBooleanSignals } from 'src/engine/generators';
import { Universe } from 'src/engine/business';
import { Symbols } from 'src/engine/helpers';

function testCorrectSignals(nbrOfTests) {
   var result = true;
   var signals = Symbols.getEmpty();
   for (var i = 0; i < nbrOfTests; i++) {
      signals = generateBooleanSignals(new Universe());
      result = TemporalEntitySyntaxDiagram.isValidSignal(signals) && result;
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
      signals = generateBooleanSignals(new Universe());

      if (generator.bool()) {
         signals += generator.string(10, pool);
      } else {
         var min = generator.integer(0, signals.length / 2);
         signals = signals.replace(signals.substring(min, min + 11), generator.string(10, pool));
      }

      result = TemporalEntitySyntaxDiagram.isValidSignal(signals) || result;
   }
   String.prototype.replaceAt = null;
   return result;
}

describe('testing BooleanSignalSyntaxDiagram constructor', function() {

   var nbrOfTest = 1000;

   it('Correct signals are expected to be accepted', function() {
      var result = true;

      result = TemporalEntitySyntaxDiagram.isValidSignal("a = 100101/010") && result;
      result = TemporalEntitySyntaxDiagram.isValidSignal("b = 00101/01") && result;
      result = testCorrectSignals(nbrOfTest) && result;
      expect(result).toBe(true);
   });

   it('Uncorrect signals are expected to be refused', function() {
      var r = new Random();
      var result = false;

      result = TemporalEntitySyntaxDiagram.isValidSignal("v") || result;
      result = TemporalEntitySyntaxDiagram.isValidSignal("x=") || result;
      result = TemporalEntitySyntaxDiagram.isValidSignal(">=/;") || result;
      result = TemporalEntitySyntaxDiagram.isValidSignal(">=10101/0101;") || result;

      result = testUncorrectSignals(r, nbrOfTest) || result;

      expect(result).toBe(false);
   });
});
