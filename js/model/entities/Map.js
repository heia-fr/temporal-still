function Map(other) {
   if (typeof other === 'undefined') {
      this.keys = [];
      this.data = {};
   } else {
      this.keys = other.keys;
      this.data = {};
      var len = this.keys.length;
      for (var i = 0; i < len; ++i) {
         var k = this.keys[i];
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
               this.keys.push(key);
            }
            this.data[key] = value;
            return this;
         },
         remove: function(key) {
            // var i = this.keys.indexOf(key);
            // i != -1
            if (this.contains(key)) {
               this.keys = _.without(this.keys, key);
               // this.keys.splice(i, 1);
                delete this.data[key];
               return true;
            }
            return false;
         },
         entries: function() {
            var len = this.keys.length;
            var entrys = new Array(len);
            for (var i = 0; i < len; i++) {
               var k = this.keys[i];
               entrys[i] = {
                        key: k,
                        value: this.data[k]
               };
            }
            return entrys;
         },
         isEmpty: function() {
            return (this.keys.length == 0);
         },
         size: function() {
            return this.keys.length;
         },
         contains: function(key) {
            return _.includes(this.keys, key);// (this.data[key] !==
            // undefined);
         },
         keys: function() {
            return this.keys.slice(0); // clone the keys array
         },
         values: function() {
            var len = this.keys.length;
            var vals = new Array(len);
            for (var i = 0; i < len; i++) {
               var key = this.keys[i];
               vals[i] = this.data[key];
            }
            return vals;
         },
         each: function(func) {
            if (typeof func !== 'function') { return; }
            var len = this.keys.length;
            for (var i = 0; i < len; i++) {
               var k = this.keys[i];
               func(k, this.data[k], i);
            }
            return this;
         },
         equals: function(other) {
            if (!other) return false;
            if (!(other instanceof Map)) return false;
            if (this.keys.length != other.keys.length) return false;
            var e = this.keys.every(function(element, index) {
               return element === other.keys[index];
            });
            if (!e) return false;
            if (JSON.stringify(this.data) !== JSON.stringify(other.data)) return false;
            return true;
         }
};