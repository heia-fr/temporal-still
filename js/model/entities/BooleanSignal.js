function BooleanSignal(expressionString) {
   if (typeof expressionString != "string") throw new TypeError("Expected 'String' object");
   this.id = "";
   this.body = "";
   this.period = "";
   this.periodStartIndex = 0;
   this.values = [];

   var parts = expressionString.trim().split("=");
   this.id = parts[0].trim();

   var signal = parts[1].split("/");
   this.body = signal[0].trim();
   this.period = signal[1].trim();
}

BooleanSignal.prototype = {
         constructor: BooleanSignal,
         getId: function() {
            return this.id;
         },
         getFixedPartLength: function() {
            return this.body.length;
         },
         getPeriodicPartLength: function() {
            return this.period.length;
         },
         updateFixedPart: function(len) {
            var i;
            for (i = 0; i < len - this.getFixedPartLength(); ++i) {
               this.body += this.period.charAt(i % this.period.length);
            }
            this.periodStartIndex = i % this.period.length;
         },
         updatePeriodicPart: function(len) {
            var i;
            var newPeriod = "";
            for (i = 0, j = this.periodStartIndex; i < len; ++i, ++j) {
               newPeriod += this.period.charAt(j % this.period.length);
            }
            this.period = newPeriod;
         },
         calculateChartValues: function(/* TODO: parameters here */) {
            var x = 0;
            var nextX = 1;
            var oldZ = parseInt(this.body.charAt(0));
            var z;

            this.values.push([x, oldZ]);
            this.values.push([nextX, oldZ]);

            var that = this;
            _.times(that.body.length - 1, function(i) {
               x = i + 1;
               nextX = i + 2;
               z = parseInt(that.body.charAt(i + 1));
               if (z != oldZ) {
                  that.values.push([x, z]);
               }
               that.values.push([nextX, z]);
               oldZ = z;
            });

            // TODO: to be modified
            _.times(that.period.length, function(i) {
               x = that.body.length + i;
               nextX = that.body.length + i + 1;
               z = parseInt(that.period.charAt(i));
               if (z != oldZ) {
                  that.values.push([x, z]);
               }
               that.values.push([nextX, z]);
               oldZ = z;
            });
         },
         getChartData: function() {
            return this.values;
         }
};