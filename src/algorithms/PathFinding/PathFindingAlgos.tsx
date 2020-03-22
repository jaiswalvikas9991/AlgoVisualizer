import Graph, { Vertex, Edge } from 'algorithms/PathFinding/Graph';
import { onColor } from 'screens/PathFinding/constants';
import Queue from 'algorithms/PathFinding/Queue';
import { Dispatch } from "react";
import VertexHeap from "algorithms/PathFinding/VertexHeap";

export default class PathFindingAlgos {
    setOpenList: Dispatch<{ type: string; payload: any }>;
    delay: number;
    constructor(setOpenList: Dispatch<{ type: string; payload: any }>, delay: number) {
        this.setOpenList = setOpenList;
        this.delay = delay;
    }
    // private sleep = (ms: number): Promise<void> => {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // };

    public backTracking = async (matrix: string[][], position: number[]): Promise<boolean> => {
        let path: number[][] | undefined = await this.backTrackingHelper(matrix, position);
        if (path !== undefined) {
            this.setOpenList({ type: "PATH", payload: path });
            return (true);
        }
        return (false);
    };

    private backTrackingHelper = async (matrix: string[][], position: number[]): Promise<number[][] | undefined> => {
        //console.log('Inside the recursion');
        // *This is to pause the excecution of the program
        //await this.sleep(2);

        if (position[0] === matrix.length - 1 && position[1] === matrix.length - 1) return ([[matrix.length - 1, matrix.length - 1]]);

        //* Spreading the position list
        let i: number = position[0]; let j: number = position[1];

        // *Checking whether we can go down
        if (i + 1 < matrix.length && matrix[i + 1][j] === onColor) {
            let a: number[][] | undefined = await this.backTrackingHelper(matrix, [i + 1, j]);
            if (a !== undefined) return ([[i, j], ...a]);
        }

        // *Checking wheather we can go right
        if (j + 1 < matrix.length && matrix[i][j + 1] === onColor) {
            let a: number[][] | undefined = await this.backTrackingHelper(matrix, [i, j + 1]);
            if (a !== undefined) return ([[i, j], ...a]);
        }
        return (undefined);
    };


    // * This function flattens out the matrix to a array indices
    private indexToNum = (i: number, j: number, size: number): number => (i * size + j);
    private numToIndex = (index: number, dim: number): number[] => ([Math.floor(index / dim), index % dim]);

    // * This function makes the graph form the boolean matrix
    public makeGraph = (matrix: string[][], graph: Graph<number>, type: string) => {
        // * Making the required nodes
        for (let j: number = 0; j < matrix.length; j++) {
            for (let i: number = 0; i < matrix.length; i++) {
                graph.add(this.indexToNum(i, j, matrix.length), this.indexToNum(i, j, matrix.length));
            }
        }

        // * Connecting the required nodes
        for (let i: number = 0; i < matrix.length; i++) {
            for (let j: number = 0; j < matrix.length; j++) {
                if (matrix[i][j] === onColor && i + 1 < matrix.length && matrix[i + 1][j] === onColor)
                    graph.connect(this.indexToNum(i, j, matrix.length), this.indexToNum(i + 1, j, matrix.length), type);

                if (matrix[i][j] === onColor && j + 1 < matrix.length && matrix[i][j + 1] === onColor)
                    graph.connect(this.indexToNum(i, j, matrix.length), this.indexToNum(i, j + 1, matrix.length), type)

                if (matrix[i][j] === onColor && i - 1 > 0 && matrix[i - 1][j] === onColor)
                    graph.connect(this.indexToNum(i, j, matrix.length), this.indexToNum(i - 1, j, matrix.length), type)
                // * Uncomment this if u want to allow diagnol traversal
                // if (matrix[i][j] === onColor && i + 1 < matrix.length && j + 1 < matrix.length && matrix[i + 1][j + 1] === onColor)
                //     graph.connect(this.indexToNum(i, j, matrix.length), this.indexToNum(i + 1, j + 1, matrix.length))
            }
        }
    };

