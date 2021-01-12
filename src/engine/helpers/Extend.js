/**
 * This function performs the inheritance of prototype process
 *
 * @param subType
 *           an object of the subclass
 * @param superType
 *           an object of the superclass
 */
function inheritPrototype(subType, superType) {
    var clonedPrototype = Object.create(superType.prototype);
    clonedPrototype.constructor = subType;
    subType.prototype = clonedPrototype;
}

export default inheritPrototype;
