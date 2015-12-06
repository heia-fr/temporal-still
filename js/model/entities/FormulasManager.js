function FormulasManager(other) {
   if (typeof other === 'undefined') {
      this.dataStoreMap = new Map();
   } else {
      if (other.dataStoreMap.__type === 'Map') {
         this.dataStoreMap = new Map(other.dataStoreMap);
      } else {
         this.dataStoreMap = new Map();
      }
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
         addFormula: function(formula) {
            if (!(formula instanceof TemporalFormula))
               throw new TypeError("FormulasManager: Expected 'TemporalFormula' object");

            this.dataStoreMap.put(formula.getId(), formula);
         },
         updateFormula: function(id, newFormula) {
            if (!(newFormula instanceof TemporalFormula))
               throw new TypeError("FormulasManager: Expected 'TemporalFormula' object");

            this.dataStoreMap.put(id, newFormula);
         },
         removeFormula: function(id) {
            this.dataStoreMap.remove(id);
         }
};