function Map(other) {
   if (typeof other === 'undefined') {
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
         put: function(key, value) {
            if (!this.contains(key)) { // typeof this.data[key] === 'undefined'
               this.mapKeys.push(key);
            }
            this.data[key] = value;
            return this;
         },
         remove: function(key) {
            // var i = this.keys.indexOf(key);
            // i != -1
            if (this.contains(key)) {
               this.mapKeys = _.without(this.mapKeys, key);
               // this.keys.splice(i, 1);
                delete this.data[key];
               return true;
            }
            return false;
         },
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
         isEmpty: function() {
            return (this.mapKeys.length == 0);
         },
         size: function() {
            return this.mapKeys.length;
         },
         contains: function(key) {
            return _.includes(this.mapKeys, key);// (this.data[key] !==
            // undefined);
         },
         keys: function() {
            return this.mapKeys.slice(0); // clone the keys array
         },
         values: function() {
            var len = this.mapKeys.length;
            var vals = new Array(len);
            for (var i = 0; i < len; i++) {
               var key = this.mapKeys[i];
               vals[i] = this.data[key];
            }
            return vals;
         },
         each: function(func) {
            if (typeof func !== 'function') { return; }
            var len = this.mapKeys.length;
            for (var i = 0; i < len; i++) {
               var k = this.mapKeys[i];
               func(k, this.data[k], i);
            }
            return this;
         },
         clear: function() {
            this.mapKeys = [];
            this.data = {};
         },
         equals: function(other) {
            if (!other) return false;
            if (!(other instanceof Map)) return false;
            if (this.mapKeys.length != other.keys.length) return false;
            var e = this.mapKeys.every(function(element, index) {
               return element === other.keys[index];
            });
            if (!e) return false;
            if (JSON.stringify(this.data) !== JSON.stringify(other.data)) return false;
            return true;
         }
};