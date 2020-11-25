import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import Symbols from 'src/engine/helpers/Symbols';
import Lexer from 'src/engine/analysers/Lexer';
import { TemporalEntitySyntaxDiagram } from 'src/engine/analysers';
import { SignalsService } from '../services/signals.service';
import { TemporalEntityValidatorDirective } from './temporal-entity.validator';

/**
 * Verifies the input signal and set the validity of the input element. The
 * input must verify the following criteria: -> the input must be a single
 * valid signal with no semicolons.
 */
@Directive({
	selector: '[appEditableTemporalEntityValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: EditableTemporalEntityValidatorDirective, multi: true }],
})
export class EditableTemporalEntityValidatorDirective extends TemporalEntityValidatorDirective {

	@Input('appEditableTemporalEntityValidator') editableEntity!: any;

	constructor(signalsService: SignalsService) {
		super(signalsService);
	}

	validate(control: AbstractControl): ValidationErrors | null {
		if (control.value == null) return null;

		let value = (control.value as string).trim();
		if (value.length == 0) return null;

		if (!TemporalEntitySyntaxDiagram.isValid(value)) {
			return { entity: "Invalid signal or formula" };
		}

		let entityInfo = value.split(Symbols.getEqual(), 2);

		// the ID must not be changed
		let entityId = entityInfo[0].trim();
		if (entityId != this.editableEntity.id) {
			return { entity: "Formula or Signal name must not change" };
		}

		// Verify that all of the referenced signals exist
		// in the universe
		var lexer = new Lexer(entityInfo[1].trim());
		while (!lexer.hasNoMoreChars()) {
			let errs = this.validateIfVariable(entityId, lexer);
			if (errs) return errs;
			lexer.goToNextToken();
		}
		let errs = this.validateIfVariable(entityId, lexer);
		if (errs) return errs;

		return null;
	}

}
