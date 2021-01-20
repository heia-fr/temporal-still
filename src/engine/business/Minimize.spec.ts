import { Universe } from 'src/engine/business';
import { TemporalEntityInterpreter } from 'src/engine/analysers';

function getTransitions(universe: Universe): string[][] {
    const length = universe.getLength();
    const transitions: string[][] = [];
    for (const entity of universe.getEntities()) {
        const values: string[] = Array.from(entity.calculateUpdatedFixedPart(length[0]));
        values.push.apply(values, Array.from(entity.calculateUpdatedPeriodicPart(length[1])));
        transitions.push(values);
    }
    return transitions;
}

function getNextTransition(entities: string[][], start: number): { values: string[], distance: number } | null {
    for (let i = start, l = entities[0].length; i < l; ++i) {

        for (const entity of entities) {
            if (entity[i] !== entity[i - 1]) {
                // Value different from previous => Transition

                const values: string[] = [];
                for (const e of entities) {
                    values.push(e[i]);
                }

                const distance = i - start;
                return { values, distance };
            }
        }
    }

    return null;
}

describe('testing Minimize function', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('Universe.minimize should work', () => {
        // Prepare Universe
        const entities = [
            'b = 111000100011/1',
            'a = 110000101000/0',
            'f = b W !a',
            'g = !a W b',
            'h = <>(a & b)',
            'i = b & []!a'
        ];

        for (let entity of entities) {
            let tf = TemporalEntityInterpreter.evaluate(entity, u);
            expect(tf).not.toBeUndefined();
            expect(tf).not.toBeNull();
            u.putEntity(tf!);
        }

        // Execute minimize and keep old/new transitions
        const originalTransitions = getTransitions(u);
        u.minimize();
        const minimizedTransitions = getTransitions(u);

        // Check if the transitions are the same
        for (let iO = 0, iM = 0; ; ++iO, ++iM) {
            const nextO = getNextTransition(originalTransitions, iO);
            const nextM = getNextTransition(minimizedTransitions, iM);

            if (nextO == null || nextM == null) {
                // Both must be null
                expect(nextM).toEqual(nextO);

                // Last index must be the length of the transitions
                expect(iM).toEqual(minimizedTransitions[0].length);

                break;
            }

            // In the minimized universe, the values are
            // the same as the original and the distance
            // between transitions are 0
            expect(nextM.values).toEqual(nextO.values);
            expect(nextM.distance).toEqual(0);

            iO += nextO.distance;
        }
    });
});
