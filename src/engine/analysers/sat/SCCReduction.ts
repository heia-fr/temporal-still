import { Graph, GNode } from './Graph';
import { tarjan } from './SCC';

function clearAccepting(scc: GNode[], g: Graph): void {
    let nsets = g.Attributes.get('nsets') as number;
    for (let j = 0; j < nsets; j++) {
        for (let n of scc) {
            for (let e of n.OutgoingEdges) {
                e.Attributes.delete('acc' + j);
            }
        }
    }
}

function isAccepting(scc: GNode[], g: Graph): boolean {
    let nsets = g.Attributes.get('nsets') as number;
    loop: for (let j = 0; j < nsets; j++) {
        for (let n of scc) {
            for (let e of n.OutgoingEdges) {
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
    for (let n of scc) {
        for (let e of n.OutgoingEdges) {
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
    let n = scc[0];
    for (let e of n.OutgoingEdges) {
        if (e.Destination === n) {
            return false;
        }
    }
    return true;
}

function clearExternalEdges(scc: GNode[], g: Graph): void {
    let nsets = g.Attributes.get('nsets') as number;
    for (let n of scc) {
        for (let e of n.OutgoingEdges) {
            if (scc.indexOf(e.Destination) < 0) {
                for (let k = 0; k < nsets; k++) {
                    e.Attributes.delete('acc' + k);
                }
            }
        }
    }
}


export function reduce(g: Graph): Graph {
    for (let l of tarjan(g)) {
        clearExternalEdges(l, g);
    }

    let changed: boolean;
    do {
        changed = false;
        for (let scc of tarjan(g)) {
            let accepting = isAccepting(scc, g);
            if (!accepting && isTerminal(scc)) {
                changed = true;
                for (let n of scc) n.delete();
            } else if (isTransient(scc) || !accepting) {
                clearAccepting(scc, g);
            }
        }
    } while (changed);

    return g;
}
