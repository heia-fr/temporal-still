import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Eventually } from 'src/engine/operators';

describe('testing "Eventually" constructor', () => {

    let u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Eventually" Operator Should Not Have "performBinaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 1011/01101');
        let not = new Eventually(s1);

        expect(() => {
            not.performBinaryOperator();
        }).toThrow();
        expect(() => {
            not.performUnaryOperator();
        }).not.toThrow();
    });

    it('Correct "Eventually" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011'));
        u.putEntity(new BooleanSignal('b = 11/0'));
        u.putEntity(new BooleanSignal('c = 11001/01100'));
        Operator.setUniverseLength(u.getLength()); // length [5, 15]

        let eventually = new Eventually(u.getEntityOrThrow('a'));
        let r = eventually.performUnaryOperator();
        expect(r.getContent()).toEqual('a=11111/111111111111111');

        eventually = new Eventually(u.getEntityOrThrow('b'));
        r = eventually.performUnaryOperator();
        expect(r.getContent()).toEqual('b=11000/000000000000000');

        eventually = new Eventually(u.getEntityOrThrow('c'));
        r = eventually.performUnaryOperator();
        expect(r.getContent()).toEqual('c=11111/111111111111111');
    });
});
