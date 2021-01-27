import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

/**
 * Create a directive the gives focus to the update editor being enabled
 */
@Directive({
	selector: '[appGainFocus]',
})
export class GainFocusDirective implements OnInit, OnChanges {

	@Input('appGainFocus') isFocused!: boolean;

	constructor(private hostElement: ElementRef) { }

	ngOnInit(): void { }

	ngOnChanges(): void {
		if (this.isFocused) {
			const element = this.hostElement.nativeElement;
			setTimeout(() => {
				element.focus();
			});
		}
	}
}
