
import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import Symbols from '../../engine/helpers/Symbols';
import Universe from '../../engine/business/Universe';
import TemporalFormulaLexer from '../../engine/analysers/TemporalFormulaLexer';
import TemporalFormulaSyntaxDiagram from '../../engine/analysers/TemporalFormulaSyntaxDiagram';
import { SignalsService } from '../services/signals.service';

/**
 * A directive to validate the formula being updated
 */
@Directive({
	selector: '[appEditableFormulaValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: EditableFormulaValidatorDirective, multi: true }],
})
export class EditableFormulaValidatorDirective implements Validator {

	@Input('appEditableFormulaValidator') params!: {
		editableFormula: any;
		signalsService: SignalsService;
	};

	constructor() { }

	validate(control: AbstractControl): ValidationErrors | null {
		let value = control.value as string;

		if (!value || value.length == 0 || !TemporalFormulaSyntaxDiagram.isValid(value)) {
			return { eformulas: "Invalid signal" };
		}

		var formulaArr = value.split(Symbols.getEqual());

		// the ID must not be changed
		var fId = formulaArr[0].trim();
		if (fId != this.params.editableFormula.id) {
			return { eformulas: "Formula name must not change" };
		}

		// Verify that all of the referenced signals exist in the
		// universe
		var lexer: any = new TemporalFormulaLexer(formulaArr[1].trim());
		while (!lexer.hasNoMoreChars()) {
			if (lexer.isVarName() && !this.params.signalsService.universe.containsSignal(lexer.getCurrentToken())) {
				return { eformulas: "Formula uses an unknown signal" };
			}
			lexer.goToNextToken();
		}
		if (lexer.isVarName() && !this.params.signalsService.universe.containsSignal(lexer.getCurrentToken())) {
			return { eformulas: "Formula uses an unknown signal" };
		}

		return null;
	}

}
