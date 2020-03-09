// Heap is a Recursive data structure
// NOTE The indexing of the heap should start from one for heap indexing to be valid
export default class Heap {
    public heap: number[] = [-1];
    public size: number = 0;


    private left = (index: number): number[] | null => {
        if (index * 2 < this.heap.length) return ([index * 2, this.heap[index * 2]]);
        return (null);
    };

    private right = (index: number): number[] | null => {
        if (index * 2 + 1 < this.heap.length) return ([index * 2 + 1, this.heap[index * 2 + 1]]);
        return (null);
    };
    private parent = (index: number): number[] | null => {
        if (Math.floor(index / 2) <= 0) return (null);
        return ([Math.floor(index / 2), this.heap[Math.floor(index / 2)]]);
    };

    public heapify = (heap: number[]): number[] => {
        heap.forEach((value: number) => { 
            this.insert(value);
        });
        return (this.heap);
    };
    private insert = (node: number): void => {
        let index: number = this.heap.push(node) - 1;
        this.size++;
        // console.log('Bubble up called on : ' + this.heap[index]);
        this.bubbleUp(index);
    };
    // private delete = () => { };
    private bubbleUp = (index: number): void => {
        let parent: number[] | null = this.parent(index);
        if (parent !== null && parent[1] > this.heap[index]) {
            // Swaping parent ans the child
            let temp: number = this.heap[index];
            this.heap[index] = parent[1];
            this.heap[parent[0]] = temp;
            this.bubbleUp(parent[0]);
        }
    };

    // Heapification is done on a node
    private bubbleDown = (index: number): void => {
        let smallest: number[] = [];
        let left: number[] | null = this.left(index);
        let right: number[] | null = this.right(index);
        if (left !== null && left[1] < this.heap[index]) smallest = left;
        else smallest = [index,this.heap[index]];
        if (right !== null && right[1] < smallest[1]) smallest = right;

        if (smallest[0] !== index) {
            // Swaping with the smallest of the child
            let temp: number[] = [index,this.heap[index]];
            this.heap[index] = smallest[1];
            this.heap[smallest[0]] = temp[1];
            this.bubbleDown(smallest[0]);
        }
    };

    public min = (): number => {
        let num: number = this.heap[1];
        this.heap[1] = this.heap[this.heap.length -1];
        this.heap.pop();
        this.size--;
        this.bubbleDown(1);
        return (num);
    };
}