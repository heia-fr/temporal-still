import { SAT, TemporalEntitySyntaxTree as AST } from 'src/engine/analysers';

function checkFormula(formula, isSatisfiable, isTautology) {
	if (isTautology) {
		expect(isSatisfiable).toBeTrue("Invalid check parameters, isSatisfiable must be True if isTautology is True");
	}

	formula = AST.parse(formula);
	expect(formula).not.toBeNull();

	expect(SAT.isSatisfiable(formula)).toBe(isSatisfiable, 'isSatisfiable for ' + formula);
	expect(SAT.isTautology(formula)).toBe(isTautology, 'isTautology for ' + formula);
}

describe('testing SAT isSatisfiable and isTautology', function () {

	it('Correct formulas are expected to be accepted', function () {
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

	it('Negated Tautology must not be satisfiable', function () {
		checkFormula('f = a & !a', false, false);
		checkFormula('f = !a & a', false, false);
		checkFormula('f = !((a -> (b -> c)) -> ((a -> b) -> (a -> c)))', false, false);
		checkFormula('f = !(![]a -> <>!a)', false, false);
	});
});
