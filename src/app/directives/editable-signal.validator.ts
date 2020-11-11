import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import Symbols from 'src/engine/helpers/Symbols';
import { TemporalEntitySyntaxDiagram } from 'src/engine/analysers';

/**
 * Verifies the input signal and set the validity of the input element. The
 * input must verify the following criteria: -> the input must be a single
 * valid signal with no semicolons. e.g. a = 10101/11 -> the identifier of a
 * signal must not conflict with an other signal's identifier
 */
@Directive({
	selector: '[appEditableSignalValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: EditableSignalValidatorDirective, multi: true }],
})
export class EditableSignalValidatorDirective implements Validator {

	@Input('appEditableSignalValidator') editableSignal!: any;

	constructor() { }

	validate(control: AbstractControl): ValidationErrors | null {
		let value = control.value as string;

		if (!value || value.length == 0 || !TemporalEntitySyntaxDiagram.isValidSignal(value)) {
			return { esignals: "Invalid signal" };
		}

		// the ID must not be changed
		var sId = value.split(Symbols.getEqual())[0].trim();
		if (sId != this.editableSignal.id) {
			return { esignals: "Signal name must not change" };
		}

		return null;
	}

}
