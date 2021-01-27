import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, WeakUntil } from 'src/engine/operators';

describe('testing "WeakUntil" constructor', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"WeakUntil" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        const s1 = new BooleanSignal('a = 1011/011010');
        const s2 = new BooleanSignal('b = 0100/001011');
        const weakUntil = new WeakUntil(s1, s2);

        expect(() => {
            weakUntil.performUnaryOperator();
        }).toThrow();
        expect(() => {
            weakUntil.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "WeakUntil" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011'));     // 10101/101101101101101
        u.putEntity(new BooleanSignal('b = 11/0'));        // 11000/000000000000000
        u.putEntity(new BooleanSignal('c = 11001/01100')); // 11001/011000110001100
        u.putEntity(new BooleanSignal('d = 1100/1'));      // 11001/111111111111111
        u.putEntity(new BooleanSignal('e = 0/0', null));   // 00000/000000000000000
        Operator.setUniverseLength(u.getLength()); // length [5, 15]

        // Same as Until
        let weakUntil = new WeakUntil(u.getEntityOrThrow('a'), u.getEntityOrThrow('b'));
        let r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('ab=11000/000000000000000');

        weakUntil = new WeakUntil(u.getEntityOrThrow('b'), u.getEntityOrThrow('a'));
        r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('ba=11101/101101101101101');

        weakUntil = new WeakUntil(u.getEntityOrThrow('a'), u.getEntityOrThrow('c'));
        r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('ac=11001/111001110001101');

        weakUntil = new WeakUntil(u.getEntityOrThrow('a'), u.getEntityOrThrow('d'));
        r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('ad=11001/111111111111111');

        weakUntil = new WeakUntil(u.getEntityOrThrow('c'), u.getEntityOrThrow('d'));
        r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('cd=11001/111111111111111');

        // Different from Until
        weakUntil = new WeakUntil(u.getEntityOrThrow('d'), u.getEntityOrThrow('e'));
        r = weakUntil.performBinaryOperator();
        expect(r.getContent()).toEqual('de=00001/111111111111111');
    });
});
