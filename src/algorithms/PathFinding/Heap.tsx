// Heap is a Recursive data structure
// NOTE The indexing of the heap should start from one for heap indexing to be valid
export default abstract class Heap<T> {
    public heap: Array<T> = Array<T>();
    public size: number = 0;

    private left = (index: number): [number, T] | undefined => {
        if (index * 2 < this.heap.length) return ([index * 2, this.heap[index * 2]]);
        return (undefined);
    };

    private right = (index: number): [number, T] | undefined => {
        if (index * 2 + 1 < this.heap.length) return ([index * 2 + 1, this.heap[index * 2 + 1]]);
        return (undefined);
    };

    private parent = (index: number): [number, T] | undefined => {
        if (Math.floor(index / 2) <= 0) return (undefined);
        return ([Math.floor(index / 2), this.heap[Math.floor(index / 2)]]);
    };

    public heapify = (heap: T[]): T[] => {
        heap.forEach((value: T) => {
            this.insert(value);
        });
        return (this.heap);
    };

    public insert = (node: T): void => {
        // * Insering a dummy value into the heap for statisfing the heap property
        if (this.heap.length === 0) this.heap.push(node);
        let index: number = this.heap.push(node) - 1;
        this.size++;
        // console.log('Bubble up called on : ' + this.heap[index]);
        this.bubbleUp(index);
    };
    // private delete = () => { };
    private bubbleUp = (index: number): void => {
        let parent: [number, T] | undefined = this.parent(index);
        if (parent !== undefined && this.compare(parent[1], this.heap[index]) > 0) {
            // Swaping parent ans the child
            let temp: T = this.heap[index];
            this.heap[index] = parent[1];
            this.heap[parent[0]] = temp;
            this.bubbleUp(parent[0]);
        }
    };

    // Heapification is done on a node
    private bubbleDown = (index: number): void => {
        let smallest: [number, T];
        let left: [number, T] | undefined = this.left(index);
        let right: [number, T] | undefined = this.right(index);
        if (left !== undefined && this.compare(this.heap[index], left[1]) > 0) smallest = left;
        else smallest = [index, this.heap[index]];
        if (right !== undefined && this.compare(smallest[1], right[1]) > 0) smallest = right;

        if (smallest[0] !== index) {
            // Swaping with the smallest of the child
            let temp: [number, T] = [index, this.heap[index]];
            this.heap[index] = smallest[1];
            this.heap[smallest[0]] = temp[1];
            this.bubbleDown(smallest[0]);
        }
    };

    public isEmpty = () : boolean => (this.size === 0);

    public min = (): T => {
        let root: T = this.heap[1];
        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.size--;
        this.bubbleDown(1);
        return (root);
    };

    // * Returns 0 if both are equal
    // * Returns 1 if arg1 is greater than arg2
    // * Returns -1 if arg1 is less than arg2
    public abstract compare(arg1: T, arg2: T): number;
}