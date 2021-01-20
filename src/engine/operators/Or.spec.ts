import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Or } from 'src/engine/operators';

describe('testing "Or" constructor', () => {

    let u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Or" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 101/101');
        let s2 = new BooleanSignal('b = 110/011');
        let or = new Or(s1, s2);

        expect(() => {
            or.performUnaryOperator();
        }).toThrow();
        expect(() => {
            or.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "Or" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/101'));
        u.putEntity(new BooleanSignal('b = 110/011'));
        Operator.setUniverseLength(u.getLength());

        let and = new Or(u.getEntity('a'), u.getEntity('b'));
        let r = and.performBinaryOperator();

        expect(r.getContent()).toEqual('ab=111/111');
    });
});
