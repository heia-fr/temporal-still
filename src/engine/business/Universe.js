import Util from '../helpers/Util';
import Map from './Map';
import BooleanSignal from '../entities/BooleanSignal';

/**
 * This class defines the universe regrouping all of the boolean signals
 * manipulated in the application. The universe updates itself every time a
 * boolean signal changes (added, updated or removed).
 *
 * @param other
 *           is a another object to copy from. if it's provided, it must be a
 *           valid Universe object.
 */
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
         /**
          * The length of the universe (fixed length and periodic length)
          *
          * @returns {Array}
          */
         getLength: function() {
            return this.length;
         },
         /**
          * Returns an array of all the boolean signals' IDs
          *
          * @returns {Array}
          */
         getSignalsIds: function() {
            return this.dataStoreMap.keys();
         },
         /**
          * Returns an array of all the boolean signals objects
          *
          * @returns {Array}
          */
         getSignals: function() {
            return this.dataStoreMap.values();
         },
         /**
          * Returns a boolean signal with an id matching the provided one
          *
          * @param id an ID of boolean signal to fetch
          * @returns {BooleanSignal}
          */
         signalById: function(id) {
            return this.dataStoreMap.get(id);
         },
         /**
          * Checks whether a boolean signal with the provided ID
          * exists in the universe
          *
          * @param id of the boolean signal to check
          * @returns {Boolean}
          */
         containsSignal: function(id) {
            return this.dataStoreMap.containsKey(id);
         },
         /**
          * Checks whether this universe is empty
          *
          * @returns {Boolean}
          */
         isEmpty: function() {
            return this.dataStoreMap.isEmpty();
         },
         /**
          * Adds a boolean signal to the universe. The length of this later
          * is updated accordingly
          *
          * @param signal is a BooleanSignal object to add to the universe.
          *        if a object with the same ID exists, it gets overridden
          *        by the new one.
          */
         addSignal: function(signal) {
            if (!(signal instanceof BooleanSignal))
               throw new TypeError("Universe: Expected 'BooleanSignal' object");

            // Update an element if it already exists
            this.dataStoreMap.put(signal.getId(), signal);
            this.calculateMaxLength(signal);
         },
         /**
          * Updates an existing boolean signal. The length of this later
          * is updated accordingly
          *
          * @param id is the id of the boolean signal to update
          * @param newSignal is a BooleanSignal object that overrides the old
          *        signal.
          */
         updateSignal: function(id, newSignal) {
            if (!(newSignal instanceof BooleanSignal))
               throw new TypeError("Universe: Expected 'newSignal' to be 'BooleanSignal' object");

            this.dataStoreMap.put(id, newSignal);
            this.calculateMaxLength(newSignal);
         },
         /**
          * Removes a boolean signal from the universe. The length of this later
          * is updated accordingly
          *
          * @param id is the ID of the boolean signal to remove
          */
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
         /**
          *
          * @param s is the boolean signal used to recalculate
          * the lengths of the universe
          */
         calculateMaxLength: function(s) {
            if (!(s instanceof BooleanSignal))
               throw new TypeError("Universe: Expected 's' to be a 'BooleanSignal' object");

            if (s.getFixedPartLength() > this.length[0]) {
               this.length[0] = s.getFixedPartLength();
            }
            this.length[1] = s.getPeriodicPartLength()
                     * (this.length[1] / Util.gcd(s.getPeriodicPartLength(), this.length[1]));
         },
         /**
          * Clears all of the referring temporal formulas arrays
          *
          */
         clearReferences: function() {
            this.dataStoreMap.each(function(key, s, i) {
               s.setReferringTemporalFormulasIds([]);
            });
         },
         /**
          * Clears the universe and resets the initial state
          */
         clear: function() {
            this.dataStoreMap.clear();
            this.length = [0, 1];
         }
};

export default Universe;
