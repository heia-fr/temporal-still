import { Symbols } from 'src/engine/helpers';
import { Lexer } from './Lexer';

/**
 * EBNF:
 * Expression ::= VarName '=' (Formula|Signal)
 * FormulaExpr ::= VarName '=' Formula
 * SignalExpr ::= VarName '=' Signal
 *
 * Signal ::= Digits '/' Digits
 * Digits ::= ('0'|'1')+
 *
 * Formula ::= Component ('-' '>' Component)*
 * Component ::= Term ('|' Term)*
 * Term ::= Factor ('&' Factor)*
 * Factor ::= Atom (('W' Atom)|('U' Atom)|('R' Atom))?
 * Atom ::= ('(' (Formula|Signal) ')')('X' Atom)|('!' Atom)|('[' ']' Atom)|('<' '>' Atom)|(Prop)
 * Prop ::= VarName
 *
 * VarName ::= Letter+
 * Letter ::= 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'
 */
function parseExpression(lexer: Lexer): void {
    if (!lexer.isVarName()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected valid variable name');
    }
    lexer.goToNextToken();

    if (!lexer.isEqualSign()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getEqual());
    }
    lexer.goToNextToken();

    if (lexer.isZero() || lexer.isOne()) {
        parseSignal(lexer);
    } else {
        parseFormula(lexer);
    }

    if (!lexer.isEmptyToken()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected end of formula');
    }
}

function parseFormulaExpr(lexer: Lexer): void {
    if (!lexer.isVarName()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected valid variable name');
    }
    lexer.goToNextToken();

    if (!lexer.isEqualSign()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getEqual());
    }
    lexer.goToNextToken();

    parseFormula(lexer);

    if (!lexer.isEmptyToken()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected end of formula');
    }
}

function parseSignalExpr(lexer: Lexer): void {
    if (!lexer.isVarName()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected valid variable name');
    }
    lexer.goToNextToken();

    if (!lexer.isEqualSign()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected equal sign');
    }
    lexer.goToNextToken();

    parseSignal(lexer);

    if (!lexer.isEmptyToken()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected end of signals');
    }
}

function parseSignal(lexer: Lexer): void {
    parseDigits(lexer);

    if (!lexer.isSlash()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected slash sign');
    }
    lexer.goToNextToken();

    parseDigits(lexer);
}

function parseDigits(lexer: Lexer): void {
    if (!(lexer.isZero() || lexer.isOne())) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected 0 or 1');
    }
    lexer.goToNextToken();

    while (lexer.isZero() || lexer.isOne()) {
        lexer.goToNextToken();
    }
}

function parseFormula(lexer: Lexer): void {
    parseComponent(lexer);

    while (lexer.isDash()) {
        lexer.goToNextToken();

        if (!lexer.isGreaterThanSign()) {
            throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getGreaterThan());
        }
        lexer.goToNextToken();

        parseComponent(lexer);
    }
}

function parseComponent(lexer: Lexer): void {
    parseTerm(lexer);

    while (lexer.isOr()) {
        lexer.goToNextToken();
        parseTerm(lexer);
    }
}

function parseTerm(lexer: Lexer): void {
    parseFactor(lexer);

    while (lexer.isAnd()) {
        lexer.goToNextToken();
        parseFactor(lexer);
    }
}

function parseFactor(lexer: Lexer): void {
    parseAtom(lexer);

    if (lexer.isWeaklyUntil()) {
        lexer.goToNextToken();
        parseAtom(lexer);
    } else if (lexer.isUntil()) {
        lexer.goToNextToken();
        parseAtom(lexer);
    } else if (lexer.isRelease()) {
        lexer.goToNextToken();
        parseAtom(lexer);
    }
}

function parseAtom(lexer: Lexer): void {
    if (lexer.isOpeningBracket()) {
        lexer.goToNextToken();

        if (lexer.isZero() || lexer.isOne()) {
            parseSignal(lexer);
        } else {
            parseFormula(lexer);
        }

        if (!lexer.isClosingBracket()) {
            throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getClosingBraket());
        }
        lexer.goToNextToken();

    } else if (lexer.isNext()) {
        lexer.goToNextToken();

        parseAtom(lexer);

    } else if (lexer.isNot()) {
        lexer.goToNextToken();

        parseAtom(lexer);

    } else if (lexer.isOpeningSquareBracket()) {
        lexer.goToNextToken();

        if (!lexer.isClosingSquareBracket()) {
            throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getClosingSquareBraket());
        }
        lexer.goToNextToken();

        parseAtom(lexer);

    } else if (lexer.isLessThanSign()) {
        lexer.goToNextToken();

        if (!lexer.isGreaterThanSign()) {
            throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected ' + Symbols.getGreaterThan());
        }
        lexer.goToNextToken();

        parseAtom(lexer);

    } else {
        parseProp(lexer);
    }
}

function parseProp(lexer: Lexer): void {
    if (!lexer.isVarName()) {
        throw new SyntaxError('TemporalEntitySyntaxDiagram: Expected valid variable name');
    }
    lexer.goToNextToken();
}

function isValid(expression: string, parser: (lexer: Lexer) => void): boolean {
    // permit empty string (that's to be validated in the view)
    if (expression === Symbols.getEmpty()) { return true; }

    const lexer = new Lexer(expression);
    try {
        lexer.goToNextToken();
        parser(lexer);
    } catch (ex) {
        return false;
    }
    return lexer.hasNoMoreChars();
}

/*******************************************************************************
 * Defining SyntaxDiagram for boolean signals using Combination
 * Constructor/Prototype Pattern
 ******************************************************************************/
export const TemporalEntitySyntaxDiagram = {
    isValidSignal(expression: string): boolean {
        return isValid(expression, parseSignalExpr);
    },
    isValidFormula(expression: string): boolean {
        return isValid(expression, parseFormulaExpr);
    },
    isValid(expression: string): boolean {
        return isValid(expression, parseExpression);
    },
};
