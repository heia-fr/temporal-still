/**
 * This class represents a data structure using the concept of Map. The elements
 * stored are of nature (key, value). Multiple values are not allowed
 */
function Map(other) {
   if (!other) {
      this.mapKeys = [];
      this.data = {};
   } else {
      this.mapKeys = other.mapKeys;
      this.data = {};
      var len = this.mapKeys.length;
      for (var i = 0; i < len; ++i) {
         var k = this.mapKeys[i];
         var obj = null;
         if (typeof other.data[k] === 'object') {
            if (other.data[k].__type === 'BooleanSignal') {
               obj = new BooleanSignal(undefined, other.data[k]);
            } else if (other.data[k].__type === 'TemporalFormula') {
               obj = new TemporalFormula(undefined, undefined, undefined, undefined, other.data[k]);
            } else {
               obj = {};
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
          * creates entry with the provided (key, value) if it doesn't exist.
          * Otherwise, the new value replaces the old one with the same key. The
          * returned value is this Map object to permit chained calls
          * 
          * @param key
          * @param value
          * @returns {Map}
          */
         put: function(key, value) {
            if (!this.containsKey(key)) {
               this.mapKeys.push(key);
            }
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
            if (this.containsKey(key)) {
               this.mapKeys = _.without(this.mapKeys, key);
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
            var len = this.mapKeys.length;
            var entrys = new Array(len);
            for (var i = 0; i < len; i++) {
               var k = this.mapKeys[i];
               entrys[i] = {
                        key: k,
                        value: this.data[k]
               };
            }
            return entrys;
         },
         /**
          * Checks whether this map is empty
          * 
          * @returns {Boolean}
          */
         isEmpty: function() {
            return (this.mapKeys.length == 0);
         },
         /**
          * Returns the number of entries in this map
          * 
          * @returns {Number}
          */
         size: function() {
            console.log("yes I'm here");
            return this.mapKeys.length;
         },
         /**
          * Checks whether this Map contains an entry with the specified key
          * 
          * @param key
          * @returns {Boolean}
          */
         containsKey: function(key) {
            return _.includes(this.mapKeys, key);
         },
         /**
          * Returns an array containing the keys of this Map
          * 
          * @returns {Array}
          */
         keys: function() {
            return this.mapKeys.slice(0); // clone the keys array
         },
         /**
          * Returns an array containing the values of this Map
          * 
          * @returns {Array}
          */
         values: function() {
            var len = this.mapKeys.length;
            var vals = new Array(len);
            for (var i = 0; i < len; i++) {
               var key = this.mapKeys[i];
               vals[i] = this.data[key];
            }
            return vals;
         },
         /**
          * Provides a method to iterate over entries of this Map (key, value,
          * index). A callback function must be provided by the user. The
          * returned value is this Map object to permit chained calls
          * 
          * @param func
          * @returns {Map}
          */
         each: function(func) {
            if (typeof func !== 'function') { return; }
            var len = this.mapKeys.length;
            for (var i = 0; i < len; i++) {
               var k = this.mapKeys[i];
               func(k, this.data[k], i);
            }
            return this;
         },
         /**
          * This method clears the map completely
          */
         clear: function() {
            this.mapKeys = [];
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
            if (this.mapKeys.length != other.mapKeys.length) return false;
            var e = this.mapKeys.every(function(element, index) {
               return element === other.mapKeys[index];
            });
            if (!e) return false;
            return (JSON.stringify(this.data) === JSON.stringify(other.data));
         }
};