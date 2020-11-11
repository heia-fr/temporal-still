import SyntaxDiagram from './TemporalEntitySyntaxDiagram';

/**
 * @deprecated
 * @see TemporalEntitySyntaxDiagram.isValidSignal(expression)
 */
var BooleanSignalSyntaxDiagram = (function() {
   return {
      isValid: function(expression) {
         return SyntaxDiagram.isValidSignal(expression);
      }
   };
})();

export default BooleanSignalSyntaxDiagram;
