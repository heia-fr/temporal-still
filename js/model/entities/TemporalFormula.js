function TemporalFormula(formulaString, booleanSignal, other) {
   if (!(other instanceof TemporalFormula)) {
      if (typeof formulaString !== "string") throw new TypeError("Expected 'String' object");
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError("Expected 'BooleanSignal' object");

      this.id = formulaString.split("=")[0].trim();
      this.content = formulaString;
      this.booleanSignal = booleanSignal;
      this.booleanSignal.setId(this.id);
   } else {
      this.id = other.id;
      this.content = other.content;
      this.booleanSignal = other.booleanSignal;
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
         getBooleanSignal: function() {
            return this.booleanSignal;
         },
         setBooleanSignal: function(booleanSignal) {
            this.booleanSignal = booleanSignal;
         },
         isEditorEnabled: function() {
            return this.booleanSignal.isEditorEnabled();
         },
         setEditorEnabled: function(enabled) {
            this.booleanSignal.setEditorEnabled(enabled);
         },
         getFixedPartLength: function() {
            return this.booleanSignal.getFixedPartLength();
         },
         getPeriodicPartLength: function() {
            return this.booleanSignal.getPeriodicPartLength();
         },
         setFixedPartNewLength: function(len) {
            this.booleanSignal.setFixedPartNewLength(len);
         },
         setPeriodicPartNewLength: function(len) {
            this.booleanSignal.setPeriodicPartNewLength(len);
         },
         calculateChartValues: function() {
            this.booleanSignal.calculateChartValues();
         },
         getChartData: function() {
            return this.booleanSignal.getChartData();
         }
};
