import {
	IEquatable, BinaryOperator, Formula, Variable, Operator,
	UnaryOperator, And, Or, Next, Until, Release, Constant, Not
} from './Operators';

function has<E extends IEquatable<E>>(set: Set<E>, search: E): boolean {
	for (let item of set) {
		if (search.equals(item)) return true;
	}
	return false;
}
function addIfNotPresent<E extends IEquatable<E>>(set: Set<E>, item: E): boolean {
	if (has(set, item)) return false;
	set.add(item);
	return true;
}

type IdGenerator = (this: void) => number;

export class BNode {

	public readonly incoming: Set<BNode> = new Set();
	public readonly now: Set<Operator> = new Set();
	public readonly next: Set<Operator> = new Set();

	constructor(public readonly id: number) { }

}

function generateExpressions(initOp: Operator): Set<Operator> {
	function func(op: Operator, set: Set<Operator>) {
		addIfNotPresent(set, op);
		addIfNotPresent(set, op.negate().toNNF());
		if (op instanceof UnaryOperator) {
			func(op.content, set);
		} else if (op instanceof BinaryOperator) {
			func(op.left, set);
			func(op.right, set);
		}
	}

	let newSet = new Set<Operator>();
	newSet.add(Constant.TRUE);
	newSet.add(Constant.FALSE);
	func(initOp, newSet);
	return newSet;
}

function curr1(f: Operator): Set<Operator> {
	if (f instanceof Until) return new Set<Operator>().add(f.left);
	if (f instanceof Release || f instanceof Or) return new Set<Operator>().add(f.right);
	throw new Error('undefined for ' + f);
}

function curr2(f: Operator): Set<Operator> {
	if (f instanceof Until) return new Set<Operator>().add(f.right);
	if (f instanceof Release) return new Set<Operator>().add(f.left).add(f.right);
	if (f instanceof Or) return new Set<Operator>().add(f.left);
	throw new Error('undefined for ' + f);
}

function next1(f: Operator): Set<Operator> {
	if (f instanceof Until || f instanceof Release) return new Set<Operator>().add(f);
	if (f instanceof Or) return new Set<Operator>();
	throw new Error('undefined for ' + f);
}

function isBase(f: Operator): boolean {
	return f instanceof Constant || f instanceof Variable || (f instanceof Not && f.content instanceof Variable);
}


export class GeneralizedBuchiAutomata {

    public constructor(public readonly states: Set<BNode>,
        public readonly transitions: Map<BNode, BNode[]>,
        public readonly start: Set<BNode>,
        public readonly finish: Set<BNode>[]) {
    }

	static fromLTL(op: Operator): GeneralizedBuchiAutomata {
		let counter = 0;
		let nodes = new Set<BNode>();
		let init = new BNode(counter++);

		this.expand(new Set<Operator>().add(op), new Set(), new Set(), new Set<BNode>().add(init), () => {
			return counter++;
		}, nodes);

		return this.fromNodes(op, nodes, init);
	}

	static fromNodes(initOp: Operator, nodes: Set<BNode>, init: BNode): GeneralizedBuchiAutomata {
		let delta = new Map<BNode, BNode[]>();
		for (let node of nodes) {
			for (let from of node.incoming) {
				if (from === init) continue;
				delta.merge(from, [node], (a, b) => [...a, ...b]);
			}
		}

		let start = new Set([...nodes].filter(n => n.incoming.has(init)));
		let expressions = generateExpressions(initOp);
		let finish: Set<BNode>[] = [];
		for (let op of expressions) {
			if (op instanceof Until) {
				let newSet = new Set<BNode>();
				for (let node of nodes) {
					if (node.now.has(op.right) || !node.now.has(op)) {
						newSet.add(node);
					}
				}
				finish.push(newSet);
			}
		}

		return new GeneralizedBuchiAutomata(nodes, delta, start, finish);
	}

	/**
	 * Source: https://en.wikipedia.org/wiki/Linear_temporal_logic_to_Büchi_automaton#Gerth_et_al._algorithm
	 * Date: 02.12.2020
	 */
	private static expand(curr: Set<Operator>, old: Set<Operator>, next: Set<Operator>, incoming: Set<BNode>, idGenerator: IdGenerator, nodes: Set<BNode>): void {
		if (curr.size === 0) {
			let r = null;
			for (let n of nodes) {
				if (n.next.contentEquals(next) && n.now.contentEquals(old)) {
					r = n;
					break;
				}
			}

			if (r != null) {
				r.incoming.addAll(incoming);
			} else {
				r = new BNode(idGenerator());
				nodes.add(r);
				r.incoming.addAll(incoming);
				r.now.addAll(old);
				r.next.addAll(next);
				this.expand(r.next, new Set(), new Set(), new Set<BNode>().add(r), idGenerator, nodes);
			}
		} else {
			let f = curr.first();
			if (f == null) throw new Error('Empty Set');

			curr = new Set(curr);
			curr.delete(f);

			old = new Set(old).add(f);

			if (isBase(f)) {
				if (f === Constant.FALSE || has(old, f.negate())) return;
				this.expand(curr, old, next, incoming, idGenerator, nodes);

			} else if (f instanceof And) {
				let additional = new Set<Operator>().add(f.left).add(f.right);
				additional.deleteAll(old);
				curr.addAll(additional);
				this.expand(curr, old, next, incoming, idGenerator, nodes);

			} else if (f instanceof Next) {
				let newNext = new Set(next);
				newNext.add(f.content);
				this.expand(curr, old, newNext, incoming, idGenerator, nodes);

			} else if (f instanceof Or || f instanceof Until || f instanceof Release) {
				let curr1Set = curr1(f);
				curr1Set.deleteAll(old);
				curr1Set.addAll(curr);
				let newNext = new Set(next);
				newNext.addAll(next1(f));
				this.expand(curr1Set, old, newNext, incoming, idGenerator, nodes);

				let curr2Set = curr2(f);
				curr2Set.deleteAll(old);
				curr2Set.addAll(curr);
				this.expand(curr2Set, old, next, incoming, idGenerator, nodes);

			} else {
				throw new Error('Not in Negative Normal Form');
			}
		}
	}
}
