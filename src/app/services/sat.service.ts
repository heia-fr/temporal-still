import { Injectable, OnDestroy } from '@angular/core';
import { ModuleThread, spawn, Thread } from 'threads';

export type SATReport = {
    isSatisfiable: boolean;
    isTautology: boolean;
};

type SATWorker = {
    checkSatisfiable(formula: string): boolean;
    checkTautology(formula: string): boolean;
    checkInformation(formula: string): SATReport;
};

@Injectable({
	providedIn: 'root'
})
export class SATService implements OnDestroy {

	private worker: ModuleThread<SATWorker> | null = null;
	private readonly webWorkerAvailable: boolean;
	private readonly webWorkerLoaded: Promise<void>;

	constructor() {
		this.webWorkerAvailable = typeof Worker !== 'undefined';

		// Working on the main thread would block any other JavaScript
		// functions, therefore we run SAT in a separate thread.
		if (this.webWorkerAvailable) {
			console.log('[SAT Worker] Starting...');
			const worker = new Worker('../workers/sat.worker', { type: 'module' });
			this.webWorkerLoaded = spawn<SATWorker>(worker).then((thread) => {
				this.worker = thread;
				console.log('[SAT Worker] Started');
			}, (error) => {
				console.error('[SAT Worker] Unable to start', error);
			});
		} else {
			// Web Workers are not supported in this environment.
			console.log('[SAT Worker] Web Workers not supported or disabled');
			this.webWorkerLoaded = Promise.reject();
		}
	}

	async ngOnDestroy(): Promise<void> {
		if (this.worker != null) {
			console.error('[SAT Worker] Stopping...');
			await Thread.terminate(this.worker);
		}
	}

	isWebWorkerAvailable(): boolean {
		return this.webWorkerAvailable;
	}

	async isWebWorkerLoaded(): Promise<boolean> {
		try {
			await this.webWorkerLoaded;
			return true;
		} catch (err) {
			return false;
		}
	}

	async checkInformation(formula: string): Promise<SATReport | null> {
		if (this.worker == null) return null;
		return this.worker.checkInformation(formula);
	}
}
