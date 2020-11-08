/**
 * This function makes a copy of the provided object
 *
 * @param obj
 *           is the object to clone
 * @returns {Clone} a copy of the provided object
 */
function createObject(obj) {
   function Clone() {
   }
   Clone.prototype = obj;
   return new Clone();
}

/**
 * This function performs the inheritance of prototype process
 *
 * @param subType
 *           an object of the subclass
 * @param superType
 *           an object of the superclass
 */
function inheritPrototype(subType, superType) {
   var clonedPrototype = createObject(superType.prototype);
   clonedPrototype.constructor = subType;
   subType.prototype = clonedPrototype;
}

export default inheritPrototype;
