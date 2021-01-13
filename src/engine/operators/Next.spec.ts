import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { Operator, Next } from 'src/engine/operators';

describe('testing "Next" constructor', function() {

    const u = new Universe(null);

    afterEach(function() {
        u.clear();
    });

    it('"Next" Operator Should Next Have "performBinaryOperator" Implemented', function() {
        var s1: any = new BooleanSignal('a = 101/101', null);
        var not = new Next(s1);

        expect(function() {
            not.performBinaryOperator();
        }).toThrow();
        expect(function() {
            not.performUnaryOperator();
        }).not.toThrow();
    });

    it('Correct "Next" operation should pass', function() {
        u.putEntity(new BooleanSignal('a = 101/011', null));
        Operator.prototype.setUniverseLength(u.getLength());

        var not = new Next(u.getEntity('a'));
        var r = not.performUnaryOperator();

        expect(r.getContent()).toEqual('a=010/110');
    });
});
