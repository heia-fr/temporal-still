import Universe from '../../js/models/business/Universe';
import BooleanSignal from '../../js/models/entities/BooleanSignal';
import TemporalFormulaSyntaxDiagram from '../../js/models/analysers/TemporalFormulaSyntaxDiagram';
import FormulaGenerator from '../../js/models/generators/FormulaGenerator';
import Symbols from '../../js/models/helpers/Symbols';

function generateCorrectFormulas(nbOfFormulas, universe) {
   var formulas = [];
   for (var i = 1; i <= nbOfFormulas; i++) {
      formulas.push(FormulaGenerator.generateTemporalFormula(universe));
   }
   return formulas;
}

function testCorrectFormulas(generator, maxNbFormulas, nbrOfTests, universe) {
   var result = true;
   var formulas;
   var nbOfFormulas = generator.integer(1, maxNbFormulas);
   for (var i = 0; i < nbrOfTests; i++) {
      formulas = generateCorrectFormulas(nbOfFormulas, universe);
      formulas.forEach(function(formula) {
         console.log(formula);
         result = TemporalFormulaSyntaxDiagram.isValid(formula) && result;
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

      formulas.forEach(function(formula) {
         fLen = formula.length;
         len = generator.integer(0, fLen - 1);
         if (generator.bool()) {
            formula = formula.substring(0, len) + generator.string(10, pool);
         } else {
            formula = formula.substring(len, fLen - 1) + generator.string(10, pool);
         }
         result = TemporalFormulaSyntaxDiagram.isValid(formula) || result;
      });
   }
   return result;
}

describe('testing TemporalFormulaSyntaxDiagram constructor', function() {

   var maxNbFormulas = 10;
   var nbrOfTests = 10;
   var r = new Random();
   var u = new Universe();
   u.addSignal(new BooleanSignal("a = 100101/10"));
   u.addSignal(new BooleanSignal("b = 1011/010"));
   u.addSignal(new BooleanSignal("c = 1/10110"));

   it('Correct formulas are expected to be accepted', function() {
      var result = true;
      result = TemporalFormulaSyntaxDiagram.isValid("f = ((c | d) & (c -> e)) | (!(c | d) ) | (!(c -> e))") && result;
      result = TemporalFormulaSyntaxDiagram.isValid("f = []a | b & c") && result;
      result = TemporalFormulaSyntaxDiagram.isValid("f = []a | <>(b & c)") && result;
      result = TemporalFormulaSyntaxDiagram.isValid("f = !(b & c)") && result;
      result = testCorrectFormulas(r, maxNbFormulas, nbrOfTests, u) && result;

      expect(result).toBe(true);
   });

   it('Uncorrect formulas are expected to be refused', function() {
      var result = false;
      result = TemporalFormulaSyntaxDiagram.isValid("") && result; // force
      // false
      result = TemporalFormulaSyntaxDiagram.isValid("g") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("oWdWp . [t") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("[]r(<>b + <o") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("x=j[e<>t") || result;

      result = testUncorrectFormulas(r, maxNbFormulas, nbrOfTests, u) || result;

      expect(result).toBe(false);
   });
});
