export default class Queue<T> {
    public queue : Array<T> = Array<T>();

    public enqueue = (data : T) : T => {
        this.queue.push(data);
        return(data);
    };
    public dequeue = () : T => {
        let temp : T = this.queue[0];
        this.queue = this.queue.slice(1); 
        return(temp);
    };
    public isEmpty = () : boolean => (this.queue.length === 0);
}