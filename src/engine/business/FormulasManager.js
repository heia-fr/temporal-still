import Map from './Map';
import { TemporalFormula } from 'src/engine/entities';

/**
 * This class represents a Formulas manager used to add, updated and remove
 * formulas.
 *
 * @param other
 *           if it's provided, it must be a valid FormulasManager object.
 */
function FormulasManager(other) {
   if (!other) {
      this.dataStoreMap = new Map();
   } else {
      if (!(other instanceof Object) || other.__type !== 'FormulasManager')
         throw new TypeError("Universe: Expected other to be a 'FormulasManager' object");

      this.dataStoreMap = new Map(other.dataStoreMap);
   }

   this.__type = 'FormulasManager';
}

FormulasManager.prototype = {
         constructor: FormulasManager,
         /**
          * Returns all of the formulas
          *
          * @returns {Array}
          */
         getFormulas: function() {
            return this.dataStoreMap.values();
         },
         /**
          * Returns a temporal formula with an id matching the provided one
          *
          * @param id
          *           an ID of temporal formula to fetch
          * @returns {TemporalFormula}
          */
         formulaById: function(id) {
            return this.dataStoreMap.get(id);
         },
         /**
          * Checks whether a temporal formula with the provided ID exists in the
          * formulas manager
          *
          * @param id
          *           of the boolean signal to check
          * @returns {Boolean}
          */
         containsFormula: function(id) {
            return this.dataStoreMap.containsKey(id);
         },
         /**
          * Adds a temporal formula to the formulas manager.
          *
          * @param formula
          *           is a TemporalFormula object to add to the formulas
          *           manager. if a object with the same ID exists, it gets
          *           overridden by the new one.
          */
         addFormula: function(formula) {
            if (!(formula instanceof TemporalFormula))
               throw new TypeError(
                        "FormulasManager: Expected 'formula' to be a 'TemporalFormula' object");

            this.dataStoreMap.put(formula.getId(), formula);
         },
         /**
          * Updates an existing temporal formula.
          *
          * @param id
          *           is the id of the temporal formula to update
          * @param newFormula
          *           is a TemporalFormula object that overrides the old
          *           formula.
          */
         updateFormula: function(id, newFormula) {
            if (!(newFormula instanceof TemporalFormula))
               throw new TypeError(
                        "FormulasManager: Expected 'newFormula' to be a 'TemporalFormula' object");

            this.dataStoreMap.put(id, newFormula);
         },
         /**
          * Removes a temporal formula from the formulas manager.
          *
          * @param id
          *           is the ID of the temporal formula to remove
          */
         removeFormula: function(id) {
            this.dataStoreMap.remove(id);
         },
         /**
          * Checks whether this formulas manager is empty
          *
          * @returns {Boolean}
          */
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         /**
          * Clears this formulas manager and resets the initial state
          */
         clear: function() {
            this.dataStoreMap.clear();
         }
};

export default FormulasManager;
