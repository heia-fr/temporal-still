import _random from 'lodash/random';
import { Symbols } from 'src/engine/helpers';
import { Universe } from 'src/engine/business';

/**
 * Defining BooleanSignalGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the formulas manager to produce a signals
 * with IDs different from existing formulas
 *
 * The maximum lengths of the signals are:
 *
 * 1) maximum length of the signal's fixed part: 10
 * 2) maximum length of the signal's periodic part: 5
 * 3) maximum number of signals to generate: 5
 */
var BooleanSignalGenerator = function() {

   function Singleton() {

      var formulasManager;

      var maxBody = 10;
      var maxPeriod = 5;

      function generateVarName(ids) {
         var i;
         var id = "";
         do {
            i = _random(0, Symbols.getCharSet().length - 1);
            id = Symbols.getCharSet().charAt(i);
         } while (ids.indexOf(id) >= 0 || formulasManager.containsEntity(id));
         return id;
      }

      function generateDigits(maxNbDigits) {
         var digits = Symbols.getEmpty();
         var nbDigits = _random(1, maxNbDigits);
         for (var i = 0; i < nbDigits; i++) {
            digits += (_random() === 1 ? Symbols.getOne() : Symbols.getZero());
         }

         return digits;
      }

      function generateSignals() {
         var signals = Symbols.getEmpty();
         var varName, body, period;
         var ids = [];

         varName = generateVarName(ids);
         ids.push(varName);
         body = generateDigits(maxBody);
         period = generateDigits(maxPeriod);

         signals += varName + " " + Symbols.getEqual() + " " + body + Symbols.getSlash() + period;

         return signals;
      }

      return {
         generateBooleanSignals: function(fManager) {
            if (!(fManager instanceof Universe))
               throw new TypeError("BooleanSignalGenerator: Expecting 'fManager' to be a 'Universe' object");
            formulasManager = fManager;

            return generateSignals();
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default BooleanSignalGenerator;
