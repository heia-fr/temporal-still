function BooleanSignal(expressionString) {
   if (typeof expressionString != "string") throw new TypeError("Expected 'String' object");
   this.id = ""; // the signal's name
   this.body = ""; // the fixed part of the signal
   this.period = ""; // the periodic part of the signal
   this.periodStartIndex = 0; // holds the the start of the periodic part after extending the fixed part
   this.fixedPartNewLength; // the extended fixed part length
   this.periodicPartNewLength; // the updated length of the periodic part
   this.values = []; // holds the data to be displayed (ex. [[0, 1], [1, 1], [1, 0], [2, 0], [3, 0]])

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
         setFixedPartNewLength: function(len) {
            this.fixedPartNewLength = len; 
         },
         setPeriodicPartNewLength: function(len) {
            this.periodicPartNewLength = len; 
         },
         calculateUpdatedFixedPart: function() {
            var i;
            var newBody = this.body;
            for (i = 0; i < this.fixedPartNewLength; ++i) {
               newBody += this.period.charAt(i % this.period.length);
            }
            this.periodStartIndex = i % this.period.length;
            return newBody;
         },
         calculateUpdatedPeriodicPart: function() {
            var i;
            var newPeriod = "";
            for (i = 0, j = this.periodStartIndex; i < this.periodicPartNewLength; ++i, ++j) {
               newPeriod += this.period.charAt(j % this.period.length);
            }
            return newPeriod;
         },
         calculateChartValues: function(/* TODO: parameters here */) {
            
            var newBody = this.calculateUpdatedFixedPart();
            var newPeriod = this.calculateUpdatedPeriodicPart();
            
            var x = 0;
            var nextX = 1;
            var oldZ = parseInt(newBody.charAt(0));
            var z;

            this.values.push([x, oldZ]);
            this.values.push([nextX, oldZ]);

            var that = this;
            _.times(newBody.length - 1, function(i) {
               x = i + 1;
               nextX = i + 2;
               z = parseInt(newBody.charAt(i + 1));
//               if (z != oldZ) {
                  that.values.push([x, z]);
//               }
               that.values.push([nextX, z]);
               oldZ = z;
            });

            // TODO: to be modified
            _.times(newPeriod.length, function(i) {
               x = newBody.length + i;
               nextX = newBody.length + i + 1;
               z = parseInt(newPeriod.charAt(i));
//               if (z != oldZ) {
                  that.values.push([x, z]);
//               }
               that.values.push([nextX, z]);
               oldZ = z;
            });
         },
         getChartData: function() {
            return this.values;
         }
};