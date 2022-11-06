import { Dispatch } from "react";
import NumberHeap from "algorithms/NumberHeap";

export default class SortingAlgo {
  private setHeight: Dispatch<{ type: string; payload: number[] }>;
  private delay: number;
  public stop: boolean = false;

  constructor(
    setHeight: Dispatch<{ type: string; payload: number[] }>,
    delay: number
  ) {
    this.setHeight = setHeight;
    this.delay = delay;
  }

  private sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  public selectionSort = async (list: number[]): Promise<void> => {
    for (let i: number = 0; i < list.length; i++) {
      let minIndex: number = i;
      for (let j: number = i; j < list.length; j++) {
        if (list[j] < list[minIndex]) {
          minIndex = j;
        }
      }
      let temp: number = list[i];
      list[i] = list[minIndex];
      list[minIndex] = temp;
      this.setHeight({ type: "UPDATE", payload: list });
      await this.sleep(this.delay);
    }
  };

  public bubbleSort = async (list: number[]): Promise<void> => {
    for (let i: number = 0; i < list.length; i++) {
      let shouldBreak: boolean = true;
      for (let j: number = 0; j < list.length - 1 - i; j++) {
        if (list[j + 1] < list[j]) {
          let temp: number = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;
          shouldBreak = false;
          this.setHeight({ type: "UPDATE", payload: list });
          await this.sleep(this.delay);
        }
      }
      if (shouldBreak) break;
    }
  };

  public heapSort = async (list: number[]): Promise<void> => {
    let heap: NumberHeap = new NumberHeap();
    heap.heapify(list);
    for (let i: number = 0; heap.size !== 0; i++) {
      list[i] = heap.min();
      this.setHeight({ type: "UPDATE", payload: list });
      await this.sleep(this.delay);
    }
  };


  public partition = async (arr: number[], low: number, high: number): Promise<number> => {
    let pivot: number = arr[high];
    let i: number = (low - 1);
    for (let j: number = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        let temp: number = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      await this.sleep(this.delay);
      this.setHeight({ type: "UPDATE", payload: arr });
    }
    let temp: number = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    this.setHeight({ type: "UPDATE", payload: arr });
    return i + 1;
  }

  public quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      //* On doing the quicksort partationing the pivot lands at its rightfull position
      let pi: number = await this.partition(arr, low, high);
      await this.quickSort(arr, low, pi - 1);
      await this.quickSort(arr, pi + 1, high);
    }
    this.setHeight({ type: "UPDATE", payload: arr });
  }

  //* This is bottom up merge sort
  public merge = async (A: number[], temp: number[], from: number, mid: number, to: number): Promise<void> => {
    let k: number = from;
    let i: number = from;
    let j: number = mid + 1;
    while (i <= mid && j <= to) {
      if (A[i] < A[j]) {
        temp[k++] = A[i++];
      } else {
        temp[k++] = A[j++];
      }
      this.setHeight({ type: "UPDATE", payload: temp });
      await this.sleep(this.delay);
    }
    while (i < A.length && i <= mid) {
      temp[k++] = A[i++];
      this.setHeight({ type: "UPDATE", payload: temp });
      await this.sleep(this.delay);
    }
    for (i = from; i <= to; i++) {
      A[i] = temp[i];
    }
  }

  // * This is bottom up merge sort
  //* Because the recursive version of the merge sort is not inplace hence tedious to render on the screen
  public mergeSort = async (arr: number[]): Promise<void> => {
    let low: number = 0;
    let high: number = arr.length - 1;
    let temp: number[] = [...arr];
    for (let m: number = 1; m <= high - low; m = 2 * m) {
      for (let i: number = low; i < high; i += 2 * m) {
        let from: number = i;
        let mid: number = i + m - 1;
        let to: number = Math.min(i + 2 * m - 1, high);

        await this.merge(arr, temp, from, mid, to);
      }
    }
  }

  public insertionSort = async (arr: number[]): Promise<void> => {
    for (let i: number = 0; i < arr.length; i++) {
      let idx: number = i;
      while (arr[idx] < arr[idx - 1] && idx >= 1) {
        let temp: number = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = temp;
        idx--;
        this.setHeight({ type: "UPDATE", payload: arr });
        await this.sleep(this.delay);
      }
    }
  };
}
