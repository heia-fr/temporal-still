function TemporalFormula(formulaString, booleanSignal, other) {
   if (typeof other === 'undefined') {
      if (typeof formulaString !== "string")
         throw new TypeError("TemporalFormula: Expected 'String' object");
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError("TemporalFormula: Expected 'BooleanSignal' object");

      this.id = formulaString.split("=")[0].trim();
      this.content = formulaString;
      this.editorEnabled = false;
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.setId(this.id);
   } else {
      this.id = other.id;
      this.content = other.content;
      this.editorEnabled = other.editorEnabled;
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
         isEditorEnabled: function() {
            return this.editorEnabled;
         },
         setEditorEnabled: function(enabled) {
            this.editorEnabled = enabled;
         },
         calculateChartValues: function() {
            this.booleanSignal.calculateChartValues();
         },
         getChartData: function() {
            return this.booleanSignal.getChartData();
         }
};