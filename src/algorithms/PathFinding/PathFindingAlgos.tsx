import Graph from "./Graph";

export default class PathFindingAlgos {
    private sleep = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    public backTracking = async (matrix: boolean[][], position: number[]): Promise<number[][]> => {
        // This is to pause the excecution of the program
        await this.sleep(200);

        if (position[0] === matrix.length - 1 && position[1] === matrix.length - 1) return ([[matrix.length - 1, matrix.length - 1]]);
        let i: number = position[0]; let j: number = position[1];

        // Checking wheter we can go right
        if (i + 1 < matrix.length && matrix[i + 1][j]) {
            let a: number[][] = await this.backTracking(matrix, [i + 1, j]);
            if (a !== []) return ([[i, j], ...a]);
        }

        // Checkinng wheather we can go down
        if (j + 1 < matrix.length && matrix[i][j + 1]) {
            let a: number[][] = await this.backTracking(matrix, [i, j + 1]);
            if (a !== []) return ([[i, j], ...a]);
        }
        return ([]);
    };

    public dijkstra = () => {
        let graph : Graph<number>  = new Graph<number>();
    };
}