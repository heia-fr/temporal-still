function Universe(other) {
   if (!other) {
      this.dataStoreMap = new Map();
      this.length = [0, 1];
   } else {
      if (!(other instanceof Object) || other.__type !== 'Universe')
         throw new TypeError("Universe: Expected other to be a 'Universe' object");

      this.dataStoreMap = new Map(other.dataStoreMap);
      this.length = other.length;
   }

   this.__type = 'Universe';
}

Universe.prototype = {
         constructor: Universe,
         getLength: function() {
            return this.length;
         },
         getSignalsIds: function() {
            return this.dataStoreMap.keys();
         },
         getSignals: function() {
            return this.dataStoreMap.values();
         },
         signalById: function(id) {
            return this.dataStoreMap.get(id);
         },
         containsSignal: function(id) {
            return this.dataStoreMap.containsKey(id);
         },
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         addSignal: function(signal) {
            if (!(signal instanceof BooleanSignal))
               throw new TypeError("Universe: Expected 'BooleanSignal' object");

            // Update an element if it already exists
            this.dataStoreMap.put(signal.getId(), signal);
            this.calculateMaxLength(signal);
         },
         updateSignal: function(id, newSignal) {
            if (!(newSignal instanceof BooleanSignal))
               throw new TypeError("Universe: Expected 'BooleanSignal' object");

            this.dataStoreMap.put(id, newSignal);
            this.calculateMaxLength(newSignal);
         },
         removeSignal: function(id) {
            var removed = this.dataStoreMap.remove(id);
            if (removed) {
               this.length = [0, 1];
               var that = this;
               this.dataStoreMap.each(function(key, s, i) {
                  that.calculateMaxLength(s);
               });
            }
         },
         calculateMaxLength: function(s) {
            if (s.getFixedPartLength() > this.length[0]) {
               this.length[0] = s.getFixedPartLength();
            }
            this.length[1] = (s.getPeriodicPartLength() * this.length[1])
                     / Util.gcd(s.getPeriodicPartLength(), this.length[1]);
         },
         clearReferences: function() {
            this.dataStoreMap.each(function(key, s, i) {
               s.setReferringTemporalFormulasIds([]);
            });
         },
         clear: function() {
            this.dataStoreMap.clear();
            this.length = [0, 1];
         }
};