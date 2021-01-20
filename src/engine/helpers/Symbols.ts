/**
 * This an utility class that provides a set of symbols used in this application
 */
const symbols = {
    empty: '',
    equal: '=',
    zero: '0',
    one: '1',
    slash: '/',
    openingBraket: '(',
    closingBraket: ')',
    openingSquareBracket: '[',
    closingSquareBracket: ']',
    lessThan: '<',
    greaterThan: '>',
    dash: '-',
    implies: '->',
    not: '!',
    eventually: '<>',
    next: 'X',
    always: '[]',
    release: 'R',
    until: 'U',
    weakUntil: 'W',
    and: '&',
    or: '|',
    prettyAnd: '&#8743;',
    prettyOr: '&#8744;',
    prettyAlways: '&#9723;',
    prettyEventually: '&#9674;',
    prettyNot: '&#172;',
    prettyImplies: '&#8594;',
    charSet: 'abcdefghijklmnopqrstuvwxyz',
    tautology: '&#8872;',
};

const UNARY_OPS = [
    symbols.not,
    symbols.always,
    symbols.eventually,
    symbols.next,
];

const BINARY_OPS = [
    symbols.and,
    symbols.or,
    symbols.weakUntil,
    symbols.implies,
    symbols.until,
    symbols.release,
];

export const Symbols = {
    getEmpty(): string {
        return symbols.empty;
    },
    getEqual(): string {
        return symbols.equal;
    },
    getZero(): string {
        return symbols.zero;
    },
    getOne(): string {
        return symbols.one;
    },
    getSlash(): string {
        return symbols.slash;
    },
    getOpeningBraket(): string {
        return symbols.openingBraket;
    },
    getClosingBraket(): string {
        return symbols.closingBraket;
    },
    getOpeningSquareBraket(): string {
        return symbols.openingSquareBracket;
    },
    getClosingSquareBraket(): string {
        return symbols.closingSquareBracket;
    },
    getLessThan(): string {
        return symbols.lessThan;
    },
    getGreaterThan(): string {
        return symbols.greaterThan;
    },
    getDash(): string {
        return symbols.dash;
    },
    getNot(): string {
        return symbols.not;
    },
    getEventually(): string {
        return symbols.eventually;
    },
    getNext(): string {
        return symbols.next;
    },
    getUntil(): string {
        return symbols.until;
    },
    getRelease(): string {
        return symbols.release;
    },
    getAlways(): string {
        return symbols.always;
    },
    getWeakUntil(): string {
        return symbols.weakUntil;
    },
    getAnd(): string {
        return symbols.and;
    },
    getOr(): string {
        return symbols.or;
    },
    getImplies(): string {
        return symbols.implies;
    },
    getPrettyAnd(): string {
        return symbols.prettyAnd;
    },
    getPrettyOr(): string {
        return symbols.prettyOr;
    },
    getPrettyAlways(): string {
        return symbols.prettyAlways;
    },
    getPrettyEventually(): string {
        return symbols.prettyEventually;
    },
    getPrettyNext(): string {
        // Real pretty next: &#9711;
        return symbols.next;
    },
    getPrettyUntil(): string {
        return symbols.until;
    },
    getPrettyRelease(): string {
        return symbols.release;
    },
    getPrettyImplies(): string {
        return symbols.prettyImplies;
    },
    getPrettyNot(): string {
        return symbols.prettyNot;
    },
    getCharSet(): string {
        return symbols.charSet;
    },
    isUnaryOp(op: string): boolean {
        return UNARY_OPS.indexOf(op) >= 0;
    },
    isBinaryOp(op: string): boolean {
        return BINARY_OPS.indexOf(op) >= 0;
    },
    isOperator(symbol: string): string {
        return (this.isUnaryOp(symbol) || this.isBinaryOp(symbol));
    }
};
