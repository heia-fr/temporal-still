/**
 * This class represents a Boolean Signal. The user must provide a string with a
 * specific format. e.g. b = 1010/01 where: 1) 'b' is the boolean signal's
 * identifier 2) '1010' is the boolean signal's fixed part 3) '01' is the
 * boolean signal's periodic part if the parameter 'other' is provided, it must
 * be a valid boolean signal so the newly created object can copy the values of
 * its attributes. PRE: if provided, expressionString must be a valid
 * BooleanSignal string representation e.g. a = 100101/11 PRE: if provided,
 * other must be a valid BooleanSignal object
 * 
 * @param string
 *           expressionString a string representation of a BooleanSignal
 * @param BooleanSignal
 *           other a valid BooleanSignal object
 */
function BooleanSignal(expressionString, other) {
   if (!other) {
      if (typeof expressionString !== 'string')
         throw new TypeError("BooleanSignal: Expected expressionString to be a 'String' object");

      // the signal's id
      this.id = Symbols.getEmpty();
      this.content = expressionString.trim();
      this.editorEnabled = false;
      this.referringTemporalFormulasIds = [];
      // the fixed part of the signal
      this.body = Symbols.getEmpty();
      // the periodic part of the signal
      this.period = Symbols.getEmpty();
      // holds the the start of the periodic part after extending the fixed part
      this.periodStartIndex = 0;
      this.signalChartData;

      var parts = this.content.split(Symbols.getEqual());
      this.id = parts[0].trim();

      var signal = parts[1].split(Symbols.getSlash());
      this.body = signal[0].trim();
      this.period = signal[1].trim();
      this.periodicPartNewLength = this.period.length;
   } else {
      if (!(other instanceof Object) || other.__type !== 'BooleanSignal')
         throw new TypeError("BooleanSignal: Expected other to be a 'BooleanSignal' object");
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
      this.referringTemporalFormulasIds = other.referringTemporalFormulasIds;
      this.body = other.body;
      this.period = other.period;
      this.periodStartIndex = other.periodStartIndex;
      this.signalChartData = other.signalChartData;
   }

   this.__type = 'BooleanSignal';
}

BooleanSignal.prototype = {
         constructor: BooleanSignal,
         // fixedPartNewLength: 0, // the extended fixed part length
         // periodicPartNewLength: 0, // the updated length of the periodic part
         getId: function() {
            return this.id;
         },
         setId: function(id) {
            this.id = id;
         },
         getContent: function() {
            return this.content;
         },
         getBody: function() {
            return this.body;
         },
         getPeriod: function() {
            return this.period;
         },
         isEditorEnabled: function() {
            return this.editorEnabled;
         },
         setEditorEnabled: function(enabled) {
            this.editorEnabled = enabled;
         },
         getReferringTemporalFormulasIds: function() {
            return this.referringTemporalFormulasIds;
         },
         setReferringTemporalFormulasIds: function(refTfIds) {
            this.referringTemporalFormulasIds = refTfIds;
         },
         addReferringTemporalFormulaId: function(tfId) {
            if (!this.isReferredByTemporalFormula(tfId)) {
               this.referringTemporalFormulasIds.push(tfId);
            }
         },
         removeReferringTemporalFormulaId: function(tfId) {
            if (this.isReferredByTemporalFormula(tfId)) {
               this.referringTemporalFormulasIds = _.without(this.referringTemporalFormulasIds,
                        tfId);
            }
         },
         isReferred: function() {
            return (this.referringTemporalFormulasIds.length != 0);
         },
         isReferredByTemporalFormula: function(tfId) {
            return _.includes(this.referringTemporalFormulasIds, tfId);
         },
         getFixedPartLength: function() {
            return this.body.length;
         },
         getPeriodicPartLength: function() {
            return this.period.length;
         },
         /**
          * this method calculates the new fixed part using the already
          * specified extension length. It must be called after
          * setFixedPartNewLength() method.
          * 
          * @return the new fixed part with the extension added
          */
         calculateUpdatedFixedPart: function(fixedPartNewLength) {
            var i;
            var newBody = this.body;
            for (i = 0; i < fixedPartNewLength - this.body.length; ++i) {
               newBody += this.period.charAt(i % this.period.length);
            }
            // save the periodic part offset
            this.periodStartIndex = i % this.period.length;
            return newBody;
         },
         /**
          * this method calculates the new periodic part using the already
          * specified extension length. It must be called after
          * setPeriodicPartNewLength() method.
          * 
          * @return the new periodic part with the extension added
          */
         calculateUpdatedPeriodicPart: function(periodicPartNewLength) {
            // if the specified periodicPartNewLength is negative,
            // return what remains from the periodic part by taking into
            // account the offset periodStartIndex
            if (periodicPartNewLength <= 0) { return this.period.substring(this.periodStartIndex,
                     this.period.length); }

            var newPeriod = Symbols.getEmpty();
            // calculate the new periodic part by using a round robin technique
            for (var i = 0, j = this.periodStartIndex; i < periodicPartNewLength; ++i, ++j) {
               newPeriod += this.period.charAt(j % this.period.length);
            }
            return newPeriod;
         },
         /**
          * this method calculates data to be used by the chart library in order
          * to display this boolean signal. The data is calculates such that
          * each bit of the signal is mapped to a segment of line, say two
          * points ([t0, val0], [t1, val1]). 1) t0, t1, t2, etc. represent the
          * ticks of the chart 2) val0, val1, val2, etc. represent the values of
          * the signal in each tick (0 or 1) For example, the bit 1 is the
          * signal 'a = 10/0' is represented as the couple of points ([0, 1],
          * [1, 1]) and the bit 0 that follows is represented as ([1, 0], [2,
          * 0])
          */
         calculateChartValues: function(universeLength) {
            if (!(universeLength instanceof Array))
               throw new TypeError(
                        "BooleanSignal: Expected 'universeLength' to be an 'Array' object");
            if (universeLength.length != 2)
               throw new Error("BooleanSignal: Expected 'universeLength' length to be 2");

            var newBody = this.calculateUpdatedFixedPart(universeLength[0]);
            var newPeriod = this.calculateUpdatedPeriodicPart(universeLength[1]);

            var values = [];
            var x = 0;
            var nextX = 1;
            var oldZ = parseInt(newBody.charAt(0));
            var z;

            values.push([x, oldZ]);
            values.push([nextX, oldZ]);

            // calculate points for the fixed part
            _.times(newBody.length - 1, function(i) {
               x = i + 1;
               nextX = i + 2;
               z = parseInt(newBody.charAt(i + 1));
               // if (z != oldZ) {
               values.push([x, z]);
               // }
               values.push([nextX, z]);
               oldZ = z;
            });

            // calculate points for one period
            _.times(newPeriod.length, function(i) {
               x = newBody.length + i;
               nextX = newBody.length + i + 1;
               z = parseInt(newPeriod.charAt(i));
               // if (z != oldZ) {
               values.push([x, z]);
               // }
               values.push([nextX, z]);
               oldZ = z;
            });

            this.signalChartData = [{
                     "key": "Signal " + this.getId(),
                     "values": values,
                     "color": Util.colors[_.random(0, Util.colors.length - 1)]
            }];
         },
         /**
          * @return An array containing data ready to be displayed
          */
         getChartData: function() {
            return this.signalChartData;
         }
};
