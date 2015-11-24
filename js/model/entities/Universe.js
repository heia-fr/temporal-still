function Universe() {
   this.dataStore = [];
   this.length = [0, 1];
}

Universe.prototype = {
         constructor: Universe,
         getLength: function() {
            return this.length;
         },
         getSignals: function() {
            return this.dataStore;
         },
         signalAt: function(index) {
            return this.dataStore[index];
         },
         addSignal: function(signal) {
            if (!(signal instanceof BooleanSignal))
               throw new TypeError("Expected 'BooleanSignal' object");

            this.dataStore.push(signal);
            if (signal.getFixedPartLength() > this.length[0]) {
               this.length[0] = signal.getFixedPartLength();
            }
            this.length[1] = (signal.getPeriodicPartLength() * this.length[1])
                     / this.pgcd(signal.getPeriodicPartLength(), this.length[1]);

            var that = this;
            this.dataStore.forEach(function(s) {
               s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(that.length[1]);
            });
         },
         updateSignal: function(index, newSignal) {
            if (!(newSignal instanceof BooleanSignal))
               throw new TypeError("Expected 'BooleanSignal' object");

            this.dataStore[index] = newSignal;
            if (newSignal.getFixedPartLength() > this.length[0]) {
               this.length[0] = newSignal.getFixedPartLength();
            }
            this.length[1] = (newSignal.getPeriodicPartLength() * this.length[1])
                     / this.pgcd(newSignal.getPeriodicPartLength(), this.length[1]);

            var that = this;
            this.dataStore.forEach(function(s) {
               s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(that.length[1]);
            });
         },
         removeSignal: function(index) {
            var signal = this.dataStore.splice(index, 1);
            this.length = [0, 1];
            var that = this;
            this.dataStore.forEach(function(s) {
               if (s.getFixedPartLength() > that.length[0]) {
                  that.length[0] = s.getFixedPartLength();
               }
               that.length[1] = (s.getPeriodicPartLength() * that.length[1])
                        / that.pgcd(s.getPeriodicPartLength(), that.length[1]);
            });

            this.dataStore.forEach(function(s) {
               s.setFixedPartNewLength(that.length[0] - s.getFixedPartLength());
               s.setPeriodicPartNewLength(that.length[1]);
            });
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