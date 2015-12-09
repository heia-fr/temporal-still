function TemporalFormula(id, formulaString, booleanSignal, referencedBS, other) {
   if (typeof other === 'undefined') {
      if (typeof formulaString !== "string")
         throw new TypeError("TemporalFormula: Expected 'String' object");
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError("TemporalFormula: Expected 'BooleanSignal' object");
      if (!(referencedBS instanceof Array))
         throw new TypeError("TemporalFormula: Expected 'Array' object");

      this.id = id;
      this.content = formulaString;
      this.editorEnabled = false;
      this.referencedBooleanSignalsIds = referencedBS;
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.setId(this.id);
   } else {
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
      this.referencedBooleanSignalsIds = other.referencedBooleanSignalsIds;
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
         getReferencedBooleanSignalsIds: function() {
            return this.referencedBooleanSignalsIds;
         },
         setReferencedBooleanSignalsIds: function(bsIdsArray) {
            this.referencedBooleanSignalsIds = bsIdsArray;
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