/*******************************************************************************
 * Defining BooleanSignalGenerator
 ******************************************************************************/
var BooleanSignalGenerator = function() {

   function Singleton() {

      var maxBody = 10;
      var maxPeriod = 5;
      var maxNbOfSignals = 5;

      var generator = new Random();
      var charSet = "abcdefghijklmnopqrstuwxyz"; // 'v' is omitted

      function generateVarName() {
         var i = generator.integer(0, charSet.length - 1);
         return charSet.charAt(i);
      }

      function generateDigits(maxNbDigits) {
         var digits = "";
         var nbDigits = generator.integer(1, maxNbDigits);
         for (var i = 0; i < nbDigits; i++) {
            digits += (generator.bool() ? Symbols.getOne() : Symbols.getZero());
         }

         return digits;
      }

      function generateSignals() {
         var signals = "";
         var nbOfSignals = generator.integer(1, maxNbOfSignals);
         var varName, body, period;

         for (var i = 1; i <= nbOfSignals; i++) {
            varName = generateVarName();
            body = generateDigits(maxBody);
            period = generateDigits(maxPeriod);

            signals += varName + " " + Symbols.getEqual() + " " + body + Symbols.getSlash() + period
                     + ((i == nbOfSignals) ? "" : Symbols.getSemiColon());
         }

         return signals;
      }

      return {
         generateBooleanSignals: function() {
            return generateSignals();
         }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();