export class Graph {

    public Init: GNode | null = null;
    public readonly Nodes = new Set<GNode>();
    public readonly Attributes = new Map<string, any>();

    public addNode(n: GNode): void {
        this.Nodes.add(n);
        if (this.Init == null) {
            this.Init = n;
        }
    }

    public deleteNode(n: GNode): void {
        this.Nodes.delete(n);
        if (this.Init === n) {
            if (this.Nodes.size > 0) {
                this.Init = this.Nodes.first();
            } else {
                this.Init = null;
            }
        }
    }
}

export class GNode {

    public readonly OutgoingEdges = new Set<GEdge>();
    public readonly IncomingEdges = new Set<GEdge>();
    public readonly Attributes = new Map<string, any>();

    constructor(public readonly Graph: Graph, public readonly label: string) {
        Graph.addNode(this);
    }

    public delete(): void {
        for (const e of this.OutgoingEdges) e.delete();
        for (const e of this.IncomingEdges) e.delete();
        this.Graph.deleteNode(this);
    }
}

export class GEdge {

    public readonly Attributes = new Map<string, any>();

    constructor(public readonly Source: GNode, public readonly Destination: GNode) {
        this.Source.OutgoingEdges.add(this);
        this.Destination.IncomingEdges.add(this);
    }

    public delete(): void {
        this.Source.OutgoingEdges.delete(this);
        this.Destination.IncomingEdges.delete(this);
    }
}
