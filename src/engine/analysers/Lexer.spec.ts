import { Lexer } from 'src/engine/analysers';

interface TestData {
    nbTokens: number;
    expression: string;
}

const dataList: TestData[] = [
    { nbTokens: 0, expression: '' },
    { nbTokens: 1, expression: 'a' },
    { nbTokens: 3, expression: '(b)' },
    { nbTokens: 3, expression: 'c+d' },
    { nbTokens: 5, expression: 't.u+w' },
    { nbTokens: 5, expression: ' e  . f+ g' },
    { nbTokens: 5, expression: 'h  *iW k ' },
    { nbTokens: 10, expression: '(([](<>(l)' },
    { nbTokens: 7, expression: '(! (m)))' },
    { nbTokens: 6, expression: 'aannbb .!o + p' },
    { nbTokens: 11, expression: 'q+q+q+q+q+q' },
    { nbTokens: 22, expression: 'r    = 10110  1 0 1 0 0101/101001' },
];

function testLexicalAnalyzer(expr: string): TestData {
    const lex = new Lexer(expr);
    let nbTokens = 0;
    let expression = '';
    lex.goToNextToken();
    let t = lex.getCurrentToken();
    while (t !== '') {
        nbTokens++;
        expression += t;
        lex.goToNextToken();
        t = lex.getCurrentToken();
    }
    return { nbTokens, expression };
}

function trimSpaces(s: string): string {
    let res = '';
    let space = /\s/;
    for (let i = 0; i < s.length; i++) {
        let c = s.charAt(i);
        if (!space.test(c)) res += c;
    }
    return res;
}

describe('testing Lexer constructor', () => {
    dataList.forEach((data) => {

        const res = testLexicalAnalyzer(data.expression);
        const exprWithoutSpaces = trimSpaces(data.expression);

        it('"' + res.expression + '" should be "' + exprWithoutSpaces + '"', () => {
            expect(res.expression).toBe(exprWithoutSpaces);
            expect(res.nbTokens).toBe(data.nbTokens);
        });
    });
});
