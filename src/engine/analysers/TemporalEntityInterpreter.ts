import { Symbols } from 'src/engine/helpers';
import { Lexer } from './Lexer';
import { BooleanSignal, TemporalEntity, TemporalFormula } from 'src/engine/entities';

import {
    Operator, Always, And, Eventually, Implies, Not, Or, WeakUntil, Next,
    Release, Until,
} from 'src/engine/operators';

interface Universe {
    getLength(): [number, number];
    getEntity(entityId: string): TemporalEntity | undefined;
}
interface Context {
    entityId: string;
    expression: string;
    ids: string[];
    universe: Universe;
}

function parseFormulaExpr(lexer: Lexer, state: Context): TemporalEntity {
    if (!lexer.isVarName()) throw new SyntaxError('TemporalEntityInterpreter: Expected valid formula name');
    lexer.goToNextToken();

    if (!lexer.isEqualSign()) throw new SyntaxError('TemporalEntityInterpreter: Expected equal sign');
    lexer.goToNextToken();

    if (lexer.isZero() || lexer.isOne()) {
        return parseSignal(lexer, state);
    } else {
        const formula = parseFormula(lexer, state);
        return new TemporalFormula(state.entityId, state.expression, formula, state.ids);
    }
}

function parseSignal(lexer: Lexer, state: Context): TemporalEntity {
    const body = parseDigits(lexer, state);

    if (!lexer.isSlash()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected slash sign');
    }
    lexer.goToNextToken();

    const period = parseDigits(lexer, state);

    return new BooleanSignal(state.entityId + '=' + body + '/' + period);
}

function parseDigits(lexer: Lexer, state: Context): string {
    let digits = '';

    if (!(lexer.isZero() || lexer.isOne())) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected 0 or 1');
    }
    digits += lexer.getCurrentToken();
    lexer.goToNextToken();

    while (lexer.isZero() || lexer.isOne()) {
        digits += lexer.getCurrentToken();
        lexer.goToNextToken();
    }

    return digits;
}

function parseFormula(lexer: Lexer, state: Context): TemporalEntity {
    let bs = parseComponent(lexer, state);

    while (lexer.isDash()) {
        lexer.goToNextToken();

        if (!lexer.isGreaterThanSign()) {
            throw new SyntaxError('TemporalEntityInterpreter: Expected ' + Symbols.getGreaterThan());
        }
        lexer.goToNextToken();

        const thatBs = parseComponent(lexer, state);
        const op = new Implies(bs, thatBs);
        bs = op.performBinaryOperator();
    }

    return bs;
}

function parseComponent(lexer: Lexer, state: Context): TemporalEntity {
    let bs = parseTerm(lexer, state);

    while (lexer.isOr()) {
        lexer.goToNextToken();

        const thatBs = parseTerm(lexer, state);
        const op = new Or(bs, thatBs);
        bs = op.performBinaryOperator();
    }

    return bs;
}

function parseTerm(lexer: Lexer, state: Context): TemporalEntity {
    let bs = parseFactor(lexer, state);

    while (lexer.isAnd()) {
        lexer.goToNextToken();

        const thatBs = parseFactor(lexer, state);
        const op = new And(bs, thatBs);
        bs = op.performBinaryOperator();
    }

    return bs;
}

function parseFactor(lexer: Lexer, state: Context): TemporalEntity {
    let bs = parseAtom(lexer, state);

    if (lexer.isWeaklyUntil()) {
        lexer.goToNextToken();

        const thatBs = parseAtom(lexer, state);
        const op = new WeakUntil(bs, thatBs);
        bs = op.performBinaryOperator();
    } else if (lexer.isUntil()) {
        lexer.goToNextToken();

        const thatBs = parseAtom(lexer, state);
        const op = new Until(bs, thatBs);
        bs = op.performBinaryOperator();
    } else if (lexer.isRelease()) {
        lexer.goToNextToken();

        const thatBs = parseAtom(lexer, state);
        const op = new Release(bs, thatBs);
        bs = op.performBinaryOperator();
    }

    return bs;
}

