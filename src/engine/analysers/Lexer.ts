import { Symbols } from 'src/engine/helpers';

/*******************************************************************************
 * Defining a base class "Lexer" using Combination Constructor/Prototype
 * Pattern. This is the most common way of defining custom types in JavaScript.
 * The constructor pattern defines instance properties, whereas the prototype
 * pattern defines methods and shared properties. With this approach, each
 * instance ends up with its own copy of the instance properties, but they all
 * share references to methods, conserving memory.
 ******************************************************************************/
export class Lexer {

    private readonly expressionString: string;
    private currentToken = Symbols.getEmpty();
    private nextCharIndex = 0;

    constructor(expressionString: string) {
        this.expressionString = expressionString.trim();
    }

    /**
     * Returns the current token
     */
    getCurrentToken(): string {
        return this.currentToken;
    }

    /**
     * Checks whether the string has no more characters left to parse
     */
    hasNoMoreChars(): boolean {
        return (this.nextCharIndex >= this.expressionString.length);
    }

    /**
     * Moves the cursor to the next token. The blank characters are
     * ignored. Letters are grouped together to form an identifier
     */
    goToNextToken(): void {
        this.currentToken = Symbols.getEmpty();
        if (this.hasNoMoreChars()) return;

        let pattern = /\s/; // match a space character
        let c = this.expressionString.charAt(this.nextCharIndex);
        while (pattern.test(c)) {
            this.nextCharIndex++;
            if (this.hasNoMoreChars()) return;

            c = this.expressionString.charAt(this.nextCharIndex);
        }
        if (this.hasNoMoreChars()) return;

        pattern = /[a-z]/; // match a lower-case letter
        c = this.expressionString.charAt(this.nextCharIndex);
        if (pattern.test(c)) {
            do {
                this.currentToken += c;
                this.nextCharIndex++;
                if (this.hasNoMoreChars()) return;

                c = this.expressionString.charAt(this.nextCharIndex);
            } while (pattern.test(c));
        } else {
            this.currentToken += c;
            this.nextCharIndex++;
        }
    }

    /**
     * Checks whether the current token is an variable name
     */
    isVarName(): boolean {
        return /[a-z]+/.test(this.currentToken);
    }

    /**
     * Checks whether the current token is an equal sign
     */
    isEqualSign(): boolean {
        return this.currentToken === Symbols.getEqual();
    }

    /**
     * Checks whether the current token is an opening bracket
     */
    isOpeningBracket(): boolean {
        return this.currentToken === Symbols.getOpeningBraket();
    }

    /**
     * Checks whether the current token is an closing bracket
     */
    isClosingBracket(): boolean {
        return this.currentToken === Symbols.getClosingBraket();
    }

    /**
     * Checks whether the current token is an empty string
     */
    isEmptyToken(): boolean {
        return this.currentToken === Symbols.getEmpty();
    }

    /**
     * Checks whether the current token is a zero
     */
    isZero(): boolean {
        return this.getCurrentToken() === Symbols.getZero();
    }

    /**
     * Checks whether the current token is a one
     */
    isOne(): boolean {
        return this.getCurrentToken() === Symbols.getOne();
    }

    /**
     * Checks whether the current token is a slash
     */
    isSlash(): boolean {
        return this.getCurrentToken() === Symbols.getSlash();
    }

    /**
     * Checks whether the current token is an or ('|')
     */
    isOr(): boolean {
        return (this.getCurrentToken() === Symbols.getOr());
    }

    /**
     * Checks whether the current token is an and ('&')
     */
    isAnd(): boolean {
        return (this.getCurrentToken() === Symbols.getAnd());
    }

    /**
     * Checks whether the current token is a dash ('-')
     */
    isDash(): boolean {
        return this.getCurrentToken() === Symbols.getDash();
    }

    /**
     * Checks whether the current token is a not ('!')
     */
    isNot(): boolean {
        return this.getCurrentToken() === Symbols.getNot();
    }

    /**
     * Checks whether the current token is an opening square bracket
     */
    isOpeningSquareBracket(): boolean {
        return this.getCurrentToken() === Symbols.getOpeningSquareBraket();
    }

    /**
     * Checks whether the current token is a closing square bracket
     */
    isClosingSquareBracket(): boolean {
        return this.getCurrentToken() === Symbols.getClosingSquareBraket();
    }

    /**
     * Checks whether the current token is a less than sign
     */
    isLessThanSign(): boolean {
        return this.getCurrentToken() === Symbols.getLessThan();
    }

    /**
     * Checks whether the current token is a greater than sign
     */
    isGreaterThanSign(): boolean {
        return this.getCurrentToken() === Symbols.getGreaterThan();
    }

    /**
     * Checks whether the current token is a weak until sign
     */
    isWeaklyUntil(): boolean {
        return this.getCurrentToken() === Symbols.getWeakUntil();
    }

    /**
     * Checks whether the current token is a next sign
     */
    isNext(): boolean {
        return this.getCurrentToken() === Symbols.getNext();
    }

    /**
     * Checks whether the current token is a until sign
     */
    isUntil(): boolean {
        return this.getCurrentToken() === Symbols.getUntil();
    }

    /**
     * Checks whether the current token is a release sign
     */
    isRelease(): boolean {
        return this.getCurrentToken() === Symbols.getRelease();
    }
}
