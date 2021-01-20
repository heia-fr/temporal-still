import { Universe } from 'src/engine/business';
import {
    BooleanSignal,
    TemporalFormula,
} from 'src/engine/entities';

describe('testing FormulasManager constructor', () => {

    const u = new Universe();

    afterEach(() => {
        u.clear();
    });

    it('New FormulasManager constructor should work', () => {
        expect(u.isEmpty()).toBe(true);
    });

    it('putEntity method should work', () => {
        let f1 = new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), []);
        let f2 = new TemporalFormula('g', 'g = a | b', new BooleanSignal('g = 01000010/010'), []);
        let f3 = new TemporalFormula('h', 'h = a W b', new BooleanSignal('h = 10/1001'), []);

        expect(() => {
            u.putEntity({} as any);
        }).toThrow();

        u.putEntity(f1);
        expect(u.getEntities().length).toEqual(1);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(f1));

        u.putEntity(f1);
        expect(u.getEntities().length).toEqual(1);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(f1));

        u.putEntity(f2);
        u.putEntity(f3);
        expect(u.getEntities().length).toEqual(3);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(f1));
        expect(JSON.stringify(u.getEntity('g'))).toEqual(JSON.stringify(f2));
        expect(JSON.stringify(u.getEntity('h'))).toEqual(JSON.stringify(f3));
    });

    it('putEntity method should work', () => {
        let f1 = new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), []);
        let f2 = new TemporalFormula('g', 'g = a | b', new BooleanSignal('g = 01000010/010'), []);
        let f3 = new TemporalFormula('h', 'h = a W b', new BooleanSignal('h = 10/1001'), []);

        expect(() => {
            u.putEntity({} as any);
        }).toThrow();

        u.putEntity(f1);
        u.putEntity(f2);
        u.putEntity(f3);

        let newF2 = new TemporalFormula('g', 'g = !a W []b', new BooleanSignal('g = 101001/0'), []);
        u.putEntity(newF2);
        expect(JSON.stringify(u.getEntity('g'))).toEqual(JSON.stringify(newF2));
    });

    it('removeEntity method should work', () => {
        let f1 = new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), []);
        let f2 = new TemporalFormula('g', 'g = a | b', new BooleanSignal('g = 01000010/010'), []);
        let f3 = new TemporalFormula('h', 'h = a W b', new BooleanSignal('h = 10/1001'), []);
        u.putEntity(f1);
        u.putEntity(f2);
        u.putEntity(f3);

        expect(u.getEntities().length).toEqual(3);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(f1));
        expect(JSON.stringify(u.getEntity('g'))).toEqual(JSON.stringify(f2));
        expect(JSON.stringify(u.getEntity('h'))).toEqual(JSON.stringify(f3));

        u.removeEntity('h');
        expect(u.getEntities().length).toEqual(2);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(f1));
        expect(JSON.stringify(u.getEntity('g'))).toEqual(JSON.stringify(f2));
        expect(JSON.stringify(u.getEntity('h'))).toEqual(JSON.stringify(undefined));

        u.removeEntity('f');
        u.removeEntity('g');
        expect(u.getEntities().length).toEqual(0);
        expect(u.isEmpty()).toBe(true);
        expect(JSON.stringify(u.getEntity('f'))).toEqual(JSON.stringify(undefined));
        expect(JSON.stringify(u.getEntity('g'))).toEqual(JSON.stringify(undefined));
        expect(JSON.stringify(u.getEntity('h'))).toEqual(JSON.stringify(undefined));

    });

    it('clear method should work', () => {
        let f1 = new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), []);
        let f2 = new TemporalFormula('g', 'g = a | b', new BooleanSignal('g = 01000010/010'), []);
        let f3 = new TemporalFormula('h', 'h = a W b', new BooleanSignal('h = 10/1001'), []);
        u.putEntity(f1);
        u.putEntity(f2);
        u.putEntity(f3);

        expect(u.getEntities().length).toEqual(3);
        expect(u.isEmpty()).toBe(false);

        u.clear();

        expect(u.getEntities().length).toEqual(0);
        expect(u.isEmpty()).toBe(true);
    });
});
