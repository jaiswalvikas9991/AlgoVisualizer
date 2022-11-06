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
  const defaultArrayLen: number = 50;
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
  const [startDisabled, setStartDisabled] = useState(false);

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

  const isSorted = (heights: number[]) => {
    for (let i = 1; i < heights.length; i++)
      if (heights[i - 1] > heights[i]) return false;
    return true;
  };

  const onStart = async () => {
    setStartDisabled(true);
    let sort: SortingAlgo = new SortingAlgo(
      setHeights,
      animationSpeeds[animationSpeed]
    );
    if (!isSorted(heights)) {
      switch (activeTab) {
        case 0:
          await sort.selectionSort([...heights]);
          break;
        case 1:
          await sort.bubbleSort([...heights]);
          break;
        case 2:
          await sort.heapSort([...heights]);
          break;
        case 3:
          let arrayM: number[] = [...heights];
          await sort.mergeSort(arrayM);
          break;
        case 4:
          let arrayQ: number[] = [...heights];
          await sort.quickSort(arrayQ, 0, arrayQ.length - 1);
          break;
        case 5:
          await sort.insertionSort([...heights]);
          break;
        default:
          await sort.selectionSort([...heights]);
      }
    }
    setStartDisabled(false);
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

  const onArrayReload = () => {
    setHeights({ type: "UPDATE", payload: randomMatrix(nodeNum) });
  };

  return (
    <>
      <div className="flex flex-row items-center space-x-2 ml-2 mr-2 flex-wrap">
        <Button
          color={startDisabled ? "disabled" : "success"}
          disabled={startDisabled}
          text="Start"
          onClick={onStart}
        />

        <div className="dropdown inline-block relative">
          <Button
            onClick={() => setShowDropDown(!showDropDown)}
            color={startDisabled ? "disabled" : "primary"}
            disabled={startDisabled}
            text={sortingAlgos[activeTab]}
          />

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
          color={startDisabled ? "disabled" : "primary"}
          disabled={startDisabled}
          onClick={() =>
            setAnimationSpeed((animationSpeed + 1) % animationSpeeds.length)
          }
          text={`Animation Speed: ${animationSpeedsInEnglish[animationSpeed]}`}
        />

        <Button
          color={startDisabled ? "disabled" : "primary"}
          disabled={startDisabled}
          onClick={onArrayReload}
          text="Reload Array"
        />

        <label
          htmlFor="default-range"
          className="block mb-2 text-sm font-medium text-purple-500"
        >
          No. of Blocks {nodeNum}
        </label>
        <input
          disabled={startDisabled}
          id="default-range"
          type="range"
          value={nodeNum}
          min={2}
          max={100}
          onChange={onNumberOfNodeChange}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
            startDisabled
              ? "bg-slate-300 slider-disabled"
              : "bg-purple-300 slider"
          }`}
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
    [props.height, props.width]
  );
};

export default Sorting;
