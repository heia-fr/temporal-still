import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';

describe('testing Universe constructor', () => {

    const u = new Universe();

    afterEach(() => {
        u.clear();
    });

    it('New Universe constructor should work', () => {
        expect(u.getLength()).toEqual([0, 1]);
        expect(u.isEmpty()).toBe(true);
    });

    it('putEntity method should work', () => {
        let s1 = new BooleanSignal('a = 100101/10');
        let s2 = new BooleanSignal('b = 1011/010');
        let s3 = new BooleanSignal('c = 1/10110');

        expect(() => {
            u.putEntity({} as any);
        }).toThrow();

        u.putEntity(s1);
        expect(u.getLength()).toEqual([6, 2]);

        u.putEntity(s1);
        expect(u.getLength()).toEqual([6, 2]);

        u.putEntity(s2);
        expect(u.getLength()).toEqual([6, 6]);

        u.putEntity(s3);
        expect(u.getLength()).toEqual([6, 30]);
    });

    it('updateSignal method should work', () => {
        let s1 = new BooleanSignal('a = 100101/10');
        let s2 = new BooleanSignal('b = 1011/010');
        let s3 = new BooleanSignal('c = 1/10110');

        u.putEntity(s1);
        u.putEntity(s2);
        u.putEntity(s3);
        expect(u.getLength()).toEqual([6, 30]);

        expect(() => {
            u.putEntity({} as any);
        }).toThrow();

        s1 = new BooleanSignal('a = 100101001/1001');
        u.putEntity(s1);
        expect(u.getLength()).toEqual([9, 60]);
    });

    it('removeEntity method should work', () => {
        let s1 = new BooleanSignal('a = 100101/10');
        let s2 = new BooleanSignal('b = 1011/010');
        let s3 = new BooleanSignal('c = 1/10110');

        u.putEntity(s1);
        u.putEntity(s2);
        u.putEntity(s3);
        expect(u.getLength()).toEqual([6, 30]);

        u.removeEntity('f');
        expect(u.getLength()).toEqual([6, 30]);

        u.removeEntity('a');
        expect(u.isEmpty()).toBe(false);
        expect(u.getLength()).toEqual([4, 15]);

        u.removeEntity('c');
        expect(u.isEmpty()).toBe(false);
        expect(u.getLength()).toEqual([4, 3]);

        u.removeEntity('b');
        expect(u.isEmpty()).toBe(true);
        expect(u.getLength()).toEqual([0, 1]);
    });

    it('clear method should work', () => {
        let s1 = new BooleanSignal('a = 100101/10');
        let s2 = new BooleanSignal('b = 1011/010');
        let s3 = new BooleanSignal('c = 1/10110');

        u.putEntity(s1);
        u.putEntity(s2);
        u.putEntity(s3);
        expect(u.getLength()).toEqual([6, 30]);

        u.clear();
        expect(u.isEmpty()).toBe(true);
        expect(u.getLength()).toEqual([0, 1]);
    });
});
