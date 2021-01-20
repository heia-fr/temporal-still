import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, And } from 'src/engine/operators';

describe('testing "And" constructor', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"And" Operator Should Not Have "performUnaryOperator" Implemented', () => {
        const s1 = new BooleanSignal('a = 101/101');
        const s2 = new BooleanSignal('b = 110/011');
        const and = new And(s1, s2);

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

        const and = new And(u.getEntityOrThrow('a'), u.getEntityOrThrow('b'));
        const r = and.performBinaryOperator();

        expect(r.getContent()).toEqual('ab=100/001');
    });
});
