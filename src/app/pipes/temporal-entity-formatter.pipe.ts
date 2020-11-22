import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Symbols from 'src/engine/helpers/Symbols';
import Lexer from 'src/engine/analysers/Lexer';

@Pipe({
	name: 'temporalEntityFormatter'
})
export class TemporalEntityFormatterPipe implements PipeTransform {

	constructor(protected sanitizer: DomSanitizer) { }

	transform(formula: string, ...args: unknown[]): SafeHtml {
		var tranformed: string;
		if (formula === Symbols.getEmpty()) {
			tranformed = Symbols.getEmpty();
		} else {
			let lexer = new Lexer(formula);
			tranformed = Symbols.getEmpty();

			while (!lexer.hasNoMoreChars()) {
				if (lexer.isOne() || lexer.isZero()) {
					tranformed += this.transformSignal(lexer);
				}
				if (lexer.isAnd()) {
					tranformed += " " + Symbols.getPrettyAnd() + " ";
				} else if (lexer.isOr()) {
					tranformed += " " + Symbols.getPrettyOr() + " ";
				} else if (lexer.isDash()) {
					lexer.goToNextToken();
					tranformed += " " + Symbols.getPrettyImplies() + " ";
				} else if (lexer.isNot()) {
					tranformed += Symbols.getPrettyNot();
				} else if (lexer.isOpeningSquareBracket()) {
					lexer.goToNextToken();
					tranformed += Symbols.getPrettyAlways();
				} else if (lexer.isLessThanSign()) {
					lexer.goToNextToken();
					tranformed += Symbols.getPrettyEventually();
				} else if (lexer.isWeaklyUntil() || lexer.isEqualSign()) {
					tranformed += " " + lexer.getCurrentToken() + " ";
				} else {
					tranformed += lexer.getCurrentToken();
				}
				lexer.goToNextToken();
			}
			tranformed += lexer.getCurrentToken();
		}
		return this.sanitizer.bypassSecurityTrustHtml(tranformed);
	}

	transformSignal(lexer: Lexer): string {
		let formatted = Symbols.getEmpty();

		// Iterate all 0 and 1
		while (lexer.isOne() || lexer.isZero()) {
			formatted += lexer.getCurrentToken();
			lexer.goToNextToken();
		}

		// After body part there must be a /
		if (!lexer.isSlash())
			throw new SyntaxError("Expected slash sign");
		lexer.goToNextToken();

		formatted += "<span style='text-decoration: overline;'>";

		// Iterate all 0 and 1
		while (lexer.isOne() || lexer.isZero()) {
			formatted += lexer.getCurrentToken();
			lexer.goToNextToken();
		}

		formatted += "</span>";

		return formatted;
	}

}
