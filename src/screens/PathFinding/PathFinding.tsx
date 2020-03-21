import React, { useState, useMemo, useReducer, Dispatch, SetStateAction } from "react";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";
import PathFindingAlgos from "algorithms/PathFinding/PathFindingAlgos";
import { onColor, offColor, pathMarkColor } from 'screens/PathFinding/constants';


const PathFinding: React.FC = () => {
    // This handels the dimension of the grid
    const [dimension, setDimension]: [number, Dispatch<SetStateAction<number>>] = useState(30);
    const [mouseCapture, setMouseCapture] = useState(false);
    const [algo, setAlgo] = useState(0);

    // This function is to reset the grid
    const getInitialState = (newDimension: number = dimension): string[][] => {
        const connectedStatus: string[][] = [];

        for (let i: number = 0; i < newDimension; i++) {
            connectedStatus.push([]);
            for (let j: number = 0; j < newDimension; j++) {
                connectedStatus[i].push(onColor);
            }
        }
        return connectedStatus;
    };

    // This is where we create the reducer
    const openListReducer = (
        state: string[][],
        action: { type: string; payload: any }
    ): string[][] => {
        switch (action.type) {
            case "UPDATE":
                // * This updates works with the positions works to make the block off
                let array: string[][] = [...state];
                array[action.payload[0]][action.payload[1]] = offColor;
                return array;

            case "RESET":
                return [...getInitialState()];

            case "BULK": let list: string[][] = [...action.payload]
                return (list);

            case "PATH": let onColorList: string[][] = [...state];
                action.payload.forEach((index: number[]) => {
                    onColorList[index[0]][index[1]] = pathMarkColor;
                });
                return (onColorList);

            default:
                return state;
        }
    };


    // * Here we make it a reducer
    const [openList, setOpenList]: [
        string[][],
        Dispatch<{ type: string; payload: any }>
    ] = useReducer(openListReducer, getInitialState());

    // * This is called when mouse button is pressed
    const handleDown = () => {
        setMouseCapture(true);
    };

    // * This is called when mouse is realsed
    const handleUp = () => {
        setMouseCapture(false);
    };

    const start = async (): Promise<void> => {
        let pathFinding: PathFindingAlgos = new PathFindingAlgos(setOpenList, 200);
        switch (algo) {
            case 0: pathFinding.backTracking(openList, [0, 0]); break;
            case 1: pathFinding.breadthFirstSearch(openList, [0, 0]); break;
            case 2: pathFinding.dijkstra(openList, [0, 0]);
        }
    };

    // This handels the setting of the new  dimension
    const onClick = (newDimension: number, _: number): void => {
        if (newDimension !== dimension) {
            setDimension(newDimension);
            setOpenList({ type: "RESET", payload: [-1, -1] });
        }
    };

    const onPress = (newAlgo: number): void => {
        if (algo !== newAlgo) setAlgo(newAlgo);
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

                <DropdownButton
                    id="dimension-select-dropdown-button"
                    title={['BackTracking', 'Breadth First Search', "Dijkstra's Algorithm"][algo]}
                >
                    <Dropdown.Item as="button" onClick={() => onPress(0)}>
                        BackTracking
                        </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => onPress(1)}>
                        Breadth First Search
                        </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => onPress(2)}>
                        Dijkstra's Algorithm
                        </Dropdown.Item>
                </DropdownButton>
            </div>



            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: dimension * 20
                }}
                onMouseDownCapture={handleDown}
                onMouseUp={handleUp}
            >
                {
                    openList.map((value: string[], i: number) => {
                        return value.map((val: string, j: number) => (
                            <Box key={i * dimension + j} position={[i, j]} open={val} mouseCapture={mouseCapture} setOpenList={setOpenList} />
                        ));
                    })
                }
            </div>
        </>
    );
};



type Props = {
    key: number,
    open: string,
    mouseCapture: boolean,
    setOpenList: Dispatch<{ type: string; payload: number[] }>,
    position: number[],
}

const Box = (props: Props) => {
    // This is to handle he hovering effect

    const handleEnter = () => {
        // * props.position is used to for hover effect
        if (props.open && props.mouseCapture) {
            props.setOpenList({ type: 'UPDATE', payload: props.position });
        }
    };
    return useMemo(
        () => (
            <div
                style={{
                    width: 20,
                    height: 20,
                    background: props.open,
                    border: 0.25,
                    borderColor: "black",
                    borderStyle: "solid"
                }}
                // onClick={handleClick}
                onMouseEnter={handleEnter}
            // onMouseMove={handleMouseMove}
            />
        ),
        [props.open, props.mouseCapture]
    );
};

export default PathFinding;