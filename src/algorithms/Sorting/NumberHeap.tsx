import Heap from 'algorithms/PathFinding/Heap';

export default class NumberHeap extends Heap<number> {
    public compare(arg1: number, arg2: number): number {
        if (arg1 === arg2) return (0);
        if (arg1 > arg2) return (1);
        return (-1);
    }
}