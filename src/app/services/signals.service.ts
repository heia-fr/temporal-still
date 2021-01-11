import { Injectable } from '@angular/core';
import { Universe } from 'src/engine/business';
import TemporalEntityInterpreter from 'src/engine/analysers/TemporalEntityInterpreter';

@Injectable({
	providedIn: 'root'
})
export class SignalsService {

	private storage: Storage;

	public universeKey = 'universe';

	public universe: Universe;

	constructor() {
		this.storage = sessionStorage;
		this.universe = new Universe(null);
		this.restoreUniverse();
	}

	save(key: string, data: string): void {
		this.storage.setItem('alambic.' + key, data);
	}

	restore(key: string): string | null {
		return this.storage.getItem('alambic.' + key);
	}

	saveUniverse(): void {
		this.save(this.universeKey, JSON.stringify(this.universe));
	}

	restoreUniverse(): void {
		let newUniverse: Universe;
		let data = this.restore(this.universeKey);
		if (data) {
			newUniverse = JSON.parse(data, function(key, value): any {
				if (typeof (value) === 'object' && value.__type === 'Universe') {
					return new Universe(value);
				}
				return value;
			});
		} else {
			newUniverse = new Universe(null);
			const entities = [
				'b = 111000100011/1',
				'a = 110000101000/0',
				'f = b W !a',
				'g = !a W b',
				'h = <>(a & b)',
				'i = b & []!a'
			];
			for (let entity of entities) {
				let tf = TemporalEntityInterpreter.evaluate(entity, newUniverse);
				if (tf == null) {
					console.warn('Found invalid default entity: ' + entity);
				} else {
					newUniverse.putEntity(tf);
				}
			}
		}
		this.universe = newUniverse;
	}
}
