/*
SECTION    We are using adjacency list representation because our graph will be mostly sparse
*/
export default class Graph<T> {
    // public edges: Edge<T>[] = [];
    public vertices: Map<number, Vertex<T>> = new Map<number, Vertex<T>>();
    public isDirected: boolean = true;


    // This function will return if the vertex exists in the graph and if yes return it
    public vertexExists = (id: number): undefined | Vertex<T> => {
        if (this.vertices === undefined) return (undefined);
        return (this.vertices.get(id));
    };

    public isConnected = (from: number, to: number): undefined | Edge<T> => {
        let vertexFrom: undefined | Vertex<T> = this.vertexExists(from);
        let vertexTo: undefined | Vertex<T> = this.vertexExists(to);
        if (vertexFrom === undefined || vertexTo === undefined) return (undefined);
        // I will reach here only if both vertex exits
        return (vertexFrom.isConnected(to));
    };

    public add = (id: number, data: T): Vertex<T> | undefined => {
        this.vertices.set(id, new Vertex(id, data));
        return (this.vertices.get(id));
    };


    public connect = (from: number, to: number): Edge<T> | undefined => {
        let vertexFrom = this.vertexExists(from);
        let vertexTo = this.vertexExists(to);
        if (vertexFrom === undefined || vertexTo === undefined) return (undefined);
        let edge: Edge<T> | undefined = vertexFrom.isConnected(to);
        if (edge !== undefined) return (edge);
        return (vertexFrom.connect(vertexTo));
    };
}

export class Vertex<T> {
    public id: number;
    public data: T;
    // This the connections that the graph has
    public edges: Edge<T>[] = [];
    // This is the node to which it has those connections
    public vertices: Vertex<T>[] = [];

    constructor(id: number, data: T) {
        this.id = id;
        this.data = data;
    }

    public isConnected = (id: number): Edge<T> | undefined => {
        for (let i: number = 0; i < this.vertices.length; i++)
            if (this.vertices[i].id === id)
                return (this.edges[i]);
        return (undefined);
    };

    public connect = (vertex: Vertex<T>): Edge<T> => {
        let edge: Edge<T> = new Edge<T>(this, vertex);
        this.edges.push(edge);
        this.vertices.push(vertex);
        return (edge);
    };
}

// This is how a edge looks like
export class Edge<T> {
    public isDirected: boolean = true;
    public from: Vertex<T>;
    public to: Vertex<T>;
    public weight?: number;

    constructor(from: Vertex<T>, to: Vertex<T>) {
        this.from = from;
        this.to = to;
    }
}