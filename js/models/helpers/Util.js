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
                        "#000000", "#FF0000", "#2CB050"]
      };
   }

   if (Singleton.prototype.instance) { return Singleton.prototype.instance; }
   Singleton.prototype.instance = new Singleton();

   return Singleton.prototype.instance;
}();