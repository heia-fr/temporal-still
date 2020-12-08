import { Injectable, OnDestroy } from '@angular/core';
import { spawn, Thread } from "threads"

export type SATReport = { isSatisfiable: boolean, isTautology: boolean };
interface SATWorker {
	checkInformation(formula: string): Promise<SATReport>;
}

@Injectable({
	providedIn: 'root'
})
export class SATService implements OnDestroy {

	private worker: SATWorker | null = null;
	private readonly webWorkerAvailable: boolean;
	private readonly webWorkerLoaded: Promise<void>;

	constructor() {
		this.webWorkerAvailable = typeof Worker !== 'undefined';

		// Working on the main thread would block any other JavaScript
		// functions, therefore we run SAT in a separate thread.
		if (this.webWorkerAvailable) {
			console.log("[SAT Worker] Starting...");
			const worker = new Worker('../workers/sat.worker', { type: 'module' });
			this.webWorkerLoaded = spawn<any>(worker).then((worker) => {
				this.worker = worker as any as SATWorker;
				console.log("[SAT Worker] Started");
			}, (error) => {
				console.error("[SAT Worker] Unable to start", error);
			});
		} else {
			// Web Workers are not supported in this environment.
			console.log("[SAT Worker] Web Workers not supported or disabled");
			this.webWorkerLoaded = Promise.reject();
		}
	}

	ngOnDestroy(): void {
		if (this.worker != null) {
			console.error("[SAT Worker] Stopping...");
			Thread.terminate(this.worker as any);
		}
	}

	isWebWorkerAvailable() {
		return this.webWorkerAvailable;
	}

	async isWebWorkerLoaded() {
		try {
			await this.webWorkerLoaded;
			return true;
		} catch (err) {
			return false;
		}
	}

	async checkInformation(formula: string): Promise<SATReport | null> {
		if (this.worker == null) return null;
		return await this.worker.checkInformation(formula);
	}
}
