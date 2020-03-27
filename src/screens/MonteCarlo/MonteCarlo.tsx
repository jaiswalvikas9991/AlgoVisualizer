import React, { useState, useMemo, useReducer, Dispatch } from "react";
import Percolation from "algorithms/QuickUnionFind/Percolation";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";

const MonteCarlo: React.FC = () => {
  // const [mouseCaptureState, setMouseCaptureState] = useState(false);
  const [dimension, setDimension]: [number, Function] = useState(30);
  const [number, setNumber]: [number, (param: number) => Promise<number>] = useAsyncState<number>(0);

  const getInitialState = (newDimension: number = dimension): boolean[] => {
    const openStatus: boolean[] = [];
    for (let i: number = 0; i < newDimension * newDimension; i++) {
      openStatus.push(false);
    }
    return openStatus;
  };

  const openListReducer = (
    state: boolean[],
    action: { type: string; payload: number }
  ): boolean[] => {
    switch (action.type) {
      case "UPDATE":
        let array: boolean[] = [...state];
        array[action.payload] = true;
        return array;

      case "RESET":
        return [...getInitialState()];

      default:
        return state;
    }
  };
  const [openList, setOpenList]: [
    boolean[],
    Dispatch<{ type: string; payload: number }>
  ] = useReducer(openListReducer, getInitialState());


  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const start = async (): Promise<void> => {
    let system = new Percolation(dimension);
    while (!system.percolates()) {
      let row: number = Math.floor(Math.random() * dimension) + 1;
      let col: number = Math.floor(Math.random() * dimension) + 1;
      // open works based on one indexing
      system.open(row, col);
      await sleep(5);
      setOpenList({
        type: "UPDATE",
        payload: dimension * (row - 1) + (col - 1)
      });
      await setNumber(system.numberOfOpenSites());
    }
  };

  const onClick = (newDimension: number, _: number): void => {
    if (newDimension !== dimension) {
      setDimension(newDimension);
      setOpenList({ type: "RESET", payload: -1 });
      setNumber(0);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button onClick={start}>Start</Button>
        <DropdownButton
          id="dimension-select-dropdown-button"
          title="Select Dimension"
        >
          <Dropdown.Item as="button" onClick={() => onClick(20, 0)}>
            20
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => onClick(30, 1)}>
            30
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => onClick(40, 2)}>
            40
          </Dropdown.Item>
        </DropdownButton>
      </div>

      <h2 style={{ color: "#4EC5F1" }}>
        Monte Carlo Simulation
      </h2>


      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <p>{`Number of Open Sites : ${number}`}</p>
        <div style={{ width: 20 }}></div>
        <p>{`Number of Closed Sites : ${dimension * dimension - number}`}</p>
        <div style={{ width: 20 }}></div>
        <p>{`Average(open / close) : ${(number) / (dimension * dimension - number)}`}</p>
        <div style={{ width: 20 }}></div>
        <p>{`Average(close / open) : ${number === 0 ? 0 : (dimension * dimension - number) / (number)}`}</p>
      </div>


      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: dimension * 20
        }}
      // onMouseDown={handleDown}
      // onMouseUp={handleUp}
      >
        {[...Array(dimension * dimension)].map((_, index) => (
          <Box key={index} index={index} open={openList[index]} />
        ))}
      </div>
    </>
  );
};

interface Props {
  key: number;
  open: boolean;
  index: number;
}

const Box = (props: Props) => {
  return useMemo(
    () => (
      <div
        style={{
          width: 20,
          height: 20,
          background: props.open ? "white" : "#71d7f4",
          border: 0.25,
          borderColor: "black",
          borderStyle: "solid"
        }}
      />
    ),
    [props.open]
  );
};

//* This is a custom hook
const useAsyncState = <T,>(initialValue: T): [T, (param: T) => Promise<T>] => {
  const [value, setValue]: [T, Dispatch<T>] = useState(initialValue);
  const setter = (x: T) =>
    new Promise<T>(resolve => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}

export default MonteCarlo;