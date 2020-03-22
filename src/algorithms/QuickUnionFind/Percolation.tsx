import QuickUnionFind from 'algorithms/QuickUnionFind/QuickUnionFind';

// The row and coloumn numbering follows 1,1 numbering
export default class Percolation {
  private n: number;
  private grid: boolean[][];
  private connection: QuickUnionFind;
  public _numberOfOpenSites: number = 0;

  // creates n-by-n grid, with all sites initially blocked
  constructor(n: number) {
    console.log("A new Percoloation system has been made");
    if (n <= 0) {
      console.log("Sorry no zeros allowed");
    }
    this.n = n;

    this.grid = []; // This array keeps the information of open and blocked
    this.connection = new QuickUnionFind(this.n * this.n); // This array keeps the information of the connections
    // between the blocks

    // Initializing all sites to be blocked initially
    for (let i: number = 0; i < this.n; i++) {
      this.grid.push([]);
      for (let j: number = 0; j < this.n; j++) {
        //  TODO : This  line is ambiguious
        this.grid[i].push(false);

        if (i === 0) {
          this.connection.union(0, j); // Connecting all the top row elements
          // this.open(i + 1, j + 1);
        }
        if (i === this.n - 1)
          this.connection.union(this.n * this.n - 1, this.n * i + j); // Connecting all the bottom row elements
      }
    }
  }

  // opens the site (row, col) if it is not open already
  // This function takes in the 1,1 indexing
  public open = (row: number, col: number): void => {
    // Error handling
    if (row < 1 || row > this.n || col < 1 || col > this.n) {
      console.log("This error is from percolation");
    }

    if (!this.grid[row - 1][col - 1]) {
      this.grid[row - 1][col - 1] = true; // Opening the give row and col elements
      this._numberOfOpenSites++;

      // Opening the left, right , top , bottom elements
      if (col - 1 >= 1 && this.isOpen(row, col - 1)) {
        let p: number = this.n * (row - 1) + (col - 1);
        let q: number = this.n * (row - 1) + (col - 1 - 1);
        this.connection.union(p, q);
      }
      if (col + 1 <= this.n && this.isOpen(row, col + 1)) {
        let p: number = this.n * (row - 1) + (col - 1);
        let q: number = this.n * (row - 1) + (col + 1 - 1);
        this.connection.union(p, q);
      }

      if (row + 1 <= this.n && this.isOpen(row + 1, col)) {
        let p: number = this.n * (row - 1) + (col - 1);
        let q: number = this.n * (row + 1 - 1) + (col - 1);
        this.connection.union(p, q);
      }
      if (row - 1 >= 1 && this.isOpen(row - 1, col)) {
        let p: number = this.n * (row - 1) + (col - 1);
        let q: number = this.n * (row - 1 - 1) + (col - 1);
        this.connection.union(p, q);
      }
    }
  };

  // is the site (row, col) open?
  // This function internally handles the 1,1 indexing to 0,0 indexing
  private isOpen = (row: number, col: number): boolean => {
    // Error handling
    if (row < 1 || row > this.n || col < 1 || col > this.n) {
      console.log("This error is from percolation");
    }
    return this.grid[row - 1][col - 1];
  };

  // is the site (row, col) full?
  private isFull = (row: number, col: number): boolean => {
    // Error handling
    if (row < 1 || row > this.n || col < 1 || col > this.n) {
      console.log("This error is from percolation");
    }

    let p = this.n * (row - 1) + (col - 1);
    let q = 0;
    return this.grid[row - 1][col - 1] && this.connection.connected(p, q);
  };

  // returns the number of open sites
  public numberOfOpenSites = (): number => {
    return this._numberOfOpenSites;
  };

  // does the system percolate?
  public percolates = (): boolean => {
    return this.connection.connected(0, this.n * this.n - 1);
  };
}
