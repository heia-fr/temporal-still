
export class Automata<N, T> {

	constructor(public readonly states: Set<N>,
		public readonly transitions: Map<N, T>,
		public readonly start: Set<N>,
		public readonly finish: Set<N>[]) {
	}
}
