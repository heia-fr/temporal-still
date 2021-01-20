import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Not } from 'src/engine/operators';

describe('testing "Not" constructor', () => {

    let u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Not" Operator Should Not Have "performBinaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 101/101');
        let not = new Not(s1);

        expect(() => {
            not.performBinaryOperator();
        }).toThrow();
        expect(() => {
            not.performUnaryOperator();
        }).not.toThrow();
    });

    it('Correct "Not" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011'));
        Operator.setUniverseLength(u.getLength());

        let not = new Not(u.getEntityOrThrow('a'));
        let r = not.performUnaryOperator();

        expect(r.getContent()).toEqual('a=010/100');
    });
});
