import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Symbols from '../../engine/helpers/Symbols';
import TemporalFormulaLexer from '../../engine/analysers/TemporalFormulaLexer';

@Pipe({
	name: 'formulaFormatter'
})
export class FormulaFormatterPipe implements PipeTransform {

	constructor(protected sanitizer: DomSanitizer) { }

	transform(formula: string, ...args: unknown[]): SafeHtml {
		var tranformed: string;
		if (formula === Symbols.getEmpty()) {
			tranformed = Symbols.getEmpty();
		} else {
			let lexer: any = new TemporalFormulaLexer(formula);
			tranformed = Symbols.getEmpty();

			while (!lexer.hasNoMoreChars()) {
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

}
