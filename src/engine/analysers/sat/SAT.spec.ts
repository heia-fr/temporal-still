import { SAT, TemporalEntitySyntaxTree as AST } from 'src/engine/analysers';

function checkFormula(formulaStr: string, isSatisfiable: boolean, isTautology: boolean): void {
    if (isTautology) {
        expect(isSatisfiable).toBe(true, 'Invalid check parameters, isSatisfiable must be True if isTautology is True');
    }

    const formula = AST.parse(formulaStr);
    expect(formula).not.toBeNull();

    expect(SAT.isSatisfiable(formula)).toBe(isSatisfiable, 'isSatisfiable for ' + formula);
    expect(SAT.isTautology(formula)).toBe(isTautology, 'isTautology for ' + formula);
}

describe('testing SAT isSatisfiable and isTautology', () => {

    it('Correct formulas are expected to be accepted', () => {
        checkFormula('f = a | !a', true, true);
        checkFormula('f = !a | a', true, true);

        checkFormula('f = a & b', true, false);
        checkFormula('f = a | b', true, false);

        checkFormula('f = (a -> (b -> c)) -> ((a -> b) -> (a -> c))', true, true);
        checkFormula('f = ![]a -> <>!a', true, true);
        checkFormula('f = ([]a) W ([]a)', true, false);
        checkFormula('f = (a | b) -> [](a W b)', true, false);
        checkFormula('f = (<>a -> <>b) -> <>(a -> b)', true, true);
    });

    it('Negated Tautology must not be satisfiable', () => {
        checkFormula('f = a & !a', false, false);
        checkFormula('f = !a & a', false, false);
        checkFormula('f = !((a -> (b -> c)) -> ((a -> b) -> (a -> c)))', false, false);
        checkFormula('f = !(![]a -> <>!a)', false, false);
    });
});
