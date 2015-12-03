var Symbols = function() {

   function Singleton() {

      var symbols = {
               empty: "",
               equal: "=",
               zero: "0",
               one: "1",
               slash: "/",
               semiColon: ";",
               openingBraket: "(",
               closingBraket: ")",
               openingSquareBracket: "[",
               closingSquareBracket: "]",
               lessThan: "<",
               greaterThan: ">",
               not: "!",
               eventually: "<>",
               always: "[]",
               weakUntil: "W",
               and: "&",
               or: "|"
      };

      return {
               getEmpty: function() {
                  return symbols.empty;
               },
               getEqual: function() {
                  return symbols.equal;
               },
               getZero: function() {
                  return symbols.zero;
               },
               getOne: function() {
                  return symbols.one;
               },
               getSlash: function() {
                  return symbols.slash;
               },
               getSemiColon: function() {
                  return symbols.semiColon;
               },
               getOpeningBraket: function() {
                  return symbols.openingBraket;
               },
               getClosingBraket: function() {
                  return symbols.closingBraket;
               },
               getOpeningSquareBraket: function() {
                  return symbols.openingSquareBracket;
               },
               getClosingSquareBraket: function() {
                  return symbols.closingSquareBracket;
               },
               getLessThan: function() {
                  return symbols.lessThan;
               },
               getGreaterThan: function() {
                  return symbols.greaterThan;
               },
               getNot: function() {
                  return symbols.not;
               },
               getEventually: function() {
                  return symbols.eventually;
               },
               getAlways: function() {
                  return symbols.always;
               },
               getWeakUntil: function() {
                  return symbols.weakUntil;
               },
               getAnd: function() {
                  return symbols.and;
               },
               getOr: function() {
                  return symbols.or;
               }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();