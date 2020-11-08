import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import Symbols from '../../engine/helpers/Symbols';
import BooleanSignalSyntaxDiagram from '../../engine/analysers/BooleanSignalSyntaxDiagram';

/**
 * A directive to validate the entered signals before processing them in the
 * controller
 */
@Directive({
	selector: '[appSignalValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: SignalValidatorDirective, multi: true }],
})
export class SignalValidatorDirective implements Validator {

	@Input('appSignalValidator') signalsService!: SignalsService;

	constructor() { }

	validate(control: AbstractControl): ValidationErrors | null {
		let value = control.value as string;

		if (!BooleanSignalSyntaxDiagram.isValid(control.value)) {
			return { signals: "Invalid signal" };
		} else if (value.length != 0) {
			// if the signals are correct, verify that the ids
			// doesn't conflict with the formulas IDs
			var signalsArray = value.split(Symbols.getSemiColon());
			if (signalsArray[signalsArray.length - 1] === Symbols.getEmpty()) {
				signalsArray.splice(signalsArray.length - 1, 1);
			}

			for (let signalStr of signalsArray) {
				var signalParts = signalStr.split(Symbols.getEqual())[0].trim();
				if (this.signalsService.formulasManager.containsFormula(signalParts)) {
					return { signals: "Signal name conflicts with a formula name" };
				}
			}
		}

		return null;
	}

}
