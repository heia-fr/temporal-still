import _random from 'lodash/random';
import { Universe } from 'src/engine/business';
import { Symbols } from 'src/engine/helpers';

/**
 * Defining ForumlaGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the universe to produce a formula that
 * refers to existing signals The maximum levels of recursion are fixed: 1)
 * maximum nested formulas: 3 2) maximum number of terms: 5 3) maximum number of
 * factors: 5
 */

const NB_PROPS = 5;

function generateProp(universe: Universe): string {
    let id;
    do {
        const i = _random(0, Symbols.getCharSet().length - 1);
        id = Symbols.getCharSet().charAt(i);
    } while (universe.containsEntity(id));
    return id;
}

function generateUnaryOperator(universe: Universe): string {
    const choice = _random(1, 100);
    let unaryOp;
    if (choice <= 33) {
        unaryOp = Symbols.getNot();
    } else if (choice <= 66) {
        unaryOp = Symbols.getAlways();
    } else {
        unaryOp = Symbols.getEventually();
    }
    return unaryOp;
}

function generateUnaryOrBinaryOperator(): string {
    const choice = _random(1, 100);
    let op;
    if (choice <= 14) {
        op = Symbols.getNot();
    } else if (choice <= 28) {
        op = Symbols.getAlways();
    } else if (choice <= 42) {
        op = Symbols.getEventually();
    } else if (choice <= 56) {
        op = Symbols.getWeakUntil();
    } else if (choice <= 70) {
        op = Symbols.getAnd();
    } else if (choice <= 84) {
        op = Symbols.getOr();
    } else {
        op = Symbols.getImplies();
    }
    return op;
}

function generateSignalId(universe: Universe): string {
    const ids = universe.getIds();
    return ids[_random(0, ids.length - 1)];
}

function generateFormula(universe: Universe, nbProps: number): string {
    if (nbProps === 1) {
        return generateSignalId(universe);
    } else if (nbProps === 2) {
        const unaryOp = generateUnaryOperator(universe);
        const f = generateFormula(universe, 1);
        return unaryOp + f;
    } else {
        const op = generateUnaryOrBinaryOperator();
        if (Symbols.isUnaryOp(op)) {
            const f = generateFormula(universe, nbProps - 1);
            return op + f;
        } else {
            const n = _random(1, nbProps - 2);
            const f1 = generateFormula(universe, nbProps);
            const f2 = generateFormula(universe, nbProps - n - 1);
            if (op === Symbols.getImplies()) {
                return Symbols.getOpeningBraket() + f1
                    + Symbols.getClosingBraket() + op + Symbols.getOpeningBraket() + f2
                    + Symbols.getClosingBraket();
            }
            return f1 + op + f2;
        }
    }
}

export function generateTemporalFormula(universe: Universe): string {
    return generateProp(universe) + ' ' + Symbols.getEqual() + ' ' + generateFormula(universe, NB_PROPS);
}
