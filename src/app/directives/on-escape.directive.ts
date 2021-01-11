import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

const ESCAPE_KEY_CODE = 27; // esc keycode is 27

/**
 * Create a directive that handle the 'escape' event when updating a signal
 * or a formula
 */
@Directive({
	selector: '[appOnEcape]',
})
export class OnEscapeDirective {

	@Output('appOnEcape') eventEmitter = new EventEmitter();

	@HostListener('keypress', ['$event'])
	@HostListener('keydown', ['$event'])
	@HostListener('keyup', ['$event'])
	onKeyEvent(event: KeyboardEvent): void {
		let key;
		if (event.keyCode != undefined) {
			key = event.keyCode;
		} else if (event.which != undefined) {
			key = event.which;
		}

		if (key === ESCAPE_KEY_CODE) {
			this.eventEmitter.emit(event);
			event.preventDefault();
		}
	}

}
