import { Component, OnInit } from '@angular/core';
import { Symbols } from 'src/engine/helpers';

@Component({
    selector: 'app-howto',
    templateUrl: './howto.component.html'
})
export class HowToComponent implements OnInit {

    public symbols = {
        prettyAnd: Symbols.getPrettyAnd(),
        prettyOr: Symbols.getPrettyOr(),
        prettyImplies: Symbols.getPrettyImplies(),
        prettyNot: Symbols.getPrettyNot(),
        prettyEventually: Symbols.getPrettyEventually(),
        prettyAlways: Symbols.getPrettyAlways(),
        prettyNext: Symbols.getPrettyNext(),
        equal: Symbols.getEqual(),
        slash: Symbols.getSlash(),
    };

    constructor() { }

    ngOnInit(): void { }

}
