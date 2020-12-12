import AST from '../TemporalEntitySyntaxTree';
import { GeneralizedBuchiAutomata } from './GeneralizedBuchiAutomata';
import { Operator, Formula } from './Operators';

var SAT = function () {

    function Singleton() {

        function isSatisfiable(ast: Operator): boolean {
            // Step #1) Transform LTL to NOT(LTL) NNF
            let nnf = ast.toNNF();

            // Step #2) Transform LTL NNF to GBA
            let gba = GeneralizedBuchiAutomata.fromLTL(nnf);

            // Step #3) Transform Automata to Graph
            let graph = gba.toGraph(gba.toStates());

            // Step #4) Reduce Strongly Connected Components

            // Step #5) Decide SAT
            return graph.Nodes.size > 0;
        }

        function parse(ast: Operator | string): Operator {
            if (ast instanceof Formula) return ast.content;
            if (ast instanceof Operator) return ast;
            return AST.parse(ast).content;
        }

        return {
            isSatisfiable: function (ast: Operator | string) {
                return isSatisfiable(parse(ast));
            },
            isTautology: function (ast: Operator | string) {
                return !isSatisfiable(parse(ast).negate());
            },
        };
    }

    return Singleton();
}();

export default SAT;
