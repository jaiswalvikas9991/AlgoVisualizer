import React, {
  useReducer,
  useMemo,
  Dispatch,
  useState,
  useRef,
  useEffect,
} from "react";
import SortingAlgo from "algorithms/SortingAlgo";
import Button from "components/Button";

const randomMatrix = (dimension: number): number[] => {
  let array: number[] = [];
  for (let i: number = 0; i < dimension; i++) {
    array.push(Math.random());
  }
  return array;
};

const Sorting: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [towerWidth, setTowerWidth] = useState(20);
  const [activeTab, setActiveTab] = useState(0);
  const [showDropDown, setShowDropDown] = useState(false);
  const defaultArrayLen: number = 100;
  const [nodeNum, setNodeNum] = useState(defaultArrayLen);
  const animationSpeeds = [50, 100, 150, 200, 300];
  const animationSpeedsInEnglish = [
    "Very Fast",
    "Fast",
    "Normal",
    "Slow",
    "Very Slow",
  ];
  const [animationSpeed, setAnimationSpeed] = useState(2);

  const onScreenResize = () => {
    if (!parentRef) return;
    setTowerWidth(parentRef.current.clientWidth / nodeNum);
  };

  useEffect(() => {
    window.addEventListener("resize", onScreenResize);
    return () => window.removeEventListener("resize", onScreenResize);
  }, []);

  const onNumberOfNodeChange = (e) => {
    setNodeNum(e.target.value);
  };

  useEffect(() => {
    setHeights({ type: "UPDATE", payload: randomMatrix(nodeNum) });
    onScreenResize();
  }, [nodeNum]);

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

  const onStart = (): void => {
    let sort: SortingAlgo = new SortingAlgo(
      setHeights,
      animationSpeeds[animationSpeed]
    );
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
    setHeights({ type: "UPDATE", payload: randomMatrix(nodeNum) });
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
      <div className="flex flex-row items-center space-x-2 ml-2 mr-2">
        <Button color="success" text="Start" onClick={onStart} />

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

        <Button
          onClick={() =>
            setAnimationSpeed((animationSpeed + 1) % animationSpeeds.length)
          }
          text={`Animation Speed: ${animationSpeedsInEnglish[animationSpeed]}`}
        />

        <label
          htmlFor="default-range"
          className="block mb-2 text-sm font-medium text-purple-500"
        >
          No. of Blocks {nodeNum}
        </label>
        <input
          id="default-range"
          type="range"
          value={nodeNum}
          min={2}
          max={100}
          onChange={onNumberOfNodeChange}
          className="flex-1 h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <div className="p-2" />

      <div ref={parentRef} className="flex flex-row flex-1">
        {heights.map((value, index) => (
          <Tower key={index} width={towerWidth} height={value} />
        ))}
      </div>
    </>
  );
};

interface Props {
  key: number;
  height: number;
  width: number;
}
const Tower = (props: Props) => {
  return useMemo(
    () => (
      <div
        className="border-black border-solid border bg-purple-300"
        style={{
          height: `${props.height * 100}%`,
          width: props.width,
        }}
      />
    ),
    [props.height]
  );
};

export default Sorting;
