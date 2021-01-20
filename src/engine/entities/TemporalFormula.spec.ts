import {
    BooleanSignal,
    TemporalFormula,
} from 'src/engine/entities';

describe('testing TemporalFormula constructor', () => {

    it('TemporalFormula constructor with uncorrect parameters should throw an exception', () => {
        expect(() => new TemporalFormula(null, null, null, null)).toThrow();
        expect(() => new TemporalFormula(null, null, null, null, null)).toThrow();
        expect(() => new TemporalFormula('', '', null, null)).toThrow();
        expect(() => new TemporalFormula('', '', new BooleanSignal(''), null)).toThrow();
    });

    it('TemporalFormula constructor with correct parameters should not throw an exception', () => {
        expect(() => new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), [])).not.toThrow();
        expect(() => new TemporalFormula('f', 'f = a & b', new BooleanSignal('k = 100101/10'), [], null)).not.toThrow();

        expect(() =>
            new TemporalFormula(null, null, null, null,
                new TemporalFormula('f', 'f = a & b',
                new BooleanSignal('k = 100101/10'), []))).not.toThrow();
    });

    it('TemporalFormula state should be as expected', () => {
        let tf = new TemporalFormula('f', 'f = a & b', new BooleanSignal('f = 100101/10'), ['a', 'b']);

        expect(tf.getId()).toMatch('f');
        expect(tf.getContent()).toMatch('f = a & b');
        expect(tf.getReferences()).toEqual(['a', 'b']);
    });
});
