/**
 * This class offers some utilities used across the application.
 */
var Util = function() {

   function Singleton() {

      return {
               /**
                * This method calculates the greatest common divider of two
                * positive integer values using The Euclidean Algorithm PRE: p
                * and q must be positive integer values
                * 
                * @param number
                *           p is the first positive integer value
                * @param number
                *           q is the second positive integer value
                */
               gcd: function(p, q) {
                  var r;
                  while (q != 0) {
                     r = p % q;
                     p = q;
                     q = r;
                  }
                  return p;
               },
               /**
                * This is a set of hex web colors used to color boolean charts
                */
               colors: ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#2ECC40",
                        "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#85144b", "#5B3822",
                        "#F012BE", "#B10DC9", "#2B0F0E", "#111111", "#AAAAAA", "#3F5D7D",
                        "#927054", "#00FF00", "#279B61", "#008AB8", "#993333", "#CC3333",
                        "#006495", "#004C70", "#0093D1", "#F2635F", "#F4D00C", "#E0A025",
                        "#0000FF", "#462066", "#FFB85F", "#FF7A5A", "#00AAA0", "#5D4C46",
                        "#7B8D8E", "#632528", "#3F2518", "#333333", "#FFCC00", "#669966",
                        "#993366", "#F14C38", "#144955", "#6633CC", "#EF34A2", "#FD9308",
                        "#462D44", "#3399FF", "#99D21B", "#B08749", "#FFA3D6", "#00D9FF",
                        "#000000", "#FF0000", "#2CB050"],
               ensureForEach: function() {
                  // ECMA-262, Edition 5, 15.4.4.18
                  // Reference: http://es5.github.io/#x15.4.4.18
                  if (!Array.prototype.forEach) {

                     Array.prototype.forEach = function(callback, thisArg) {
                        var T, k;
                        if (this == null) { throw new TypeError(' this equals null or undefined'); }

                        var O = Object(this);
                        var len = O.length >>> 0;
                        if (typeof callback !== "function") { throw new TypeError(callback
                                 + ' is not a fonction'); }

                        if (arguments.length > 1) {
                           T = thisArg;
                        }
                        k = 0;

                        while (k < len) {
                           var kValue;
                           if (k in O) {
                              kValue = O[k];
                              callback.call(T, kValue, k, O);
                           }
                           k++;
                        }
                     };
                  }
               },
               ensureEvery: function() {
                  // ECMA-262, Edition 5, 15.4.4.16
                  // Reference: http://es5.github.io/#x15.4.4.16
                  if (!Array.prototype.every) {
                     Array.prototype.every = function(callbackfn, thisArg) {
                        'use strict';
                        var T, k;

                        if (this == null) { throw new TypeError('this equals null or undefined'); }

                        var O = Object(this);
                        var len = O.length >>> 0;

                        if (typeof callbackfn !== 'function') { throw new TypeError(); }

                        if (arguments.length > 1) {
                           T = thisArg;
                        }

                        k = 0;

                        while (k < len) {
                           var kValue;

                           if (k in O) {
                              kValue = O[k];
                              var testResult = callbackfn.call(T, kValue, k, O);
                              if (!testResult) { return false; }
                           }
                           k++;
                        }
                        return true;
                     };
                  }
               }

      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();