import { Util } from 'src/engine/helpers';
import Map from './Map';
import { BooleanSignal, TemporalFormula } from 'src/engine/entities';
import { TemporalEntityInterpreter } from 'src/engine/analysers';
import { minimize } from './Minimize';

function recursiveDependencies(universe, entity) {
    var itr = (function() {
        while (itr.queue.length > 0) {
            var currentId = itr.queue.shift();

            if (itr.done.indexOf(currentId) >= 0) continue;
            itr.done.push(currentId);

            var current = universe.getEntity(currentId);
            itr.queue.push.apply(itr.queue, current.getReferences());

            return [currentId, current];
        }

        return null;
    });

    itr.queue = entity.getReferences().slice();
    itr.done = [];

    return itr;
}

/**
 * This class defines the universe regrouping all of the temporal entities
 * manipulated in the application. The universe updates itself every time a
 * temporal entity changes (added, updated or removed).
 *
 * @param other
 *           is a another object to copy from. if it's provided, it must be a
 *           valid Universe object.
 */
function Universe(other) {
    if (!other) {
        this.dataStoreMap = new Map();
        this.length = [0, 1];
    } else {
        if (!(other instanceof Object) || other.__type !== 'Universe')
            throw new TypeError("Universe: Expected other to be a 'Universe' object");

        this.dataStoreMap = new Map(other.dataStoreMap);
        this.length = other.length;
    }

    this.__type = 'Universe';
}

Universe.prototype = {
    constructor: Universe,
    /**
     * The length of the universe (fixed length and periodic length)
     *
     * @returns {Array}
     */
    getLength: function () {
        return this.length;
    },
    /**
     * Returns an array of all the temporal entities IDs
     *
     * @returns {Array}
     */
    getIds: function () {
        return this.dataStoreMap.keys();
    },
    /**
     * Returns an array of all the temporal entities
     *
     * @returns {Array}
     */
    getEntities: function () {
        return this.dataStoreMap.values();
    },
    /**
     * Returns a temporal entity with an id matching the provided one
     *
     * @param id an ID of enitity to fetch
     * @returns {BooleanSignal | TemporalFormula}
     */
    getEntity: function (id) {
        return this.dataStoreMap.get(id);
    },
    /**
     * Checks whether a temporal entity with the provided ID
     * exists in the universe
     *
     * @param id of the temporal entity to check
     * @returns {Boolean}
     */
    containsEntity: function (id) {
        return this.dataStoreMap.containsKey(id);
    },
    /**
     * Checks whether this universe is empty
     *
     * @returns {Boolean}
     */
    isEmpty: function () {
        return this.dataStoreMap.isEmpty();
    },
    /**
     * Adds a temporal entity to the universe. The length of this later
     * is updated accordingly
     *
     * @param signal is a TemporalEntity object to add to the universe.
     *        if a object with the same ID exists, it gets overridden
     *        by the new one.
     */
    putEntity: function (entity) {
        var entityId = entity.getId();

        var next = recursiveDependencies(this, entity);
        var value;
        while ((value = next()) != null) {
            if (value[0] == entityId) {
                throw new TypeError("Universe: Entity must not depend on itself (directly or indirectly)");
            }
        }

        if (this.dataStoreMap.containsKey(entityId)) {
            var oldEntity = this.getEntity(entityId);
            // Move References to Old to New entity
            entity.setReferencedBy(oldEntity.getReferencedBy());

            // Remove References from Old to others
            for (var id of oldEntity.getReferences()) {
                var other = this.getEntity(id);
                if (other) other.removeReferencedBy(entityId);
            }
        }

        this.dataStoreMap.put(entityId, entity);

        // Add References from New to others
        for (var id of entity.getReferences()) {
            var other = this.getEntity(id);
            if (other) other.addReferencedBy(entityId);
        }

        this.calculateMaxLength(entity);
    },
    /**
     * Removes a temporal entity from the universe. The length of this later
     * is updated accordingly
     *
     * @param id is the ID of the temporal entity to remove
     */
    removeEntity: function (id) {
        var entity = this.getEntity(id);
        if (!entity) return;

        if (entity.getReferencedBy().length > 0)
            throw new TypeError("Universe: Entity referenced by other entities");

        // Remove entity
        this.dataStoreMap.remove(id);

        // Remove references from the entity
        for (var rid of entity.getReferences()) {
            var other = this.getEntity(rid);
            if (other) other.removeReferencedBy(id);
        }

        this.recalculateMaxLength();
    },
    /**
     * Clears the universe and resets the initial state
     */
    clear: function () {
        this.dataStoreMap.clear();
        this.length = [0, 1];
    },
    /**
     * Get all the direct and indirect dependencies
     * of the entity passed in parameter
     *
     * @param entity the TemporalEntity or id of the entity
     */
    getAllDependencies: function (entity) {
        if (typeof entity === "string") entity = this.getEntity(entity);
        var next = recursiveDependencies(this, entity);
        while (next() != null) {}
        return next.done;
    },
    /**
     * Reevaluate all entities in the universe
     */
    reevaluateAllEntities: function(todo) {
        if (!todo) todo = this.getIds();
        var done = [];

        for (var entityId of todo) {
            this.reevaluateChildrenAndEntity(entityId, done);
        }
    },
    /**
     * Reevaluate an entity and all it's children entities
     * (direct and indirect)
     */
    reevaluateChildrenAndEntity: function(entityId, done) {
        if (!done) done = [];
        if (done.indexOf(entityId) >= 0) return;
        done.push(entityId);

        var entity = this.getEntity(entityId);
        var references = entity.getReferences();

        for (var reference of references) {
            this.reevaluateChildrenAndEntity(reference, done);
        }

        let tf = TemporalEntityInterpreter.evaluate(entity.getContent(), this);
        if (tf) this.putEntity(tf);
    },
    /**
     * Recalculate the max length of the universe for every signals
     */
    recalculateMaxLength: function () {
        this.length = [0, 1];
        var that = this;
        this.dataStoreMap.each(function (key, s, i) {
            that.calculateMaxLength(s);
        });
    },
    /**
     *
     * @param s is the boolean signal used to recalculate
     * the lengths of the universe
     */
    calculateMaxLength: function (s) {
        if (s instanceof TemporalFormula) {
            s = s.getAssociatedSignal();
        }

        if (s.getFixedPartLength() > this.length[0]) {
            this.length[0] = s.getFixedPartLength();
        }
        this.length[1] = s.getPeriodicPartLength()
            * (this.length[1] / Util.gcd(s.getPeriodicPartLength(), this.length[1]));
    },
    /**
     * Minimize the universe. The resulting universe has only one
     * step between each transition while keeping the correction
     * transitions order.
     *
     * Warning: This method modify the current Universe and the
     * state cannot be reverted.
     *
     * For example:
     * - Signal #1: 0110011/1
     * - Signal #2: 0111000/0
     * Will become:
     * - Signal #1: 01001/1
     * - Signal #2: 01100/0
     */
    minimize: function() {
        // Compute minimized signals for the universe
        var signals = minimize(this.getEntities(), this.getLength());

        // Reset universe length to minimum
        this.length = [0, 1];

        // Overwrite old signals with minified ones
        for (let signal of signals) {
            this.putEntity(signal);
        }

        // Recompute formula and universe length
        this.reevaluateAllEntities();
    }
};

export default Universe;
