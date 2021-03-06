import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Next } from 'src/engine/operators';

describe('testing "Next" constructor', () => {

    const u = new Universe(null);

    afterEach(() => {
        u.clear();
    });

    it('"Next" Operator Should Next Have "performBinaryOperator" Implemented', () => {
        const s1 = new BooleanSignal('a = 101/101', null);
        const not = new Next(s1);

        expect(() => {
            not.performBinaryOperator();
        }).toThrow();
        expect(() => {
            not.performUnaryOperator();
        }).not.toThrow();
    });

    it('Correct "Next" operation should pass', () => {
        u.putEntity(new BooleanSignal('a = 101/011', null));
        Operator.setUniverseLength(u.getLength());

        const not = new Next(u.getEntityOrThrow('a'));
        const r = not.performUnaryOperator();

        expect(r.getContent()).toEqual('a=010/110');
    });
});
