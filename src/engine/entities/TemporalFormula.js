import BooleanSignal from './BooleanSignal';

/**
 * This class defines a TemporalFormula
 *
 * @param id
 *           the identifier of the temporal formula
 * @param formulaString
 *           the string representation of the formula
 * @param booleanSignal
 *           the evaluated representation of the formula
 * @param referredBS
 *           an array of referenced boolean signals' IDs
 * @param other
 *           an other temporal formula to copy from. It must be a valid
 *           TemporalFormula
 */
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

      // the identifier of the temporal formula
      this.id = id;
      // the string representation of the temporal formula
      this.content = formulaString;
      this.editable = false;
      // Array of referenced boolean signals
      this.referredBooleanSignalsIds = referredBS;
      // the evaluated representation of the temporal formula
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.setId(this.id);
   } else {
      if (!(other instanceof Object) || other.__type !== 'TemporalFormula')
         throw new TypeError("TemporalFormula: Expected other to be a 'TemporalFormula' object");
      this.id = other.id;
      this.content = other.content;
      this.editable = other.editorEnabled;
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
            return this.editable;
         },
         setEditorEnabled: function(editorEnabled) {
            this.editable = editorEnabled;
         },
         calculateChartValues: function(universeLength) {
            this.booleanSignal.calculateChartValues(universeLength, "Formula");
         },
         getChartData: function() {
            return this.booleanSignal.getChartData();
         }
};

export default TemporalFormula;
