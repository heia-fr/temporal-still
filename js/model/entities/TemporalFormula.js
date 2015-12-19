function TemporalFormula(id, formulaString, booleanSignal, referredBS, other) {
   if (typeof other === 'undefined') {
      if (typeof formulaString !== "string")
         throw new TypeError("TemporalFormula: Expected 'String' object");
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError("TemporalFormula: Expected 'BooleanSignal' object");
      if (!(referredBS instanceof Array))
         throw new TypeError("TemporalFormula: Expected 'Array' object");

      this.id = id;
      this.content = formulaString;
      this.editorEnabled = false;
      this.referredBooleanSignalsIds = referredBS;
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.setId(this.id);
   } else {
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
         calculateChartValues: function() {
            this.booleanSignal.calculateChartValues();
         },
         getChartData: function() {
            return this.booleanSignal.getChartData();
         }
};