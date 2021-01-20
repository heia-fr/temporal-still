import { Component, OnInit } from '@angular/core';
import { Symbols } from 'src/engine/helpers';

function trustAsHtml(str: string): string {
	return str;
}

@Component({
	selector: 'app-howto',
	templateUrl: './howto.component.html'
})
export class HowToComponent implements OnInit {

	public symbols: any;

	constructor() {
		this.symbols = {};
		this.symbols.prettyAnd = trustAsHtml(Symbols.getPrettyAnd());
		this.symbols.prettyOr = trustAsHtml(Symbols.getPrettyOr());
		this.symbols.prettyImplies = trustAsHtml(Symbols.getPrettyImplies());
		this.symbols.prettyNot = trustAsHtml(Symbols.getPrettyNot());
		this.symbols.prettyEventually = trustAsHtml(Symbols.getPrettyEventually());
		this.symbols.prettyAlways = trustAsHtml(Symbols.getPrettyAlways());
		this.symbols.prettyNext = trustAsHtml(Symbols.getPrettyNext());
		this.symbols.equal = Symbols.getEqual();
		this.symbols.slash = Symbols.getSlash();
	}

	ngOnInit(): void { }

}
