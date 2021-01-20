import { Component, OnInit } from '@angular/core';
import { Symbols } from 'src/engine/helpers';

@Component({
    selector: 'app-howto',
    templateUrl: './howto.component.html'
})
export class HowToComponent implements OnInit {

    public symbols: any;

    constructor() {
        this.symbols = {};
        this.symbols.prettyAnd = Symbols.getPrettyAnd();
        this.symbols.prettyOr = Symbols.getPrettyOr();
        this.symbols.prettyImplies = Symbols.getPrettyImplies();
        this.symbols.prettyNot = Symbols.getPrettyNot();
        this.symbols.prettyEventually = Symbols.getPrettyEventually();
        this.symbols.prettyAlways = Symbols.getPrettyAlways();
        this.symbols.prettyNext = Symbols.getPrettyNext();
        this.symbols.equal = Symbols.getEqual();
        this.symbols.slash = Symbols.getSlash();
    }

    ngOnInit(): void { }

}
