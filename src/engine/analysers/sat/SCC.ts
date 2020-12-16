// tslint:disable:no-non-null-assertion
import { GNode, Graph } from './Graph';

/**
 * https://en.wikipedia.org/wiki/Tarjan's_strongly_connected_components_algorithm#The_algorithm_in_pseudocode
 * Date: 13.12.2020
 */
export function tarjan(graph: Graph): GNode[][] {
    let init = graph.Init;
    if (init == null) {
        return [];
    }

    const dfsnum = new Map<GNode, number>();
    const low = new Map<GNode, number>();
    const stack: GNode[] = [];
    const scc: GNode[][] = [];
    let index = 0;

    function visit(p: GNode): void {
        stack.unshift(p);
        dfsnum.set(p, index);
        low.set(p, index);
        index++;

        for (let { Destination: q } of p.OutgoingEdges) {
            if (!low.has(q)) {
                visit(q);
                low.set(p, Math.min(low.get(p)!, low.get(q)!));
            } else if (dfsnum.get(q)! < dfsnum.get(p)! && stack.indexOf(q) >= 0) {
                low.set(p, Math.min(low.get(p)!, dfsnum.get(q)!));
            }
        }

        if (low.get(p)! === dfsnum.get(p)!) {
            let current: GNode[] = [];
            let v: GNode;
            do {
                v = stack.shift()!;
                current.push(v);
            } while (v !== p);
            scc.push(current);
        }
    }

    visit(init);
    return scc;
}
