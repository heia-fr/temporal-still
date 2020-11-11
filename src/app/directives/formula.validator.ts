import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import Symbols from 'src/engine/helpers/Symbols';
import TemporalFormulaSyntaxDiagram from 'src/engine/analysers/TemporalFormulaSyntaxDiagram';
import TemporalFormulaLexer from 'src/engine/analysers/TemporalFormulaLexer';

/**
 * A directive to validate the formula entered before processing it in the
 * controller
 */
@Directive({
	selector: '[appFormulaValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: FormulaValidatorDirective, multi: true }],
})
export class FormulaValidatorDirective implements Validator {

	@Input('appFormulaValidator') signalsService!: SignalsService;

	constructor() { }

	validate(control: AbstractControl): ValidationErrors | null {
		let value = control.value as string;

		if (!TemporalFormulaSyntaxDiagram.isValid(value)) {
			return { formulas: "Invalid formula" };
		}

		if (value.length != 0) {
			// if the the formula is correct, verify that its ID
			// does'nt conflict with the signals IDs
			var formulaArr = value.split(Symbols.getEqual());
			if (this.signalsService.universe.containsSignal(formulaArr[0].trim())) {
				return { formulas: "Formula name conflicts with a signal name" };
			}

			// Verify that all of the referenced signals exist
			// in the universe
			var lexer: any = new TemporalFormulaLexer(formulaArr[1].trim());
			while (!lexer.hasNoMoreChars()) {
				if (lexer.isVarName() && !this.signalsService.universe.containsSignal(lexer.getCurrentToken())) {
					return { formulas: "Formula uses an unknown signal" };
				}
				lexer.goToNextToken();
			}
			if (lexer.isVarName() && !this.signalsService.universe.containsSignal(lexer.getCurrentToken())) {
				return { formulas: "Formula uses an unknown signal" };
			}
		}

		return null;
	}

}
