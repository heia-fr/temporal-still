function BooleanSignal(expressionString, other) {
   if (typeof other === 'undefined') {
      if (typeof expressionString !== 'string')
         throw new TypeError("BooleanSignal: Expected expressionString to be a 'String' object");

      this.id = ""; // the signal's name
      this.content = expressionString.trim();
      this.editorEnabled = false;
      this.referencingTemporalFormulasIds = [];
      this.body = ""; // the fixed part of the signal
      this.period = ""; // the periodic part of the signal
      this.periodStartIndex = 0; // holds the the start of the periodic part
      // after extending the fixed part
      this.fixedPartNewLength = 0; // the extended fixed part length
      this.periodicPartNewLength; // the updated length of the periodic part
      this.signalChartData;

      var parts = this.content.split("=");
      this.id = parts[0].trim();

      var signal = parts[1].split("/");
      this.body = signal[0].trim();
      this.period = signal[1].trim();
      this.periodicPartNewLength = this.period.length;
   } else {
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
      this.referencingTemporalFormulasIds = other.referencingTemporalFormulasIds;
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
         getReferencingTemporalFormulasIds: function() {
            return this.referencingTemporalFormulasIds;
         },
         setReferencingTemporalFormulasIds: function(refTfIds) {
            this.referencingTemporalFormulasIds = refTfIds;
         },
         addReferencingTemporalFormulaId: function(TfId) {
            if (!_.includes(this.referencingTemporalFormulasIds, TfId)) {
               this.referencingTemporalFormulasIds.push(TfId);
            }
         },
         removeReferencingTemporalFormulaId: function(TfId) {
            if (_.includes(this.referencingTemporalFormulasIds, TfId)) {
               this.referencingTemporalFormulasIds = _.without(this.referencingTemporalFormulasIds,
                        TfId);
            }
         },
         isReferenced: function() {
            return (this.referencingTemporalFormulasIds.length != 0);
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
                     "color": this.colors[_.random(0, this.colors.length - 1)]
            }];
         },
         getChartData: function() {
            return this.signalChartData;
         },
         colors: ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40", "#01FF70",
                  "#FFDC00", "#FF851B", "#FF4136", "#85144b", "#5B3822", "#F012BE", "#B10DC9",
                  "#2B0F0E", "#111111", "#AAAAAA", "#3F5D7D", "#927054", "#279B61", "#008AB8",
                  "#993333", "#CC3333", "#006495", "#004C70", "#0093D1", "#F2635F", "#F4D00C",
                  "#E0A025", "#462066", "#FFB85F", "#FF7A5A", "#00AAA0", "#5D4C46", "#7B8D8E",
                  "#632528", "#3F2518", "#333333", "#FFCC00", "#669966", "#993366", "#F14C38",
                  "#144955", "#6633CC", "#EF34A2", "#FD9308", "#462D44", "#3399FF", "#99D21B",
                  "#B08749", "#FFA3D6", "#00D9FF", "#000000", "#0000FF", "#FF0000", "#00FF00"]
};
