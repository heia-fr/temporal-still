import _random from 'lodash/random';
import { Universe } from 'src/engine/business';
import { Symbols } from 'src/engine/helpers';
import { Lexer } from 'src/engine/analysers';

const MAX_NB_COMPONENTS = 2;
const MAX_NB_TERMS = 1;
const MAX_NB_FACTORS = 1;
const MAX_PERCENT = 100;
const PATH_ONE_PERCENT = 20;
const PATH_TWO_PERCENT = 40;
const PATH_THREE_PERCENT = 60;
const PATH_FOUR_PERCENT = 80;

interface Context {
    formulaLevel: number;
}

function generateProp(universe: Universe): string {
    let id: string;
    do {
        let i = _random(0, Symbols.getCharSet().length - 1);
        id = Symbols.getCharSet().charAt(i);
    } while (universe.containsEntity(id));
    return id;
}

function generateAtom(universe: Universe, ctx: Context): string {
    let atom;
    let chance = _random(1, MAX_PERCENT);

    if (chance <= PATH_ONE_PERCENT) {
        if (ctx.formulaLevel > 0) {
            --ctx.formulaLevel;
            return Symbols.getOpeningBraket() + generateFormula(universe, ctx) + Symbols.getClosingBraket();
        } else {
            chance = _random(PATH_ONE_PERCENT + 1, MAX_PERCENT);
        }
    }

    if (chance <= PATH_TWO_PERCENT) {
        let ids = universe.getIds();
        atom = ids[_random(0, ids.length - 1)];
    } else if (chance <= PATH_THREE_PERCENT) {
        atom = Symbols.getNot() + generateAtom(universe, ctx);
    } else if (chance <= PATH_FOUR_PERCENT) {
        atom = Symbols.getAlways() + generateAtom(universe, ctx);
    } else {
        atom = Symbols.getEventually() + generateAtom(universe, ctx);
    }
    return atom;
}

function generateFactor(universe: Universe, ctx: Context): string {
    let factor = generateAtom(universe, ctx);

    if (_random(0, 1) === 1) {
        factor += Symbols.getWeakUntil() + generateAtom(universe, ctx);
    }
    return factor;
}

function generateTerm(universe: Universe, ctx: Context): string {
    let term = generateFactor(universe, ctx);

    if (_random(0, 1) === 0) {
        for (let i = 1; i < MAX_NB_FACTORS; i++) {
            term += ' ' + Symbols.getAnd() + ' ' + generateFactor(universe, ctx);
        }
    }
    return term;
}

function generateComponent(universe: Universe, ctx: Context): string {
    let component = generateTerm(universe, ctx);

    if (_random(0, 1) === 1) {
        for (let i = 1; i < MAX_NB_TERMS; i++) {
            component += ' ' + Symbols.getOr() + ' ' + generateTerm(universe, ctx);
        }
    }
    return component;
}

function generateFormula(universe: Universe, ctx: Context): string {
    let formula = generateComponent(universe, ctx);

    let nbComponents = _random(1, MAX_NB_COMPONENTS);
    for (let i = 1; i < nbComponents; i++) {
        formula += ' ' + Symbols.getImplies() + ' ' + generateComponent(universe, ctx);
    }
    return formula;
}

function purgeSuccessiveDuplicateOps(formulaStr: string): string {
    let newFormulaStr = '';
    let lexer = new Lexer(formulaStr);
    lexer.goToNextToken();
    let c: string;
    while (!lexer.hasNoMoreChars()) {
        if (lexer.isOpeningSquareBracket()) {
            lexer.goToNextToken();
            c = Symbols.getAlways();
        } else if (lexer.isLessThanSign()) {
            lexer.goToNextToken();
            c = Symbols.getEventually();
        } else if (lexer.isDash()) {
            lexer.goToNextToken();
            c = Symbols.getImplies();
        } else {
            c = lexer.getCurrentToken();
        }

        if (!newFormulaStr.endsWith(c) || !Symbols.isOperator(c)) {
            newFormulaStr += c;
        }

        lexer.goToNextToken();
    }

    c = lexer.getCurrentToken();
    if (!newFormulaStr.endsWith(c) || !Symbols.isOperator(c)) {
        newFormulaStr += c;
    }
    return newFormulaStr;
}

/**
 * Defining ForumlaGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the universe to produce a formula that
 * refers to existing signals The maximum levels of recursion are fixed: 1)
 * maximum nested formulas: 3 2) maximum number of terms: 5 3) maximum number of
 * factors: 5
 */
export function generateTemporalFormula(universe: Universe): string {
    const f = purgeSuccessiveDuplicateOps(generateFormula(universe, {
        formulaLevel: 2,
    }));
    return generateProp(universe) + ' ' + Symbols.getEqual() + ' ' + f;
}
