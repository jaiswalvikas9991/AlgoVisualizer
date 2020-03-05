import { Dispatch } from "react";

export default class Sorting {
  private setHeight: Dispatch<{ type: string; payload: number[] }>;
  private delay: number;

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

  // Helper method for merge sort
  private getLeftSubArray = (list: number[]): number[] => {
    let returnList: number[] = [];
    for (let i: number = 0; i < Math.floor(list.length / 2); i++) {
      returnList.push(list[i]);
    }
    return returnList;
  };

  // Helper method for merge sort
  private getRightSubArray = (list: number[]): number[] => {
    let returnList: number[] = [];
    for (let i: number = 0; i < Math.floor(returnList.length); i++) {
      returnList.push(list[list.length / 2 + i]);
    }
    return returnList;
  };

  public mergeSort = (list: number[]): void => {
    if (list.length < 2) return;
    let left: number[] = this.getLeftSubArray(list);
    let right: number[] = this.getRightSubArray(list);
    this.mergeSort(left); // MergeSort on the right sub array
    this.mergeSort(right); // MergeSort on the left sub array
    this.merge(left, right, list);
  };

  // This is a working merge function with running time of O(n)
  private merge = (
    listOne: number[],
    listTwo: number[],
    list: number[]
  ): number[] => {
    // int[] list = new int[listOne.length + listTwo.length];
    let listOnePointer: number = 0;
    let listTwoPointer: number = 0;
    let listPointer: number = 0;
    while (
      listOnePointer < listOne.length &&
      listTwoPointer < listTwo.length &&
      listPointer < list.length
    ) {
      if (listOne[listOnePointer] < listTwo[listTwoPointer]) {
        list[listPointer] = listOne[listOnePointer];
        listOnePointer++;
        listPointer++;
      } else {
        list[listPointer] = listTwo[listTwoPointer];
        listTwoPointer++;
        listPointer++;
      }
    }

    // Till this point atleast one of the arrry will get exhausted
    // List one got exhaused
    if (listOnePointer === listOne.length) {
      for (let i: number = listTwoPointer; i < listTwo.length; i++) {
        list[listPointer] = listTwo[i];
        listPointer++;
      }
    }

    // List two got exhaused
    if (listTwoPointer === listTwo.length) {
      for (let i: number = listOnePointer; i < listOne.length; i++) {
        list[listPointer] = listTwo[i];
        listPointer++;
      }
    }

    return list;
  };
}
