import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Release } from 'src/engine/operators';

describe('testing "Release" constructor', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Release" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 1011/011010', null);
        let s2 = new BooleanSignal('b = 0100/001011', null);
        let until = new Release(s1, s2);

        expect(() => {
            until.performUnaryOperator();
        }).toThrow();
        expect(() => {
            until.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "Release" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011', null));
        u.putEntity(new BooleanSignal('b = 11/0', null));
        u.putEntity(new BooleanSignal('c = 11001/01100', null));
        u.putEntity(new BooleanSignal('d = 1100/1', null));
        u.putEntity(new BooleanSignal('e = 0/0', null));
        Operator.setUniverseLength(u.getLength()); // length [5, 15]

        let until = new Release(u.getEntityOrThrow('a'), u.getEntityOrThrow('b'));
        let r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('bba=10000/000000000000000');

        until = new Release(u.getEntityOrThrow('b'), u.getEntityOrThrow('a'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('aab=10000/000000000000000');

        until = new Release(u.getEntityOrThrow('a'), u.getEntityOrThrow('c'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('cca=10001/011000100001100');

        until = new Release(u.getEntityOrThrow('a'), u.getEntityOrThrow('d'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('dda=10001/111111111111111');

        until = new Release(u.getEntityOrThrow('c'), u.getEntityOrThrow('d'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('ddc=11001/111111111111111');

        until = new Release(u.getEntityOrThrow('d'), u.getEntityOrThrow('e'));
        r = until.performBinaryOperator();
        expect(r.getContent()).toEqual('eed=00000/000000000000000');
    });
});