    // * Breadth First Search is used on unweighted graphs
    public breadthFirstSearch = async (matrix: string[][], position: number[]): Promise<boolean> => {
        let graph: Graph<number> = new Graph<number>();

        // * This is the path that I give back for rendering
        // let path: Array<Array<number>> = new Array<Array<number>>();

        // * Graph is a Flat Data Structure
        this.makeGraph(matrix, graph, 'unweighted');

        let queue: Queue<Vertex<number>> = new Queue<Vertex<number>>();
        let first: Vertex<number> | undefined = graph.vertexExists(this.indexToNum(position[0], position[1], matrix.length));
        if (first !== undefined) queue.enqueue(first);


        // * This is some auxilary book keeping
        // * This stored the distance
        let distance: Array<number> = this.initValue(-1, matrix.length * matrix.length);
        // * This stores the value form where we reacthed this node
        let from: Array<number> = this.initValue(-1, matrix.length * matrix.length);
        distance[0] = 0;
        from[0] = 0;

        // * Till the queue is not empty
        while (!queue.isEmpty()) {
            // * This is the edge we are currently processing
            let vertex: Vertex<number> = queue.dequeue();

            vertex.edges.forEach((edge: Edge<number>) => {
                // * Remove the first element form the queue for processing
                // * This mean it has not already bean proccessed
                if (distance[edge.to.id] === -1) {
                    // * Enquening the vertex
                    queue.enqueue(edge.to);
                    distance[edge.to.id] = distance[vertex.id] + 1;
                    from[edge.to.id] = vertex.id;
                }
            });
        }
        // * No we are back tracing the path for the getting the original path starting with the last vertex
        let path: Array<Array<number>> | undefined = this.backTrack(from, matrix.length - 1, matrix.length - 1, matrix.length);
        if (path !== undefined) {
            this.setOpenList({ type: "PATH", payload: path });
            return (true);
        }
        return (false);

    };

    private backTrack = (from: Array<number>, i: number, j: number, dim: number): Array<Array<number>> | undefined => {
        if (from[this.indexToNum(dim - 1, dim - 1, dim)] === -1) return (undefined);
        let index: number[] = [i, j];
        // * This is where the path is saved
        let path: Array<Array<number>> = new Array<Array<number>>();
        while (index[0] !== 0 || index[1] !== 0) {
            path.push(index);
            // * Getting the num index to the next path
            let next: number = from[this.indexToNum(index[0], index[1], dim)];
            // * saving that index to the return path variable
            index = this.numToIndex(next, dim);
        }
        return (path);
    };

    private initValue = (value: any, dims: number): Array<any> => {
        let matrix: Array<any> = new Array<any>();
        for (let j: number = 0; j < dims; j++) {
            matrix.push(value);
        }
        return (matrix);
    }

    // * Dijkstra's algorithm is a generalization of Breadth First Search
    public dijkstra = async (matrix: string[][], position: number[]): Promise<boolean> => {
        let graph: Graph<number> = new Graph<number>();

        // * This is the path that I give back for rendering
        // let path: Array<Array<number>> = new Array<Array<number>>();

        // * Graph is a Flat Data Structure
        this.makeGraph(matrix, graph, 'positive');

        let heap: VertexHeap = new VertexHeap();
        let first: Vertex<number> | undefined = graph.vertexExists(this.indexToNum(position[0], position[1], matrix.length));
        // *Inserting the source vertex into the heap / Priority Queue
        if (first !== undefined) {
            first.distance = 0;
            heap.insert(first);
        }


        // * This is some auxilary book keeping
        // * This stored the distance
        //let distance: Array<number> = this.initValue(-1, matrix.length * matrix.length);
        // * This stores the value form where we reacthed this node
        let from: Array<number> = this.initValue(-1, matrix.length * matrix.length);
        let explored: Array<boolean> = this.initValue(false, matrix.length * matrix.length);
        //distance[0] = 0;
        from[0] = 0;

        // * Till the queue is not empty
        while (!heap.isEmpty()) {
            //console.log('loop running');
            // * This is the edge we are currently processing
            let vertex: Vertex<number> = heap.min();

            if (!explored[vertex.id]) {
                vertex.edges.forEach((edge: Edge<number>) => {
                    let min: number = Math.min(vertex.distance + edge.weight, edge.to.distance);
                    if (min !== edge.to.distance) {
                        edge.to.distance = min;
                        from[edge.to.id] = vertex.id;
                    }
                    heap.insert(edge.to);
                });
                explored[vertex.id] = true;
            }
        }
        // * No we are back tracing the path for the getting the original path starting with the last vertex
        let path: Array<Array<number>> | undefined = this.backTrack(from, matrix.length - 1, matrix.length - 1, matrix.length);
        if (path !== undefined) {
            this.setOpenList({ type: "PATH", payload: path });
            return (true);
        }
        //console.log('algorithm completed');
        return (false);
    };
}