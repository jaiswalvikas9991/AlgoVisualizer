export default class QuickUnionFind {
  // These are the class variables
  private parent: number[];
  private size: number[];
  private _count: number;

  // This is the constructor
  constructor(count: number) {
    this.parent = [];
    this.size = [];
    this._count = count;

    for (let i: number = 0; i < count; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  public count: Function = (): number => this._count;

  private find: Function = (p: number): number => {
    this.validate(p);
    while (p !== this.parent[p]) p = this.parent[p];
    return p;
  };

  private validate: Function = (p: number): void => {
    let n: number = this.parent.length;
    if (p < 0 || p >= n) {
      console.log("index " + p + " is not between 0 and " + (n - 1));
    }
  };

  public connected: Function = (p: number, q: number): boolean => {
    return this.find(p) === this.find(q);
  };

  public union: Function = (p: number, q: number): void => {
    let rootP = this.find(p);
    let rootQ = this.find(q);
    if (rootP === rootQ) return;

    // make smaller root point to larger one
    if (this.size[rootP] < this.size[rootQ]) {
      this.parent[rootP] = rootQ;
      this.size[rootQ] += this.size[rootP];
    } else {
      this.parent[rootQ] = rootP;
      this.size[rootP] += this.size[rootQ];
    }
    this._count--;
  };
}
