import { Dispatch } from "react";
import Heap from "./Heap";

export default class Sorting {
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
    let heap: Heap = new Heap();
    heap.heapify(list);
    // console.log('After hepification : ' + array);
    // console.log('The min is ' + heap.min());
    // console.log('After min heap is : ' + heap.heap);
    for (let i: number = 0; heap.size !== 0; i++) {
      list[i] = heap.min();
      this.setHeight({ type: "UPDATE", payload: list });
      await this.sleep(this.delay);
    }
  };

  // Helper method for merge sort
  private getLeftSubArray = (list: number[]): number[] => {
    let returnList: number[] = [];
    for (let i: number = 0; i < Math.floor(list.length / 2); i++) returnList.push(list[i]);
    return returnList;
  };

  // Helper method for merge sort
  private getRightSubArray = (list: number[]): number[] => {
    let returnList: number[] = [];
    for (let i: number = Math.floor(list.length / 2); i < list.length; i++) returnList.push(list[i]);
    return returnList;
  };

  private renderList = (list: number[], mainList: number[]): void => {
    // let array: number[] = [...mainList];
    // for (let i: number = 0; i < list.length; i++) array[i] = list[i];
    this.setHeight({ type: "UPDATE", payload: [...list, ...mainList.slice(list.length)] });
  };

  public mergeSort = async (list: number[], mainList: number[]): Promise<number[]> => {
    if (list.length < 2) return (list);
    let left: number[] = this.getLeftSubArray(list);
    let right: number[] = this.getRightSubArray(list);
    let leftList: number[] = await this.mergeSort(left, mainList); // MergeSort on the right sub array
    let rightList: number[] = await this.mergeSort(right, mainList); // MergeSort on the left sub array
    let merged: number[] = await this.merge(leftList, rightList);
    this.renderList(merged, mainList);
    // this.setHeight({ type: "UPDATE", payload: merged});
    await this.sleep(this.delay);
    return (merged);
  };

  // This is a working merge function with running time of O(n)
  private merge = async (listOne: number[], listTwo: number[]): Promise<number[]> => {
    let one: number = 0;
    let two: number = 0;
    let list: number[] = [];

    for (let i: number = 0; i < listOne.length + listTwo.length; i++) {
      // List one exhausted
      if (listOne.length <= one) return ([...list, ...listTwo.slice(two)]);
      // List two exhausted
      else if (listTwo.length <= two) return ([...list, ...listOne.slice(one)]);
      else if (listOne[one] < listTwo[two] && one < listOne.length) list.push(listOne[one++]);
      else if (two < listTwo.length) list.push(listTwo[two++]);
    }
    return (list);
  };

  public partition = async (arr: number[], low: number, high: number) : Promise<number> => {
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
    return i + 1;
  }

  public quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      let pi: number = await this.partition(arr, low, high);
      await this.quickSort(arr, low, pi - 1);
      await this.quickSort(arr, pi + 1, high);
    }
    this.setHeight({ type: "UPDATE", payload: arr });
  }
}
