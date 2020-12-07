/// <reference lib="webworker" />
import { expose } from "threads/worker"

const worker = {

	sayHello(str1: string, str2: string, str3: string) {
		return [str1, str2].join(' ') + str3;
	},
}

export type SATWorker = typeof worker;

expose(worker);
