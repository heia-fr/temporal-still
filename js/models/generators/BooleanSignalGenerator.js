/*******************************************************************************
 * Defining BooleanSignalGenerator
 ******************************************************************************/
var BooleanSignalGenerator = function() {

   function Singleton() {

      var formulasManager;

      var maxBody = 10;
      var maxPeriod = 5;
      var maxNbOfSignals = 5;

      function generateVarName(ids) {
         var i;
         var id;
         do {
            i = _.random(0, Symbols.getCharSet().length - 1);
            id = Symbols.getCharSet().charAt(i);
         } while (_.includes(ids, id) || formulasManager.containsFormula(id));
         return id;
      }

      function generateDigits(maxNbDigits) {
         var digits = Symbols.getEmpty();
         var nbDigits = _.random(1, maxNbDigits);
         for (var i = 0; i < nbDigits; i++) {
            digits += (_.random() === 1 ? Symbols.getOne() : Symbols.getZero());
         }

         return digits;
      }

      function generateSignals() {
         var signals = Symbols.getEmpty();
         var nbOfSignals = _.random(1, maxNbOfSignals);
         var varName, body, period;
         var ids = [];

         for (var i = 1; i <= nbOfSignals; i++) {
            varName = generateVarName(ids);
            ids.push(varName);
            body = generateDigits(maxBody);
            period = generateDigits(maxPeriod);

            signals += varName + " " + Symbols.getEqual() + " " + body + Symbols.getSlash()
                     + period + ((i == nbOfSignals) ? "" : Symbols.getSemiColon());
         }

         return signals;
      }

      return {
         generateBooleanSignals: function(fManager) {
            if (!(fManager instanceof FormulasManager))
               throw new TypeError(
                        "BooleanSignalGenerator: Expecting 'fManager' to be a 'FormulasManager' object");
            formulasManager = fManager;
            
            return generateSignals();
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();