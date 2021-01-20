import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Until } from 'src/engine/operators';

describe('testing "Until" constructor', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Until" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        const s1 = new BooleanSignal('a = 1011/011010', null);
        const s2 = new BooleanSignal('b = 0100/001011', null);
        const until = new Until(s1, s2);

        expect(() => {
            until.performUnaryOperator();
        }).toThrow();
        expect(() => {
            until.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "Until" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011', null));
        u.putEntity(new BooleanSignal('b = 11/0', null));
        u.putEntity(new BooleanSignal('c = 11001/01100', null));
        u.putEntity(new BooleanSignal('d = 1100/1', null));
        u.putEntity(new BooleanSignal('e = 0/0', null));
        Operator.setUniverseLength(u.getLength()); // length [5, 15]

        // Same as Weak Until
        let until = new Until(u.getEntityOrThrow('a'), u.getEntityOrThrow('b'));
        let r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('bab=11000/000000000000000');

        until = new Until(u.getEntityOrThrow('b'), u.getEntityOrThrow('a'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('aba=11101/101101101101101');

        until = new Until(u.getEntityOrThrow('a'), u.getEntityOrThrow('c'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('cac=11001/111001110001101');

        until = new Until(u.getEntityOrThrow('a'), u.getEntityOrThrow('d'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('dad=11001/111111111111111');

        until = new Until(u.getEntityOrThrow('c'), u.getEntityOrThrow('d'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('dcd=11001/111111111111111');

        // Different from Weak Until
        until = new Until(u.getEntityOrThrow('d'), u.getEntityOrThrow('e'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('ede=00000/000000000000000');
    });
});
