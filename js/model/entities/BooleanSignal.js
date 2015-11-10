function BooleanSignal(expressionString) {
   if (typeof expressionString != "string")
      throw new TypeError("'expressionString' is expected to be a String object");
   this.expressionString = expressionString.trim();
   this.id = "";
   this.values = [];

   var parts = this.expressionString.split("=");
   var signal = parts[1].split("/");

   this.id = parts[0].trim();

   var body = signal[0].trim();
   var period = signal[1].trim();

   var x = 0;
   var nextX = 1;
   var oldZ = parseInt(body.charAt(0));
   var z;

   this.values.push([x, oldZ]);
   this.values.push([nextX, oldZ]);

   var that = this;
   _.times(body.length - 1, function(i) {
      x = i + 1;
      nextX = i + 2;
      z = parseInt(body.charAt(i + 1));
      if (z != oldZ) {
         that.values.push([x, z]);
      }
      that.values.push([nextX, z]);
      oldZ = z;
   });

   _.times(period.length, function(i) {
      x = body.length + i;
      nextX = body.length + i + 1;
      z = parseInt(period.charAt(i));
      if (z != oldZ) {
         that.values.push([x, z]);
      }
      that.values.push([nextX, z]);
      oldZ = z;
   });
}

BooleanSignal.prototype = {
         constructor: BooleanSignal,
         getData: function() {
            return this.values;
         },
         getId: function() {
            return this.id;
         }
};