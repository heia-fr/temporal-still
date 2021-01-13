import { Symbols } from 'src/engine/helpers';
import Lexer from './Lexer';
import {
	Operator,
	Always,
	Eventually,
	Not,
	Variable,
	Implies,
	WeakUntil,
	Or,
	And,
	Formula,
    Next,
    Until,
    Release,
} from './sat/Operators';

const TemporalEntitySyntaxTree = function() {

	function Singleton() {

		function parseFormulaExpr(lexer: Lexer, state: any): Formula {
			if (!lexer.isVarName()) throw new SyntaxError('TemporalEntitySyntaxTree: Expected valid formula name');
			let name = lexer.getCurrentToken();
			lexer.goToNextToken();

			if (!lexer.isEqualSign()) throw new SyntaxError('TemporalEntitySyntaxTree: Expected equal sign');
			lexer.goToNextToken();

			return new Formula(name, parseFormula(lexer));
		}

		function parseFormula(lexer: Lexer): Operator {
			let bs = parseComponent(lexer);

			while (lexer.isDash()) {
				lexer.goToNextToken();

				if (!lexer.isGreaterThanSign())
					throw new SyntaxError('TemporalEntitySyntaxTree: Expected ' + Symbols.isGreaterThanSign());
				lexer.goToNextToken();

				let thatBs = parseComponent(lexer);
				bs = new Implies(bs, thatBs);
			}

			return bs;
		}

		function parseComponent(lexer: Lexer): Operator {
			let bs = parseTerm(lexer);

			while (lexer.isOr()) {
				lexer.goToNextToken();

				let thatBs = parseTerm(lexer);
				bs = new Or(bs, thatBs);
			}

			return bs;
		}

		function parseTerm(lexer: Lexer): Operator {
			let bs = parseFactor(lexer);

			while (lexer.isAnd()) {
				lexer.goToNextToken();

				let thatBs = parseFactor(lexer);
				bs = new And(bs, thatBs);
			}

			return bs;
		}

		function parseFactor(lexer: Lexer): Operator {
			let bs = parseAtom(lexer);

			if (lexer.isWeaklyUntil()) {
				lexer.goToNextToken();

				let thatBs = parseAtom(lexer);
				bs = new WeakUntil(bs, thatBs);
            } else if (lexer.isUntil()) {
                lexer.goToNextToken();

                let thatBs = parseAtom(lexer);
                bs = new Until(bs, thatBs);
            } else if (lexer.isRelease()) {
                lexer.goToNextToken();

                let thatBs = parseAtom(lexer);
                bs = new Release(bs, thatBs);
			}

			return bs;
		}

		function parseAtom(lexer: Lexer): Operator {

			let bs = null;

			if (lexer.isOpeningBracket()) {
				lexer.goToNextToken();

				bs = parseFormula(lexer);

				if (!lexer.isClosingBracket())
					throw new SyntaxError('TemporalEntitySyntaxTree: Expected ' + Symbols.getClosingBraket());
				lexer.goToNextToken();

			} else if (lexer.isNot()) {
				lexer.goToNextToken();

				bs = parseAtom(lexer);
				bs = new Not(bs);

            } else if (lexer.isNext()) {
                lexer.goToNextToken();

                bs = parseAtom(lexer);
                bs = new Next(bs);

			} else if (lexer.isOpeningSquareBracket()) {
				lexer.goToNextToken();

				if (!lexer.isClosingSquareBracket())
					throw new SyntaxError('TemporalEntitySyntaxTree: Expected ' + Symbols.getClosingSquareBraket());
				lexer.goToNextToken();

				bs = parseAtom(lexer);
				bs = new Always(bs);

			} else if (lexer.isLessThanSign()) {
				lexer.goToNextToken();

				if (!lexer.isGreaterThanSign())
					throw new SyntaxError('TemporalEntitySyntaxTree: Expected ' + Symbols.getGreaterThan());
				lexer.goToNextToken();

				bs = parseAtom(lexer);
				bs = new Eventually(bs);

			} else {
				bs = parseProp(lexer);
			}
			return bs;
		}

		function parseProp(lexer: Lexer): Operator {
			if (!lexer.isVarName()) {
				console.log(lexer.getCurrentToken());
				throw new SyntaxError('TemporalEntitySyntaxTree: Expected valid variable name');
			}

			let prop = new Variable(lexer.getCurrentToken());
			lexer.goToNextToken();

			return prop;
		}

		return {
			parse(expression: string): Formula {
				let lexer = new Lexer(expression);
				lexer.goToNextToken();
				return parseFormulaExpr(lexer, {});
			},
		};
	}

	return Singleton();
}();

export default TemporalEntitySyntaxTree;