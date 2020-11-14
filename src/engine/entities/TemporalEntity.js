/**
 * This class defines a Temporal entity
 *
 * @param id
 *           the identifier of the temporal entity
 * @param content
 *           the string representation of the entity
 * @param other
 *           an other TemporalEntity to clone
 */
function TemporalEntity(id, content, other) {
    if (!other) {
        if (typeof id !== "string")
            throw new TypeError("TemporalEntity: Expected 'id' to be 'String' object");
        if (typeof content !== "string")
            throw new TypeError("TemporalEntity: Expected 'content' to be 'String' object");

        this.id = id;
        this.content = content;
        this.editable = false;
        this.references = [];
        this.referencedBy = [];
        this.signalChartData = [];

    } else {
        this.id = other.id;
        this.content = other.content;
        this.editable = other.editable;
        this.references = other.references;
        this.referencedBy = other.referencedBy;
        this.signalChartData = other.signalChartData;
    }

    this.__type = 'TemporalEntity';
}

TemporalEntity.prototype = {
    constructor: TemporalEntity,
    getId: function () {
        return this.id;
    },
    getContent: function () {
        return this.content;
    },
    isEditorEnabled: function () {
        return this.editable;
    },
    setEditorEnabled: function (enabled) {
        this.editable = enabled;
    },
    calculateChartValues: function (universeLength, legendLabel) {
        throw new Error("Not implemented method");
    },
    getChartData: function () {
        return this.signalChartData;
    },

    // Manage references from me
    getReferences: function () {
        return this.references;
    },
    setReferences: function (references) {
        this.references = references;
    },
    hasReference: function (entityId) {
        if (entityId == null)
            return this.references.length > 0;
        return this.references.indexOf(entityId) >= 0;
    },
    addReference: function (entityId) {
        if (this.references.indexOf(entityId) === -1)
            this.references.push(entityId);
    },
    removeReference: function (entityId) {
        var index = this.references.indexOf(entityId);
        if (index !== -1) this.references.splice(index, 1);
    },

    // Manage references to me
    getReferencedBy: function () {
        return this.referencedBy;
    },
    setReferencedBy: function (referencedBy) {
        this.referencedBy = referencedBy;
    },
    isReferenced: function () {
        return this.referencedBy.length > 0;
    },
    isReferencedBy: function (entityId) {
        return this.referencedBy.indexOf(entityId) >= 0;
    },
    addReferencedBy: function (entityId) {
        if (this.referencedBy.indexOf(entityId) === -1)
            this.referencedBy.push(entityId);
    },
    removeReferencedBy: function (entityId) {
        var index = this.referencedBy.indexOf(entityId);
        if (index !== -1) this.referencedBy.splice(index, 1);
    },
};

export default TemporalEntity;
