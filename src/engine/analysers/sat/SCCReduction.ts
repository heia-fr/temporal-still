import { Graph, GNode } from './Graph';
import { tarjan } from './SCC';

function clearAccepting(scc: GNode[], g: Graph): void {
    const nsets = g.Attributes.get('nsets') as number;
    for (let j = 0; j < nsets; j++) {
        for (const n of scc) {
            for (const e of n.OutgoingEdges) {
                e.Attributes.delete('acc' + j);
            }
        }
    }
}

function isAccepting(scc: GNode[], g: Graph): boolean {
    const nsets = g.Attributes.get('nsets') as number;
    loop: for (let j = 0; j < nsets; j++) {
        for (const n of scc) {
            for (const e of n.OutgoingEdges) {
                if (e.Attributes.get('acc' + j)) {
                    continue loop;
                }
            }
        }
        return false;
    }
    return true;
}

function isTerminal(scc: GNode[]): boolean {
    for (const n of scc) {
        for (const e of n.OutgoingEdges) {
            if (scc.indexOf(e.Destination) < 0) {
                return false;
            }
        }
    }
    return true;
}

function isTransient(scc: GNode[]): boolean {
    if (scc.length !== 1) {
        return false;
    }
    const n = scc[0];
    for (const e of n.OutgoingEdges) {
        if (e.Destination === n) {
            return false;
        }
    }
    return true;
}

function clearExternalEdges(scc: GNode[], g: Graph): void {
    const nsets = g.Attributes.get('nsets') as number;
    for (const n of scc) {
        for (const e of n.OutgoingEdges) {
            if (scc.indexOf(e.Destination) < 0) {
                for (let k = 0; k < nsets; k++) {
                    e.Attributes.delete('acc' + k);
                }
            }
        }
    }
}


export function reduce(g: Graph): Graph {
    for (const l of tarjan(g)) {
        clearExternalEdges(l, g);
    }

    let changed: boolean;
    do {
        changed = false;
        for (const scc of tarjan(g)) {
            const accepting = isAccepting(scc, g);
            if (!accepting && isTerminal(scc)) {
                changed = true;
                for (const n of scc) n.delete();
            } else if (isTransient(scc) || !accepting) {
                clearAccepting(scc, g);
            }
        }
    } while (changed);

    return g;
}
