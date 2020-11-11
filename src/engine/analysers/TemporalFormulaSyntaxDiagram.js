import SyntaxDiagram from './TemporalEntitySyntaxDiagram';

/**
 * @deprecated
 * @see TemporalEntitySyntaxDiagram.isValidSignal(expression)
 */
var TemporalFormulaSyntaxDiagram = (function() {
   return {
      isValid: function(expression) {
         return SyntaxDiagram.isValidFormula(expression);
      }
   };
})();

export default TemporalFormulaSyntaxDiagram;
