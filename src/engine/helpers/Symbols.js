/**
 * This an utility class that provides a set of symbols used in this application
 */
var Symbols = function() {

   function Singleton() {

      var symbols = {
               empty: "",
               equal: "=",
               zero: "0",
               one: "1",
               slash: "/",
               openingBraket: "(",
               closingBraket: ")",
               openingSquareBracket: "[",
               closingSquareBracket: "]",
               lessThan: "<",
               greaterThan: ">",
               dash: "-",
               implies: "->",
               not: "!",
               eventually: "<>",
               next: "X",
               always: "[]",
               weakUntil: "W",
               and: "&",
               or: "|",
               prettyAnd: "&#8743;",
               prettyOr: "&#8744;",
               prettyAlways: "&#9723;",
               prettyEventually: "&#9674;",
               prettyNot: "&#172;",
               prettyImplies: "&#8594;",
               charSet: "abcdefghijklmnopqrstuvwxyz",
               tautology: "&#8872;",
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
               getDash: function() {
                  return symbols.dash;
               },
               getNot: function() {
                  return symbols.not;
               },
               getEventually: function() {
                  return symbols.eventually;
               },
               getNext: function() {
                  return symbols.next;
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
               },
               getImplies: function() {
                  return symbols.implies;
               },
               getPrettyAnd: function() {
                  return symbols.prettyAnd;
               },
               getPrettyOr: function() {
                  return symbols.prettyOr;
               },
               getPrettyAlways: function() {
                  return symbols.prettyAlways;
               },
               getPrettyEventually: function() {
                  return symbols.prettyEventually;
               },
               getPrettyNext: function() {
                  // Real pretty next: &#9711;
                  return symbols.next;
               },
               getPrettyImplies: function() {
                  return symbols.prettyImplies;
               },
               getPrettyNot: function() {
                  return symbols.prettyNot;
               },
               getCharSet: function() {
                  return symbols.charSet;
               },
               isUnaryOp: function(op) {
                  return (op === symbols.not || op === symbols.always || op === symbols.eventually);
               },
               isBinaryOp: function(op) {
                  return (op === symbols.and || op === symbols.or || op === symbols.weakUntil || op === symbols.implies);
               },
               isOperator: function(symbol) {
                  return (this.isUnaryOp(symbol) || this.isBinaryOp(symbol));
               }
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();

export default Symbols;
