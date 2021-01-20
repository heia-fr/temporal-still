import { Random } from 'random-js';
import { Universe } from 'src/engine/business';
import { BooleanSignal } from 'src/engine/entities';
import { TemporalEntitySyntaxDiagram } from 'src/engine/analysers';
import { generateTemporalFormula } from 'src/engine/generators';
import { Symbols } from 'src/engine/helpers';

function generateCorrectFormulas(nbOfFormulas, universe) {
    var formulas = [];
    for (var i = 1; i <= nbOfFormulas; i++) {
        formulas.push(generateTemporalFormula(universe));
    }
    return formulas;
}

function testCorrectFormulas(generator, maxNbFormulas, nbrOfTests, universe) {
    var result = true;
    var formulas;
    var nbOfFormulas = generator.integer(1, maxNbFormulas);
    for (var i = 0; i < nbrOfTests; i++) {
        formulas = generateCorrectFormulas(nbOfFormulas, universe);
        formulas.forEach(function (formula) {
            console.log(formula);
            result = TemporalEntitySyntaxDiagram.isValidFormula(formula) && result;
        });
    }
    return result;
}

function testUncorrectFormulas(generator, maxNbFormulas, nbrOfTests, universe) {
    var result = false;
    var nbOfFormulas = generator.integer(1, maxNbFormulas);
    var formulas;
    var len, fLen;
    var pool = "[<à$]!?)(\>.:@,-_*+'/&2345%6789" + Symbols.getCharSet();
    for (var i = 0; i < nbrOfTests; i++) {
        formulas = generateCorrectFormulas(nbOfFormulas, universe);

        formulas.forEach(function (formula) {
            fLen = formula.length;
            len = generator.integer(0, fLen - 1);
            if (generator.bool()) {
                formula = formula.substring(0, len) + generator.string(10, pool);
            } else {
                formula = formula.substring(len, fLen - 1) + generator.string(10, pool);
            }
            result = TemporalEntitySyntaxDiagram.isValidFormula(formula) || result;
        });
    }
    return result;
}

describe('testing TemporalFormulaSyntaxDiagram constructor', function () {

    var maxNbFormulas = 10;
    var nbrOfTests = 10;
    var r = new Random();
    var u = new Universe();
    u.putEntity(new BooleanSignal("a = 100101/10"));
    u.putEntity(new BooleanSignal("b = 1011/010"));
    u.putEntity(new BooleanSignal("c = 1/10110"));

    it('Correct formulas are expected to be accepted', function () {
        var result = true;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = ((c | d) & (c -> e)) | (!(c | d) ) | (!(c -> e))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = []a | b & c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = []a | <>(b & c)") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = !(b & c)") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = !((1001/01) & (11/0))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = X ((c | d) & (c -> e)) | (!(c | d) ) | (!(c -> e))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = ((c | d) & (c -> e)) R (!(c | d) ) | (!(c -> e))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = ((c | d) & (c -> e)) | (!(c | d) ) U (!(c -> e))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = ((c | d) & (c -> e)) | (!(c | d) ) W (X (!(c -> e)))") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = (a W b) W c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a W (b W c)") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = (a U b) U c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a U (b U c)") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = (a R b) R c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a R (b R c)") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a -> b -> c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a & b & c") && result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a | b | c") && result;
        result = testCorrectFormulas(r, maxNbFormulas, nbrOfTests, u) && result;

        expect(result).toBe(true);
    });

    it('Uncorrect formulas are expected to be refused', function () {
        var result = false;
        result = TemporalEntitySyntaxDiagram.isValidFormula("") && result; // force
        // false
        result = TemporalEntitySyntaxDiagram.isValidFormula("g") || result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("oWdWp . [t") || result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("[]r(<>b + <o") || result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("x=j[e<>t") || result;

        // No priority has been chosen, therefore these formulas are considered incorrect
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a W b W c") || result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a U b U c") || result;
        result = TemporalEntitySyntaxDiagram.isValidFormula("f = a R b R c") || result;

        result = testUncorrectFormulas(r, maxNbFormulas, nbrOfTests, u) || result;

        expect(result).toBe(false);
    });
});
