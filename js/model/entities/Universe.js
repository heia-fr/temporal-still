function Universe() {
   this.dataStore = new Set();
   this.length = [0, 1];
}

Universe.prototype = {
         constructor: Universe,
         getLength: function() {
            return this.length;
         },
         getSignalsSet: function() {
            return this.dataStore;
         },
         addSignal: function(signal) {
            if (!(signal instanceof BooleanSignal))
               throw new TypeError("Expected 'BooleanSignal' object");

            var pgcd = function(p, q) {
               var r;
               while (q != 0) {
                  r = p % q;
                  p = q;
                  q = r;
               }
               return p;
            };

            this.dataStore.add(signal);
            if (signal.getFixedPartLength() > this.length[0]) {
               this.length[0] = signal.getFixedPartLength();
            }
            this.length[1] = (signal.getPeriodicPartLength() * this.length[1])
                     / pgcd(signal.getPeriodicPartLength(), this.length[1]);
            
            var that = this;
            this.dataStore.forEach(function(s) {
               s.updateFixedPart(that.length[0]);
               s.updatePeriodicPart(that.length[1]);
            });
         }
};