import _random from 'lodash/random';
import { Symbols, Util, inheritPrototype } from 'src/engine/helpers';
import TemporalEntity from './TemporalEntity';

function removeItem(arr, value) {
   for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === value) arr.splice(i, 1);
   }
}

/**
 * This class represents a Boolean Signal. The user must provide a string with a
 * specific format. e.g. b = 1010/01 where: 1) 'b' is the boolean signal's
 * identifier 2) '1010' is the boolean signal's fixed part 3) '01' is the
 * boolean signal's periodic part if the parameter 'other' is provided, it must
 * be a valid boolean signal so the newly created object can copy the values of
 * its attributes. PRE: if provided, expressionString must be a valid
 * BooleanSignal string representation e.g. a = 100101/11 PRE: if provided,
 * other must be a valid BooleanSignal object
 *
 * @param string
 *           expressionString a string representation of a BooleanSignal
 * @param BooleanSignal
 *           other a valid BooleanSignal object
 */
function BooleanSignal(expressionString, other) {
   TemporalEntity.call(this, "", expressionString, other);

   if (!other) {
      this.content = this.content.trim();

      // holds the the start of the periodic part after extending the fixed part
      this.periodStartIndex = 0;

      var parts = this.content.split(Symbols.getEqual());
      this.id = parts[0].trim();

      var signal = parts[1].split(Symbols.getSlash());
      // the fixed part of the signal
      this.body = signal[0].trim();
      // the periodic part of the signal
      this.period = signal[1].trim();

   } else {
      if (!(other instanceof BooleanSignal) && other.__type != 'BooleanSignal')
         throw new TypeError("BooleanSignal: Expected other to be a 'BooleanSignal' object");
      this.body = other.body;
      this.period = other.period;
      this.periodStartIndex = other.periodStartIndex;
   }

   this.__type = 'BooleanSignal';
}
inheritPrototype(BooleanSignal, TemporalEntity);

BooleanSignal.prototype.minimizeSignal = function () {
   // 1) Simplify Period
   var period = Util.getMinRepeatedSubstring(this.period);

   // 2) Simplify Body
   var body = this.body;
   var len = body.length;
   while (body.endsWith(period, len)) {
      len -= period.length;
   }
   if (len == 0) {
      // We need at least one character
      body = period;
   } else {
      body = body.substr(0, len);
   }

   return new BooleanSignal(this.id + "=" + body + "/" + period);
}

BooleanSignal.prototype.getBody = function () {
   return this.body;
};

BooleanSignal.prototype.getPeriod = function () {
   return this.period;
};

BooleanSignal.prototype.getFixedPartLength = function () {
   return this.body.length;
};

BooleanSignal.prototype.getPeriodicPartLength = function () {
   return this.period.length;
};

// Override References methods as a signal doesn't depends on any other
BooleanSignal.prototype.getReferences = function () {
   return [];
};
BooleanSignal.prototype.setReferences = function (references) {
   throw new Error("BooleanSignal cannot have references")
};
BooleanSignal.prototype.hasReference = function (entityId) {
   return false;
};
BooleanSignal.prototype.addReference = function (entityId) {
   throw new Error("BooleanSignal cannot have references")
};
BooleanSignal.prototype.removeReference = function (entityId) {
   throw new Error("BooleanSignal cannot have references")
};

/**
 * this method calculates the new fixed part using the already
 * specified extension length. It must be called after
 * setFixedPartNewLength() method.
 *
 * @return the new fixed part with the extension added
 */
BooleanSignal.prototype.calculateUpdatedFixedPart = function (fixedPartNewLength) {
   var i;
   var newBody = this.body;
   // extending the fixed part so it matches the universe's length
   for (i = 0; i < fixedPartNewLength - this.body.length; ++i) {
      newBody += this.period.charAt(i % this.period.length);
   }
   // save the periodic part offset
   this.periodStartIndex = i % this.period.length;
   return newBody;
};

/**
 * this method calculates the new periodic part using the already
 * specified extension length. It must be called after
 * setPeriodicPartNewLength() method.
 *
 * @return the new periodic part with the extension added
 */
BooleanSignal.prototype.calculateUpdatedPeriodicPart = function (periodicPartNewLength) {
   // if the specified periodicPartNewLength is negative,
   // return what remains from the periodic part by taking into
   // account the offset periodStartIndex
   if (periodicPartNewLength <= 0) {
      return this.period.substring(this.periodStartIndex, this.period.length);
   }

   var newPeriod = Symbols.getEmpty();
   // calculate the new periodic part by using a round robin technique
   for (var i = 0, j = this.periodStartIndex; i < periodicPartNewLength; ++i, ++j) {
      newPeriod += this.period.charAt(j % this.period.length);
   }
   return newPeriod;
};

/**
 * this method calculates data to be used by the chart library in order
 * to display this boolean signal. The data is calculates such that
 * each bit of the signal is mapped to a segment of line, say two
 * points ([t0, val0], [t1, val1]). 1) t0, t1, t2, etc. represent the
 * ticks of the chart 2) val0, val1, val2, etc. represent the values of
 * the signal in each tick (0 or 1) For example, the bit 1 is the
 * signal 'a = 10/0' is represented as the couple of points ([0, 1],
 * [1, 1]) and the bit 0 that follows is represented as ([1, 0], [2,
 * 0])
 */
BooleanSignal.prototype.calculateChartValues = function (universeLength, legendLabel) {
   if (!(universeLength instanceof Array))
      throw new TypeError("BooleanSignal: Expected 'universeLength' to be an 'Array' object");
   if (universeLength.length != 2)
      throw new Error("BooleanSignal: Expected 'universeLength' length to be 2");

   var newBody = this.calculateUpdatedFixedPart(universeLength[0]);
   var newPeriod = this.calculateUpdatedPeriodicPart(universeLength[1]);

   var values = [];
   var x = 0;
   var nextX = 1;
   var oldZ = Number(newBody.charAt(0));
   var z = oldZ;

   values.push([x, oldZ]);
   values.push([nextX, oldZ]);

   // calculate points for the fixed part
   for (var i = 0, l = newBody.length - 1; i < l; i++) {
      x = i + 1;
      nextX = i + 2;
      z = Number(newBody.charAt(i + 1));
      // if (z != oldZ) {
      values.push([x, z]);
      // }
      values.push([nextX, z]);
      oldZ = z;
   }
   //put a mark to visually show the beginning of the periodic part
   values.push([newBody.length - 0.1, 0.5]);
   values.push([newBody.length + 0.1, 0.5]);
   values.push([newBody.length, z]);
   // calculate points for one period
   for (var i = 0, l = newPeriod.length; i < l; i++) {
      x = newBody.length + i;
      nextX = newBody.length + i + 1;
      z = Number(newPeriod.charAt(i));
      // if (z != oldZ) {
      values.push([x, z]);
      // }
      values.push([nextX, z]);
      oldZ = z;
   }

   var label = legendLabel || "Signal";
   this.signalChartData = [
      {
         "key": label + " " + this.getId(),
         "values": values,
         "color": Util.colors[_random(0, Util.colors.length - 1)]
      }
   ];
};

export default BooleanSignal;
