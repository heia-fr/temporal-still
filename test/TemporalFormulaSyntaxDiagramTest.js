function generateCorrectFormulas(nbOfFormulas) {
   var formulas = [];
   for (var i = 1; i <= nbOfFormulas; i++) {
      formulas.push(FormulaGenerator.generateFormula());
   }
   return formulas;
}

function testCorrectFormulas(generator, maxNbFormulas, nbrOfTests) {
   var result = true;
   var formulas;
   var nbOfFormulas = generator.integer(1, maxNbFormulas);
   for (var i = 0; i < nbrOfTests; i++) {
      formulas = generateCorrectFormulas(nbOfFormulas);
      for (formula in formulas) {
         result = TemporalFormulaSyntaxDiagram.isValid(formula) && result;
      }
   }
   return result;
}

function testUncorrectFormulas(generator, maxNbFormulas, nbrOfTests) {
   var result = false;
   var nbOfFormulas = generator.integer(1, maxNbFormulas);
   var formulas;
   var len, fLen;
   for (var i = 0; i < nbrOfTests; i++) {
      formulas = generateCorrectFormulas(nbOfFormulas);

      for (formula in formulas) {
         fLen = formula.length;
         len = generator.integer(0, fLen - 1);
         if (generator.bool()) {
            formula = formula.substring(0, len);
         } else {
            formula = formula.substring(len, fLen - 1);
         }
         result = TemporalFormulaSyntaxDiagram.isValid(formula) || result;
      }
   }
   return result;
}

describe('testing TemporalFormulaSyntaxDiagram constructor', function() {

   var maxNbFormulas = 10;
   var nbrOfTests = 10;
   var r = new Random();

   it('Correct formulas are expected to be accepted', function() {
      var result = true;
      result = TemporalFormulaSyntaxDiagram.isValid("f = []a | b") && result;
      result = testCorrectFormulas(r, maxNbFormulas, nbrOfTests) && result;
      
      expect(result).toBe(true);
   });

   it('Uncorrect formulas are expected to be refused', function() {
      var result = false;
      result = TemporalFormulaSyntaxDiagram.isValid("") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("g") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("oWdWp . [t") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("[]r(<>b + <o") || result;
      result = TemporalFormulaSyntaxDiagram.isValid("x=j[e<>t") || result;

      result = testUncorrectFormulas(r, maxNbFormulas, nbrOfTests) || result;

      expect(result).toBe(false);
   });
});