import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Implies } from 'src/engine/operators';

describe('testing "Implies" constructor', () => {

    let u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Implies" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        let s1 = new BooleanSignal('a = 101/101');
        let s2 = new BooleanSignal('b = 110/011');
        let implies = new Implies(s1, s2);

        expect(() => {
            implies.performUnaryOperator();
        }).toThrow();
        expect(() => {
            implies.performBinaryOperator();
        }).not.toThrow();
    });

    it('Correct "Implies" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/101'));
        u.putEntity(new BooleanSignal('b = 110/011'));
        Operator.setUniverseLength(u.getLength());

        let implies = new Implies(u.getEntityOrThrow('a'), u.getEntityOrThrow('b'));
        let r = implies.performBinaryOperator();

        expect(r.getContent()).toEqual('ab=110/011');
    });
});
