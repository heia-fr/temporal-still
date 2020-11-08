import { Injectable } from '@angular/core';
import Universe from '../../engine/business/Universe';
import FormulasManager from '../../engine/business/FormulasManager';
import BooleanSignal from '../../engine/entities/BooleanSignal';
import TemporalFormula from '../../engine/entities/TemporalFormula';
import TemporalFormulaInterpreter from '../../engine/analysers/TemporalFormulaInterpreter';

@Injectable({
	providedIn: 'root'
})
export class SignalsService {

	private storage: Storage;

	public universeKey: string = 'universe';
	public formulasManagerKey: string = 'formulasManager';

	public universe: Universe;
	public formulasManager: FormulasManager;

	constructor() {
		this.storage = sessionStorage;
		this.universe = new Universe(null);
		this.formulasManager = new FormulasManager(null);
		this.restoreUniverse();
		this.restoreFormulasManager();
	}

	save(key: string, data: string) {
		this.storage.setItem("alambic." + key, data);
	}

	restore(key: string): string | null {
		return this.storage.getItem("alambic." + key);
	}

	saveUniverse() {
		this.save(this.universeKey, JSON.stringify(this.universe));
	}

	restoreUniverse() {
		var newUniverse: Universe;
		var data = this.restore(this.universeKey);
		if (data) {
			newUniverse = JSON.parse(data, function (key, value) {
				if (typeof (value) === 'object' && value.__type === 'Universe')
					return new Universe(value);
				return value;
			});
		} else {
			newUniverse = new Universe(null);
			const signals = ["b = 111000100011/1", "a = 110000101000/0"];
			for (let signal of signals) {
				newUniverse.addSignal(new BooleanSignal(signal, null));
			}
		}
		this.universe = newUniverse;
	}

	saveFormulasManager() {
		this.save(this.formulasManagerKey, JSON.stringify(this.formulasManager));
	}

	restoreFormulasManager() {
		var newFormulasManager: FormulasManager;
		var formulasManagerAsJson = this.restore(this.formulasManagerKey);
		if (formulasManagerAsJson) {
			newFormulasManager = JSON.parse(formulasManagerAsJson, function (key, value) {
				if (typeof (value) === 'object' && value.__type === 'FormulasManager')
					return new FormulasManager(value);

				return value;
			});
		} else {
			newFormulasManager = new FormulasManager(null);
			const tfs = ["f = b W !a", "g = !a W b", "h = <>(a & b)", "i = b & []!a"];
			for (let formula of tfs) {
				var tf = TemporalFormulaInterpreter.evaluate(formula, this.universe);
				if (tf instanceof TemporalFormula) {
					newFormulasManager.addFormula(tf);
				}
			}
		}
		this.formulasManager = newFormulasManager;
	}
}
