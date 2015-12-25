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
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         removeFormula: function(id) {
            this.dataStoreMap.remove(id);
         },
         updateFormulasLengths: function(universeLength) {
            if (!(universeLength instanceof Array))
               throw new TypeError(
                        "FormulasManager: Expected 'universeLength' to be an 'Array' object");
            if (universeLength.length != 2)
               throw new Error("FormulasManager: 'universeLength' must have a length of 2");

            this.dataStoreMap.each(function(key, f, i) {
               var s = f.getAssociatedSignal();
               s.setFixedPartNewLength(universeLength[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(universeLength[1]);
            });
         },
         clear: function() {
            this.dataStoreMap.clear();
         }
};