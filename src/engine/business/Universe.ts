import { gcd } from 'src/engine/helpers';
import { BooleanSignal, TemporalEntity, TemporalFormula } from 'src/engine/entities';
import { TemporalEntityInterpreter } from 'src/engine/analysers';
import { minimize } from './Minimize';

function recursiveDependencies(universe: Universe, entity: TemporalEntity): any {
    const itr: any = (() => {
        while (itr.queue.length > 0) {
            const currentId = itr.queue.shift();

            if (itr.done.indexOf(currentId) >= 0) continue;
            itr.done.push(currentId);

            const current = universe.getEntity(currentId);
            if (!current) continue;
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
export class Universe {

    public readonly __type = 'Universe';

    private readonly dataStoreMap: Map<string, TemporalEntity>;
    private length: [number, number];

    constructor(other: Universe | null = null) {
        if (!other) {
            this.dataStoreMap = new Map();
            this.length = [0, 1];
        } else {
            if (!(other instanceof Object) || other.__type !== 'Universe') {
                throw new TypeError('Universe: Expected other to be a "Universe" object');
            }

            this.dataStoreMap = new Map(other.dataStoreMap);
            this.length = other.length;
        }
    }

    /**
     * The length of the universe (fixed length and periodic length)
     */
    getLength(): [number, number] {
        return this.length;
    }

    /**
     * Returns an array of all the temporal entities IDs
     */
    getIds(): string[] {
        return [...this.dataStoreMap.keys()];
    }

    /**
     * Returns an array of all the temporal entities
     */
    getEntities(): TemporalEntity[] {
        return [...this.dataStoreMap.values()];
    }

    /**
     * Returns a temporal entity with an id matching the provided one
     *
     * @param id an ID of enitity to fetch
     */
    getEntity(id: string): TemporalEntity | undefined {
        return this.dataStoreMap.get(id);
    }

    getEntityOrThrow(id: string): TemporalEntity {
        const entity = this.getEntity(id);
        if (!entity) {
            throw new Error('TemporalEntity "' + id + '" doesn\'t exist');
        }
        return entity;
    }

    /**
     * Checks whether a temporal entity with the provided ID
     * exists in the universe
     *
     * @param id of the temporal entity to check
     */
    containsEntity(id: string): boolean {
        return this.dataStoreMap.has(id);
    }

    /**
     * Checks whether this universe is empty
     */
    isEmpty(): boolean {
        return this.dataStoreMap.size === 0;
    }

    /**
     * Adds a temporal entity to the universe. The length of this later
     * is updated accordingly
     *
     * @param entity is a TemporalEntity object to add to the universe.
     *        if a object with the same ID exists, it gets overridden
     *        by the new one.
     */
    putEntity(entity: TemporalEntity): void {
        const entityId = entity.getId();

        const next = recursiveDependencies(this, entity);
        let value;
        while ((value = next()) != null) {
            if (value[0] === entityId) {
                throw new TypeError('Universe: Entity must not depend on itself (directly or indirectly)');
            }
        }

        const oldEntity = this.getEntity(entityId);
        if (oldEntity) {
            // Move References to Old to New entity
            entity.setReferencedBy(oldEntity.getReferencedBy());

            // Remove References from Old to others
            for (const id of oldEntity.getReferences()) {
                const other = this.getEntity(id);
                if (other) other.removeReferencedBy(entityId);
            }
        }

        this.dataStoreMap.set(entityId, entity);

        // Add References from New to others
        for (const id of entity.getReferences()) {
            const other = this.getEntity(id);
            if (other) other.addReferencedBy(entityId);
        }

        this.calculateMaxLength(entity);
    }

    /**
     * Removes a temporal entity from the universe. The length of this later
     * is updated accordingly
     *
     * @param id is the ID of the temporal entity to remove
     */
    removeEntity(id: string): void {
        const entity = this.getEntity(id);
        if (!entity) return;

        if (entity.getReferencedBy().length > 0) {
            throw new TypeError('Universe: Entity referenced by other entities');
        }

        // Remove entity
        this.dataStoreMap.delete(id);

        // Remove references from the entity
        for (const rid of entity.getReferences()) {
            const other = this.getEntity(rid);
            if (other) other.removeReferencedBy(id);
        }

        this.recalculateMaxLength();
    }

    /**
     * Clears the universe and resets the initial state
     */
    clear(): void {
        this.dataStoreMap.clear();
        this.length = [0, 1];
    }

    /**
     * Get all the direct and indirect dependencies
     * of the entity passed in parameter
     *
     * @param entity the TemporalEntity or id of the entity
     */
    getAllDependencies(entity: TemporalEntity | string): string[] {
        if (typeof entity === 'string') {
            const tmp = this.getEntity(entity);
            if (!tmp) return [];
            entity = tmp;
        }
        const next = recursiveDependencies(this, entity);
        while (next() != null) { }
        return next.done;
    }

    /**
     * Reevaluate all entities in the universe
     */
    reevaluateAllEntities(todo: string[] | null = null): void {
        if (!todo) todo = this.getIds();
        const done: string[] = [];

        for (const entityId of todo) {
            this.reevaluateChildrenAndEntity(entityId, done);
        }
    }

    /**
     * Reevaluate an entity and all it's children entities
     * (direct and indirect)
     */
    reevaluateChildrenAndEntity(entityId: string, done: string[]): void {
        if (!done) done = [];
        if (done.indexOf(entityId) >= 0) return;
        done.push(entityId);

        const entity = this.getEntity(entityId);
        if (!entity) return;
        const references = entity.getReferences();

        for (const reference of references) {
            this.reevaluateChildrenAndEntity(reference, done);
        }

        const tf = TemporalEntityInterpreter.evaluate(entity.getContent(), this);
        if (tf) this.putEntity(tf);
    }

    /**
     * Recalculate the max length of the universe for every signals
     */
    recalculateMaxLength(): void {
        this.length = [0, 1];
        for (const value of this.dataStoreMap.values()) {
            this.calculateMaxLength(value);
        }
    }

    /**
     *
     * @param s is the boolean signal used to recalculate
     * the lengths of the universe
     */
    calculateMaxLength(s: TemporalEntity): void {
        if (s instanceof TemporalFormula) {
            s = s.getAssociatedSignal();
        }
        if (!(s instanceof BooleanSignal)) {
            return;
        }
        if (s.getFixedPartLength() > this.length[0]) {
            this.length[0] = s.getFixedPartLength();
        }
        this.length[1] = s.getPeriodicPartLength()
            * (this.length[1] / gcd(s.getPeriodicPartLength(), this.length[1]));
    }

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
    minimize(): void {
        const entities = this.getEntities();
        if (entities.length === 0) return;

        // Compute minimized signals for the universe
        const signals = minimize(entities, this.getLength());

        // Reset universe length to minimum
        this.length = [0, 1];

        // Overwrite old signals with minified ones
        for (const signal of signals) {
            this.putEntity(signal);
        }

        // Recompute formula and universe length
        this.reevaluateAllEntities();
    }

    toJSON(): object {
        const copy: any = Object.assign({}, this);
        copy.dataStoreMap = [...copy.dataStoreMap];
        return copy;
    }
}
