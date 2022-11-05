import React, { useReducer, useMemo, Dispatch, useState } from "react";
import SortingAlgo from "algorithms/SortingAlgo";

const randomMatrix = (dimension: number): number[] => {
  let array: number[] = [];
  for (let i: number = 0; i < dimension; i++) {
    array.push(Math.random());
  }
  return array;
};

const Sorting: React.FC = () => {
  const defaultArrayLen: number = 100;

  const [activeTab, setActiveTab] = useState(0);
  const [showDropDown, setShowDropDown] = useState(false);

  const heightReducer = (
    state: number[],
    action: { type: string; payload: number[] }
  ): number[] => {
    switch (action.type) {
      case "UPDATE":
        return [...action.payload];
      default:
        return state;
    }
  };

  const [heights, setHeights]: [
    number[],
    Dispatch<{ type: string; payload: number[] }>
  ] = useReducer(heightReducer, randomMatrix(defaultArrayLen));

  const start = (): void => {
    let sort: SortingAlgo = new SortingAlgo(setHeights, 50);
    switch (activeTab) {
      case 0:
        sort.selectionSort([...heights]);
        break;
      case 1:
        sort.bubbleSort([...heights]);
        break;
      case 2:
        sort.heapSort([...heights]);
        break;
      case 3:
        let arrayM: number[] = [...heights];
        sort.mergeSort(arrayM);
        break;
      case 4:
        let arrayQ: number[] = [...heights];
        sort.quickSort(arrayQ, 0, arrayQ.length - 1);
        break;
      case 5:
        sort.insertionSort([...heights]);
        break;
      default:
        sort.selectionSort([...heights]);
    }
  };

  const onClick = (tab: number): void => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    setHeights({ type: "UPDATE", payload: randomMatrix(defaultArrayLen) });
  };

  const sortingAlgos = [
    "Selection Sort",
    "Bubble Sort",
    "Heap Sort",
    "Merge Sort",
    "Quick Sort",
    "Insertion Sort",
  ];

  return (
    <>
      <div className="flex flex-row items-center space-x-2 ml-2">
        <button
          className="p-2 rounded-md bg-green-200 shadow-md hover:bg-green-300"
          onClick={start}
        >
          Start
        </button>

        <div className="dropdown inline-block relative">
          <button
            onClick={() => setShowDropDown(!showDropDown)}
            className="bg-purple-300 font-semibold py-2 px-4 rounded inline-flex items-center cursor-pointer"
          >
            {sortingAlgos[activeTab]}
          </button>

          <ul className={`absolute ${showDropDown ? "block" : "hidden"} pt-1`}>
            <li>
              {sortingAlgos.map((algo, i) => (
                <span
                  key={algo}
                  className="rounded-t bg-purple-200 hover:bg-purple-400 py-2 px-4 block whitespace-no-wrap cursor-pointer"
                  onClick={() => {
                    onClick(i);
                    setShowDropDown(false);
                  }}
                >
                  {algo}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="p-2" />

      <div className="flex flex-row flex-1">
        {heights.map((value, index) => (
          <Tower key={index} height={value} />
        ))}
      </div>
    </>
  );
};

interface Props {
  key: number;
  height: number;
}
const Tower = (props: Props) => {
  return useMemo(
    () => (
      <div
        className="border-black border-solid border bg-purple-300"
        style={{
          height: `${props.height * 100}%`,
          width: 20,
        }}
      />
    ),
    [props.height]
  );
};

export default Sorting;
