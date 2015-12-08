
var o = {
         "p1": "sdadada",
         "p2": 1022.2,
         "p3": [1, 2, 3, 4],
         "p4": {
                  id: 1,
                  name: "John"
         }
};
console.log(o);
_.omit(o, 'p2');
console.log(o);