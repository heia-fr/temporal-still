function Universe(other) {
   if (typeof other === 'undefined') {
      this.dataStoreMap = new Map();
      this.length = [0, 1];
   } else {
      if (other.dataStoreMap.__type === 'Map') {
         this.dataStoreMap = new Map(other.dataStoreMap);
      } else {
         this.dataStoreMap = new Map();
      }
      this.length = other.length;
   }

   this.__type = 'Universe';
}

Universe.prototype = {
         constructor: Universe,
         getLength: function() {
            return this.length;
         },
         getSignals: function() {
            return this.dataStoreMap.values();
         },
         signalById: function(id) {
            return this.dataStoreMap.get(id);
         },
         containsSignal: function(id) {
            return this.dataStoreMap.contains(id);
         },
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         addSignal: function(signal) {
            if (!(signal instanceof BooleanSignal))
               throw new TypeError("Expected 'BooleanSignal' object");

            // Update an element if it already exists in the map
            this.dataStoreMap.put(signal.getId(), signal);
            if (signal.getFixedPartLength() > this.length[0]) {
               this.length[0] = signal.getFixedPartLength();
            }
            this.length[1] = (signal.getPeriodicPartLength() * this.length[1])
                     / this.pgcd(signal.getPeriodicPartLength(), this.length[1]);

            var that = this;
            this.dataStoreMap.each(function(key, s, i) {
               s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(that.length[1]);
            });
         },
         updateSignal: function(id, newSignal) {
            if (!(newSignal instanceof BooleanSignal))
               throw new TypeError("Expected 'BooleanSignal' object");

            this.dataStoreMap.put(id, newSignal);
            if (newSignal.getFixedPartLength() > this.length[0]) {
               this.length[0] = newSignal.getFixedPartLength();
            }
            this.length[1] = (newSignal.getPeriodicPartLength() * this.length[1])
                     / this.pgcd(newSignal.getPeriodicPartLength(), this.length[1]);

            var that = this;
            this.dataStoreMap.each(function(key, s, i) {
               s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(that.length[1]);
            });
         },
         removeSignal: function(id) {
            var removed = this.dataStoreMap.remove(id);
            if (removed) {
               this.length = [0, 1];
               var that = this;
               this.dataStoreMap.each(function(key, s, i) {
                  if (s.getFixedPartLength() > that.length[0]) {
                     that.length[0] = s.getFixedPartLength();
                  }
                  that.length[1] = (s.getPeriodicPartLength() * that.length[1])
                           / that.pgcd(s.getPeriodicPartLength(), that.length[1]);
               });

               this.dataStoreMap.each(function(key, s, i) {
                  s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
                  s.setPeriodicPartNewLength(that.length[1]);
               });
            }
         },
         pgcd: function(p, q) {
            var r;
            while (q != 0) {
               r = p % q;
               p = q;
               q = r;
            }
            return p;
         }
};