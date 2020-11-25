import { inheritPrototype } from 'src/engine/helpers';
import TemporalEntity from './TemporalEntity';
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
   TemporalEntity.call(this, id, formulaString, other);

   if (!other) {
      if (!(booleanSignal instanceof BooleanSignal))
         throw new TypeError("TemporalFormula: Expected 'booleanSignal' to be 'BooleanSignal' object");
      if (!(referredBS instanceof Array))
         throw new TypeError("TemporalFormula: Expected 'referredBS' to be 'Array' object");

      // Array of referenced boolean signals
      this.references = referredBS;
      // the evaluated representation of the temporal formula
      this.booleanSignal = new BooleanSignal(undefined, booleanSignal);
      this.booleanSignal.id = this.id;
   } else {
      this.booleanSignal = new BooleanSignal(undefined, other.booleanSignal);
   }

   this.__type = 'TemporalFormula';
}
inheritPrototype(TemporalFormula, TemporalEntity);

TemporalFormula.prototype.calculateChartValues = function(universeLength) {
   return this.booleanSignal.calculateChartValues(universeLength, "Formula");
};

TemporalFormula.prototype.getChartData = function() {
   return this.booleanSignal.getChartData();
};

TemporalFormula.prototype.getAssociatedSignal = function() {
   return this.booleanSignal;
};

TemporalFormula.prototype.calculateUpdatedFixedPart = function (fixedPartNewLength) {
   return this.booleanSignal.calculateUpdatedFixedPart(fixedPartNewLength);
};

TemporalFormula.prototype.calculateUpdatedPeriodicPart = function (periodicPartNewLength) {
   return this.booleanSignal.calculateUpdatedPeriodicPart(periodicPartNewLength);
}

export default TemporalFormula;
