import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Symbols from 'src/engine/helpers/Symbols';

@Pipe({
	name: 'signalFormatter'
})
export class SignalFormatterPipe implements PipeTransform {

	constructor(protected sanitizer: DomSanitizer) { }

	transform(signal: string, ...args: unknown[]): SafeHtml {
		let transformed: string;
		if (signal === Symbols.getEmpty()) {
			transformed = Symbols.getEmpty();
		} else {
			let parts = signal.split(Symbols.getEqual());
			let bodyParts = parts[1].split(Symbols.getSlash());
			transformed = `${parts[0]} ${Symbols.getEqual()} ${bodyParts[0]}<span style='text-decoration: overline;'>${bodyParts[1]}</span>`;
		}
		return this.sanitizer.bypassSecurityTrustHtml(transformed);
	}

}
