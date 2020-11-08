import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

const ENTER_KEY_CODE = 13; // enter keycode is 13

/**
 * Create a directive that handle the 'enter' event when updating a signal or
 * a formula
 */
@Directive({
	selector: '[appOnEnter]',
})
export class OnEnterDirective {

	@Output('appOnEnter') eventEmitter = new EventEmitter();

	@HostListener('keypress', ['$event'])
	@HostListener('keydown', ['$event'])
	@HostListener('keyup', ['$event'])
	onKeyEvent(event: KeyboardEvent) {
		let key;
		if (event.keyCode != undefined) {
			key = event.keyCode;
		} else if (event.which != undefined) {
			key = event.which;
		}

		if (key === ENTER_KEY_CODE) {
			this.eventEmitter.emit(event);
			event.preventDefault();
		}
	}

}
