import {
   BooleanSignal,
   TemporalFormula,
} from 'src/engine/entities';

/**
 * This class represents a data structure using the concept of Map. The elements
 * stored are of nature (key, value). Multiple values are not allowed. PRE: This
 * Implementation require lodash library
 */
function Map(other) {
   if (!other) {
      this.data = {};
   } else {
      if (!(other instanceof Object) || other.__type !== 'Map')
         throw new TypeError("Map: Expected 'other' to be a 'Map' object");
      this.data = {};
      for ( var k in other.data) {
         var obj = other.data[k];
         if (typeof obj === 'object') {
            if (obj.__type === 'BooleanSignal') {
               obj = new BooleanSignal(undefined, obj);
            } else if (obj.__type === 'TemporalFormula') {
               obj = new TemporalFormula(undefined, undefined, undefined, undefined, obj);
            }
         }
         this.data[k] = obj;
      }
   }

   this.__type = 'Map';
}

Map.prototype = {
         constructor: Map,
         get: function(key) {
            return this.data[key];
         },
         /**
          * Associates the specified value with the specified key in this map.
          * If the map previously contained a mapping for the key, the old value
          * is replaced.
          *
          * @param key
          * @param value
          * @returns {Map}
          */
         put: function(key, value) {
            this.data[key] = value;
            return this;
         },
         /**
          * Removes an entry with the specified key from this map. Returns true
          * if the removal is successful
          *
          * @param key
          * @returns {Boolean}
          */
         remove: function(key) {
            'use strict';
            if (this.containsKey(key)) {
               delete this.data[key];
               return true;
            }
            return false;
         },
         /**
          * Returns an array of objects. Each one contains two properties (key,
          * value) with there values
          *
          * @returns {Array}
          */
         entries: function() {
            var entrys = [];
            for ( var k in this.data) {
               entrys.push({
                        key: k,
                        value: this.data[k]
               });
            }
            return entrys;
         },
         /**
          * Checks whether this map is empty
          *
          * @returns {Boolean}
          */
         isEmpty: function() {
            return (Object.keys(this.data).length == 0);
         },
         /**
          * Returns the number of entries in this map
          *
          * @returns {Number}
          */
         size: function() {
            return Object.keys(this.data).length;
         },
         /**
          * Checks whether this Map contains an entry with the specified key
          *
          * @param key
          * @returns {Boolean}
          */
         containsKey: function(key) {
            return (this.get(key) !== undefined);
         },
         /**
          * Returns an array containing the keys of this Map
          *
          * @returns {Array}
          */
         keys: function() {
            return Object.keys(this.data).slice(0); // clone the keys array
         },
         /**
          * Returns an array containing the values of this Map
          *
          * @returns {Array}
          */
         values: function() {
            var vals = [];
            for ( var k in this.data) {
               vals.push(this.data[k]);
            }
            return vals;
         },
         /**
          * Provides a method to iterate over entries of this Map (key, value,
          * index). A callback function must be provided by the user. The
          * returned value is this Map object to permit chained calls. This
          * method does nothing if 'callback' parameter is not a function
          *
          * @param callback(key,
          *           value, index) is a function to apply to each element of
          *           the Map
          * @returns {Map}
          */
         each: function(callback) {
            if (typeof callback !== 'function') { return; }
            var i = 0;
            for ( var k in this.data) {
               callback(k, this.data[k], i);
               ++i;
            }
            return this;
         },
         /**
          * This method clears the map completely
          */
         clear: function() {
            this.data = {};
         },
         /**
          * Indicates whether some other Map object is "equal to" this one.
          *
          * @param other
          * @returns {Boolean}
          */
         equals: function(other) {
            if (!other) return false;
            if (!(other instanceof Map)) return false;
            if (this.size() != other.size()) return false;
            return (JSON.stringify(this.data) === JSON.stringify(other.data));
         }
};

export default Map;
