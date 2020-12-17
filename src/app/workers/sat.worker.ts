/// <reference lib="webworker" />
import { expose } from "threads/worker";
import "src/engine/polyfills/SetExtension";
import { SAT, TemporalEntitySyntaxTree } from "src/engine/analysers";

export type SATReport = { isSatisfiable: boolean, isTautology: boolean };

const worker = {

	checkSatisfiable(formula: string): boolean {
		return SAT.isSatisfiable(formula);
	},

	checkTautology(formula: string): boolean {
		return SAT.isTautology(formula);
	},

	checkInformation(formula: string): SATReport {
        let ast = TemporalEntitySyntaxTree.parse(formula).content;
        let isSatisfiable = SAT.isSatisfiable(ast);
        // Check Tautology only if formula is Satisfiable
        let isTautology = isSatisfiable && SAT.isTautology(ast);
        return {
            isSatisfiable,
            isTautology,
        };
	},
}

export type SATWorker = typeof worker;

expose(worker);
