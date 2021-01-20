import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, And } from 'src/engine/operators';

describe('testing "And" constructor', () => {

    let u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"And" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 101/101');
        let s2 = new BooleanSignal('b = 110/011');
        let and = new And(s1, s2);

        expect(() => {
            and.performUnaryOperator();
        }).toThrow();
        expect(() => {
            and.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "And" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/101'));
        u.putEntity(new BooleanSignal('b = 110/011'));
        Operator.setUniverseLength(u.getLength());

        let and = new And(u.getEntity('a'), u.getEntity('b'));
        let r = and.performBinaryOperator();

        expect(r.getContent()).toEqual('ab=100/001');
    });
});
