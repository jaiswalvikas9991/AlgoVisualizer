import React, { useState, useMemo, useReducer, Dispatch } from "react";
import Percolation from "algorithms/QuickUnionFind/Percolation";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";

const MonteCarlo: React.FC = () => {
  // This is a function to introduce syncronous time delay
  // const wait = ms => {
  //   var start = Date.now(),
  //     now = start;
  //   while (now - start < ms) {
  //     now = Date.now();
  //   }
  // };

  // const [mouseCaptureState, setMouseCaptureState] = useState(false);
  const [dimension, setDimension]: [number, Function] = useState(30);
  const numberReducer = (state: number, action: { type: string, payload: number }): number => {
    switch (action.type) {
      case "UPDATE": return (action.payload);
      case "RESET": return (0);
      default: return (state);
    }
  };
  const [number, setNumber]: [
    number,
    Dispatch<{ type: string; payload: number }>
  ] = useReducer(numberReducer, 0);

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
    // if (action.type === "UPDATE") {
    //   let array = [...state];
    //   array[action.payload] = true;
    //   return array;
    // }
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
    }
    setNumber({ type: "UPDATE", payload: system.numberOfOpenSites() });
  };

  const onClick = (newDimension: number, _: number): void => {
    if (newDimension !== dimension) {
      setDimension(newDimension);
      setOpenList({ type: "RESET", payload: -1 });
      setNumber({ type: "UPDATE", payload: 0 });
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

      <h2 style ={{color : "#4EC5F1"}}>
        Monte Carlo Simulation
      </h2>


      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <p>{`Number of Open Sites : ${number}`}</p>
        <div style={{ width: 20 }}></div>
        <p>{`Number of Closed Sites : ${dimension * dimension - number}`}</p>
        <div style={{ width: 20 }}></div>
        <p>{`Average : ${(number) / (dimension * dimension - number)}`}</p>
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

// class MonteCarlo extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       choosed: -1,
//       dimension: 20
//     };
//   }

//   start = () => {
//     let system = new Percolation(this.state.dimension);
//     while (!system.percolates()) {
//       let row = Math.floor(Math.random() * this.state.dimension) + 1;
//       let col = Math.floor(Math.random() * this.state.dimension) + 1;
//       // open works based on one indexing
//       system.open(row, col);
//       this.setState(() => ({ choosed: this.state.dimension * (row - 1) + (col - 1) }));
//       setTimeout(() => {
//         //your code to be executed after 1 second
//       }, 3000);
//     }
//     if (system.percolates) {
//       alert("System has percoloated");
//     }
//   };

//   render() {
//     return (
//       <>
//         <button onClick={this.start}>Start</button>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             flexWrap: "wrap",
//             width: "100%"
//           }}
//         >
//           {[...Array(this.state.dimension * this.state.dimension)].map(
//             (_, index) => (
//               <Box index={index} choosed={this.state.choosed} />
//             )
//           )}
//         </div>
//       </>
//     );
//   }
// }

interface Props {
  key: number;
  open: boolean;
  index: number;
}

const Box = (props: Props) => {
  // const blockReducer = (state, action) => {
  //   switch (action.type) {
  //     case "UPDATE":
  //       return !state;
  //     default:
  //       return state;
  //   }
  // };
  // const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   if (!open && props.choosed === props.index) {
  //     console.log("Call form box with index : " + props.index);
  //     setOpen(true);
  //   }
  //   else{
  //     setOpen(open);
  //   }
  // }, [props.choosed]);

  // This is to handle he hovering effect
  // const [inState, setInState] = useState(false);
  // const handleClick = () => {
  //   blockUpdate({ type: "UPDATE" });
  // };
  // const handleEnter = () => {
  //   setInState(true);
  // };
  // const handleOut = () => {
  //   setInState(false);
  // };

  // const handleMouseMove = event => {
  //   if (props.mouseCaptureState && blockState) {
  //     blockUpdate({ type: "UPDATE" });
  //   }
  // };

  // useEffect(() => {
  //   blockUpdate(props.blockState);
  // }, []);

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
      // onClick={handleClick}
      // onMouseEnter={handleEnter}
      // onMouseOut={handleOut}
      // onMouseMove={handleMouseMove}
      />
    ),
    [props.open]
  );
};

export default MonteCarlo;
