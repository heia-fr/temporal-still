function TemporalFormula(id, formulaString, booleanSignal, referredBS, other) {
   if (!other) {
      if (typeof id !== "string")
         throw new TypeError("TemporalFormula: Expected 'id' to be 'String' object");
      if (typeof formulaString !== "string")
         throw new TypeError("TemporalFormula: Expected 'formulaString' to be 'String' object");
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError(
                  "TemporalFormula: Expected 'booleanSignal' to be 'BooleanSignal' object");
      if (!(referredBS instanceof Array))
         throw new TypeError("TemporalFormula: Expected 'referredBS' to be 'Array' object");

      this.id = id;
      this.content = formulaString;
      this.editorEnabled = false;
      this.referredBooleanSignalsIds = referredBS;
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.setId(this.id);
   } else {
      if (!(other instanceof Object) || other.__type !== 'TemporalFormula')
         throw new TypeError("TemporalFormula: Expected other to be a 'TemporalFormula' object");
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
      this.referredBooleanSignalsIds = other.referredBooleanSignalsIds;
      this.booleanSignal = new BooleanSignal(undefined, other.booleanSignal);
   }

   this.__type = 'TemporalFormula';
}

TemporalFormula.prototype = {
         constructor: TemporalFormula,
         getId: function() {
            return this.id;
         },
         getContent: function() {
            return this.content;
         },
         getAssociatedSignal: function() {
            return this.booleanSignal;
         },
         getReferredBooleanSignalsIds: function() {
            return this.referredBooleanSignalsIds;
         },
         setReferredBooleanSignalsIds: function(bsIdsArray) {
            this.referredBooleanSignalsIds = bsIdsArray;
         },
         isEditorEnabled: function() {
            return this.editorEnabled;
         },
         setEditorEnabled: function(editorEnabled) {
            this.editorEnabled = editorEnabled;
         },
         calculateChartValues: function(universeLength) {
            this.booleanSignal.calculateChartValues(universeLength);
         },
         getChartData: function() {
            return this.booleanSignal.getChartData();
         }
};