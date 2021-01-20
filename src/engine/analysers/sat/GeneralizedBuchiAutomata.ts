import BitSet from 'bitset';
import { Graph, GNode, GEdge } from './Graph';
import {
	IEquatable, Variable, Operator,
	And, Or, Next, Until, Release, Constant, Not
} from './Operators';

function has<E extends IEquatable<E>>(set: Set<E>, search: E): boolean {
    for (const item of set) {
        if (search.equals(item)) return true;
    }
    return false;
}

type IdGenerator = (this: void) => number;

export class State {
    public RepresentativeId = -1;
    public readonly Transitions: Transition[] = [];
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

export class Transition {

    private readonly accepting: BitSet;

    constructor(private readonly destination: number, acc: BitSet, private readonly acceptingConds: number) {
        this.accepting = acc.clone();
    }

    public transform(nodes: GNode[], node: GNode): void {
        const e = new GEdge(node, nodes[this.destination]);
        if (this.acceptingConds === 0) {
            e.Attributes.set('acc0', true);
        } else {
            for (let i = 0; i < this.acceptingConds; i++) {
                if (!this.accepting.get(i)) {
                    e.Attributes.set('acc' + i, true);
                }
            }
        }
    }
}

export class GeneralizedBuchiAutomata {
    public readonly Nodes: BNode[] = [];

    public static fromLTL(op: Operator): GeneralizedBuchiAutomata {
        // Create Initial node
        let counter = 0;
        const init = new BNode(counter++, op.processUntils(0));
        if (!(op instanceof Constant) || op === Constant.FALSE) {
            init.Next.add(op);
        }

        // Create Automata and expand Init node
        // using Gerth et al. algorithm
        const automata = new GeneralizedBuchiAutomata();
        init.expand(automata.Nodes, () => {
            return counter++;
        });

        return automata;
    }

    public toGraph(automata: State[]): Graph {
        const g = new Graph();
        const nodes: GNode[] = [];
        for (let i = 0; i < automata.length; i++) {
            if (automata[i] == null) continue;
            if (i !== automata[i].RepresentativeId) continue;
            nodes[i] = new GNode(g, 'S' + automata[i].RepresentativeId);
        }

        for (let i = 0; i < automata.length; i++) {
            if (automata[i] == null) continue;
            if (i !== automata[i].RepresentativeId) continue;

            for (const t of automata[i].Transitions) {
                t.transform(nodes, nodes[i]);
            }
        }

        const acceptingConds = this.Nodes[0].AcceptingConds;
        g.Attributes.set('nsets', acceptingConds === 0 ? 1 : acceptingConds);
        return g;
    }

    public toStates(): State[] {
        const states: State[] = [];
        const equivalenceClasses: BNode[] = [];
        for (const node of this.Nodes) {
            node.EquivalenceId = node.indexEquivalence(equivalenceClasses);
            node.transform(states);
        }
        return states;
    }
}

export class BNode {

    public readonly Incoming = new Set<BNode>();
    public readonly Current = new Set<Operator>();
    public readonly Old = new Set<Operator>();
    public readonly Next = new Set<Operator>();
    public Accepting = new BitSet();
    public InitCollapsed = false;
    public EquivalenceId = 0;
    private Other: BNode | null = null;

    constructor(public readonly Id: number, public readonly AcceptingConds: number) { }

    /**
     * Source: https://en.wikipedia.org/wiki/Linear_temporal_logic_to_Büchi_automaton#Gerth_et_al._algorithm
     * Date: 02.12.2020
     */
    public expand(nodes: BNode[], pool: IdGenerator): void {
        if (this.Current.size === 0) {
            let r = null;
            for (const n of nodes) {
                if (n.Next.contentEquals(this.Next) && ((n.Id === 0 && !n.InitCollapsed) || n.Accepting.equals(this.Accepting))) {
                    r = n;
                    break;
                }
            }

            if (r != null) {
                r.modify(this);
            } else {
                r = new BNode(pool(), this.AcceptingConds);
                nodes.push(this);
                r.Incoming.add(this);
                r.Current.addAll(this.Next);
                r.expand(nodes, pool);
            }
        } else {
            const f = this.Current.first();
            if (f == null) throw new Error('Empty Set');

            this.Current.delete(f);
            this.Old.add(f);

            if (f instanceof Until) {
                this.Accepting.set(f.UntilsIndex);
            }

            if (isBase(f)) {
                if (f === Constant.FALSE || has(this.Old, f.negate())) return;
                this.expand(nodes, pool);

            } else if (f instanceof And) {
                for (const sub of [f.left, f.right]) {
                    if (!has(this.Old, sub)) {
                        this.Current.add(sub);
                    }
                }
                this.expand(nodes, pool);

            } else if (f instanceof Next) {
                this.Next.add(f.content);
                this.expand(nodes, pool);

            } else if (f instanceof Or || f instanceof Until || f instanceof Release) {
                this.Next.addAll(next1(f));
                for (const sub of curr1(f)) {
                    if (!has(this.Old, sub)) {
                        this.Current.add(sub);
                    }
                }
                this.expand(nodes, pool);

                const newNode = new BNode(pool(), this.AcceptingConds);
                newNode.Incoming.addAll(this.Incoming);
                newNode.Current.addAll(this.Current);
                newNode.Old.addAll(this.Old);
                newNode.Next.addAll(this.Next);
                newNode.Accepting.or(this.Accepting);
                for (const sub of curr2(f)) {
                    if (!has(this.Old, sub)) {
                        newNode.Current.add(sub);
                    }
                }
                newNode.expand(nodes, pool);

            } else {
                throw new Error('Not in Negative Normal Form');
            }
        }
    }

    public indexEquivalence(equivalenceClasses: BNode[]): number {
        let i;
        for (i = 0; i < equivalenceClasses.length; i++) {
            if (equivalenceClasses[i] == null) {
                break;
            }
            if (equivalenceClasses[i].Next.contentEquals(this.Next)) {
                return equivalenceClasses[i].Id;
            }
        }
        return (equivalenceClasses[i] = this).Id;
    }

    public transform(automata: State[]): void {
        if (automata[this.Id] == null) automata[this.Id] = new State();
        automata[this.Id].RepresentativeId = this.EquivalenceId;

        let current: BNode | null = this;
        while (current != null) {
            for (const node of current.Incoming) {
                let state = automata[node.Id];
                if (state == null) state = automata[node.Id] = new State();
                state.Transitions.push(new Transition(this.EquivalenceId, this.Accepting, this.AcceptingConds));
            }
            current = current.Other;
        }
    }

    private modify(other: BNode): void {
        if (this.Id === 0 && !this.InitCollapsed) {
            this.Accepting = other.Accepting.clone();
            this.InitCollapsed = true;
        }

        let found = false;
        let previous: BNode = this;
        let current: BNode | null = this;
        while (current != null) {
            if (current.Old.contentEquals(other.Old)) {
                current.Incoming.addAll(other.Incoming);
                found = true;
            }
            previous = current;
            current = current.Other;
        }
        if (!found) {
            previous.Other = other;
        }
    }
}
