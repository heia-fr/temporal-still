function BooleanSignal(expressionString, other) {
   if (typeof other === 'undefined') {
      if (typeof expressionString !== 'string')
         throw new TypeError("BooleanSignal: Expected expressionString to be a 'String' object");

      this.id = Symbols.getEmpty(); // the signal's id
      this.content = expressionString.trim();
      this.editorEnabled = false;
      this.referringTemporalFormulasIds = [];
      this.body = Symbols.getEmpty(); // the fixed part of the signal
      this.period = Symbols.getEmpty(); // the periodic part of the signal
      this.periodStartIndex = 0; // holds the the start of the periodic part
      // after extending the fixed part
      this.fixedPartNewLength = 0; // the extended fixed part length
      this.periodicPartNewLength; // the updated length of the periodic part
      this.signalChartData;

      var parts = this.content.split(Symbols.getEqual());
      this.id = parts[0].trim();

      var signal = parts[1].split(Symbols.getSlash());
      this.body = signal[0].trim();
      this.period = signal[1].trim();
      this.periodicPartNewLength = this.period.length;
   } else {
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
      this.referringTemporalFormulasIds = other.referringTemporalFormulasIds;
      this.body = other.body;
      this.period = other.period;
      this.periodStartIndex = other.periodStartIndex;
      this.fixedPartNewLength = other.fixedPartNewLength;
      this.periodicPartNewLength = other.periodicPartNewLength;
      this.signalChartData = other.signalChartData;
   }

   this.__type = 'BooleanSignal';
}

BooleanSignal.prototype = {
         constructor: BooleanSignal,
         getId: function() {
            return this.id;
         },
         setId: function(id) {
            this.id = id;
         },
         getContent: function() {
            return this.content;
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
         addReferringTemporalFormulaId: function(TfId) {
            if (!_.includes(this.referringTemporalFormulasIds, TfId)) {
               this.referringTemporalFormulasIds.push(TfId);
            }
         },
         removeReferringTemporalFormulaId: function(TfId) {
            if (_.includes(this.referringTemporalFormulasIds, TfId)) {
               console.log("#before signal id: " + this.getId() + " ==> " + this.referringTemporalFormulasIds);
               this.referringTemporalFormulasIds = _.without(this.referringTemporalFormulasIds,
                        TfId);
               console.log("#after signal id: " + this.getId() + " ==> " + this.referringTemporalFormulasIds);
            }
         },
         isReferred: function() {
            return (this.referringTemporalFormulasIds.length != 0);
         },
         getFixedPartLength: function() {
            return this.body.length;
         },
         getPeriodicPartLength: function() {
            return this.period.length;
         },
         setFixedPartNewLength: function(len) {
            this.fixedPartNewLength = len;
         },
         setPeriodicPartNewLength: function(len) {
            this.periodicPartNewLength = len;
         },
         calculateUpdatedFixedPart: function() {
            var i;
            var newBody = this.body;
            for (i = 0; i < this.fixedPartNewLength; ++i) {
               newBody += this.period.charAt(i % this.period.length);
            }
            this.periodStartIndex = i % this.period.length;
            return newBody;
         },
         calculateUpdatedPeriodicPart: function() {
            var newPeriod = "";
            for (var i = 0, j = this.periodStartIndex; i < this.periodicPartNewLength; ++i, ++j) {
               newPeriod += this.period.charAt(j % this.period.length);
            }
            return newPeriod;
         },
         calculateChartValues: function() {
            var newBody = this.calculateUpdatedFixedPart();
            var newPeriod = this.calculateUpdatedPeriodicPart();

            var values = [];
            var x = 0;
            var nextX = 1;
            var oldZ = parseInt(newBody.charAt(0));
            var z;

            values.push([x, oldZ]);
            values.push([nextX, oldZ]);

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
         getChartData: function() {
            return this.signalChartData;
         }
};
