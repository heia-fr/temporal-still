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
         getFormulas: function() {
            return this.dataStoreMap.values();
         },
         formulaById: function(id) {
            return this.dataStoreMap.get(id);
         },
         containsFormula: function(id) {
            return this.dataStoreMap.containsKey(id);
         },
         addFormula: function(formula) {
            if (!(formula instanceof TemporalFormula))
               throw new TypeError(
                        "FormulasManager: Expected 'formula' to be a 'TemporalFormula' object");

            this.dataStoreMap.put(formula.getId(), formula);
         },
         updateFormula: function(id, newFormula) {
            if (!(newFormula instanceof TemporalFormula))
               throw new TypeError(
                        "FormulasManager: Expected 'newFormula' to be a 'TemporalFormula' object");

            this.dataStoreMap.put(id, newFormula);
         },
         removeFormula: function(id) {
            this.dataStoreMap.remove(id);
         },
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         clear: function() {
            this.dataStoreMap.clear();
         }
};