function parseAtom(lexer: Lexer, state: Context): TemporalEntity {

    let bs: TemporalEntity;

    if (lexer.isOpeningBracket()) {
        lexer.goToNextToken();

        if (lexer.isZero() || lexer.isOne()) {
            bs = parseSignal(lexer, state);
        } else {
            bs = parseFormula(lexer, state);
        }

        if (!lexer.isClosingBracket()) {
            throw new SyntaxError('TemporalEntityInterpreter: Expected ' + Symbols.getClosingBraket());
        }
        lexer.goToNextToken();

    } else if (lexer.isNot()) {
        lexer.goToNextToken();

        bs = parseAtom(lexer, state);
        const op = new Not(bs);
        bs = op.performUnaryOperator();

    } else if (lexer.isNext()) {
        lexer.goToNextToken();

        bs = parseAtom(lexer, state);
        const op = new Next(bs);
        bs = op.performUnaryOperator();

    } else if (lexer.isOpeningSquareBracket()) {
        lexer.goToNextToken();

        if (!lexer.isClosingSquareBracket()) {
            throw new SyntaxError('TemporalEntityInterpreter: Expected ' + Symbols.getClosingSquareBraket());
        }
        lexer.goToNextToken();

        bs = parseAtom(lexer, state);
        const op = new Always(bs);
        bs = op.performUnaryOperator();

    } else if (lexer.isLessThanSign()) {
        lexer.goToNextToken();

        if (!lexer.isGreaterThanSign()) {
            throw new SyntaxError('TemporalEntityInterpreter: Expected ' + Symbols.getGreaterThan());
        }
        lexer.goToNextToken();

        bs = parseAtom(lexer, state);
        const op = new Eventually(bs);
        bs = op.performUnaryOperator();

    } else {
        bs = parseProp(lexer, state);
    }
    return bs;
}

function parseProp(lexer: Lexer, state: Context): TemporalEntity {
    if (!lexer.isVarName()) {
        console.log(lexer.getCurrentToken());
        throw new SyntaxError('TemporalEntityInterpreter: Expected valid variable name');
    }
    const bs = state.universe.getEntity(lexer.getCurrentToken());
    if (!bs) {
        throw new SyntaxError('TemporalEntityInterpreter: Expected a variable present in the Universe');
    }
    // if the boolean signal is not referenced by the temporal formula
    // that is being evaluated, then add it to the references array
    if (state.ids.indexOf(bs.getId()) < 0) {
        state.ids.push(bs.getId());
    }
    // add a reference to the formula being evaluated to the current
    // boolean signal
    bs.addReferencedBy(state.entityId);
    lexer.goToNextToken();
    if (bs instanceof TemporalFormula) {
        return bs.getAssociatedSignal();
    }
    return bs;
}

/**
 * This class defines an interpreter of formulas. It uses the recursive descent
 * to evaluate each part of the formula. The universe is used to fetch the
 * corresponding signals. The result of the evaluation is a BooleanSignal object
 * that will be wrapped in a TemporalFormula object.
 */
export const TemporalEntityInterpreter = {
    /**
     * Evaluates the formula represented by the provided string.
     *
     * @param expression
     *           is a string that represents the formula to evaluate
     * @param universe
     *           is the universe of BooleanSignal objects
     */
    evaluate(expression: string, universe: Universe): TemporalEntity | null {
        try {
            // set the universe length so all the operators can have access
            // to the same lengths
            Operator.setUniverseLength(universe.getLength());
            const lexer = new Lexer(expression);
            lexer.goToNextToken();
            const entityId = expression.split(Symbols.getEqual())[0].trim();
            return parseFormulaExpr(lexer, {
                expression,
                entityId,
                ids: [],
                universe,
            });
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
};
