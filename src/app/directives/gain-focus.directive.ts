import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Create a directive the gives focus to the update editor being enabled
 */
@Directive({
	selector: '[appGainFocus]',
})
export class GainFocusDirective implements OnInit {

	@Input('appGainFocus') isFocused!: boolean;

	constructor(private hostElement: ElementRef) { }

	ngOnInit(): void { }

	ngOnChanges() {
		if (this.isFocused) {
			let element = this.hostElement.nativeElement;
			setTimeout(function () {
				element.focus();
			});
		}
	}
}