import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import Symbols from 'src/engine/helpers/Symbols';
import Lexer from 'src/engine/analysers/Lexer';
import { TemporalEntitySyntaxDiagram } from 'src/engine/analysers';

/**
 * A directive to validate the entered signals or formula before
 * processing them in the universe
 */
@Directive({
	selector: '[appTemporalEntityValidator]',
	providers: [{ provide: NG_VALIDATORS, useExisting: TemporalEntityValidatorDirective, multi: true }],
})
export class TemporalEntityValidatorDirective implements Validator {

	constructor(protected signalsService: SignalsService) { }

	validate(control: AbstractControl): ValidationErrors | null {
		if (control.value == null) return null;
		let value = (control.value as string).trim();
		if (value.length == 0) return null;

		if (!TemporalEntitySyntaxDiagram.isValid(value)) {
			return { entity: "Invalid signal or formula" };
		}

		// Verify that all of the referenced signals exist
		// in the universe
		let entityInfo = value.split(Symbols.getEqual(), 2);
		let entityId = entityInfo[0].trim();
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

	validateIfVariable(formulaId: string, lexer: Lexer): ValidationErrors | null {
		if (!lexer.isVarName()) return null;

		var entityId = lexer.getCurrentToken();

		if (entityId == formulaId) {
			return { entity: "Formula cannot directly depends on itself" };
		}

		if (!this.signalsService.universe.containsEntity(entityId)) {
			return { entity: "Formula uses an unknown signal or formula" };
		}

		let deps = this.signalsService.universe.getAllDependencies(entityId);
		if (deps.indexOf(formulaId) >= 0) {
			return { entity: "Formula cannot indirectly depends on itself" };
		}

		return null;
	}

}
