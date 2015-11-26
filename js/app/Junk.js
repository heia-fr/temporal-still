
 var m = new Map();

 var n = new Map();

 console.log(m.equals(n));

 m.put(1, "One");
 m.put(2, "Two");
 m.put(3, "Three");
 m.put(4, new BooleanSignal("a = 10101/11"));

 n.put(1, "One");
 n.put(2, "Two");
 n.put(3, "Three");
 n.put(3, "Four");

n.forEach(function(s, k, i) {
   console.log(k + ", " + s + ", " + i);
});
 
// console.log(n.equals(m));

 n.put(4, "Four");

// console.log(n.equals(m));

var o = {
         "p1": "sdadada",
         "p2": 1022.2,
         "p3": [1, 2, 3, 4],
         "p4": {
                  id: 1,
                  name: "John"
         }
};