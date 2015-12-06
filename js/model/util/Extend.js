function createObject(obj) {
   function Clone() {
   }
   Clone.prototype = obj;
   return new Clone();
}

function inheritPrototype(subType, superType) {
   var clonedPrototype = createObject(superType.prototype);
   clonedPrototype.constructor = subType;
   subType.prototype = clonedPrototype;
}