import React, { useState, useMemo, useReducer, Dispatch, SetStateAction } from "react";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";
import PathFindingAlgos from "../../algorithms/PathFinding/PathFindingAlgos";

const PathFinding: React.FC = () => {
    // This handels the dimension of the grid
    const [dimension, setDimension]: [number, Dispatch<SetStateAction<number>>] = useState(30);

    const [mouseCapture, setMouseCapture] = useState(false);

    // This function is to reset the grid
    const getInitialState = (newDimension: number = dimension): boolean[][] => {
        const connectedStatus: boolean[][] = [];

        for (let i: number = 0; i < newDimension; i++) {
            connectedStatus.push([]);
            for (let j: number = 0; j < newDimension; j++) {
                connectedStatus[i].push(true);
            }
        }
        return connectedStatus;
    };

    // This is where we create the reducer
    const openListReducer = (
        state: boolean[][],
        action: { type: string; payload: any }
    ): boolean[][] => {
        switch (action.type) {
            case "UPDATE":
                let array: boolean[][] = [...state];
                array[action.payload[0]][action.payload[1]] = false;
                return array;

            case "RESET":
                return [...getInitialState()];

            case "BULK": let list: boolean[][] = [...state];
                action.payload.forEach((value: number[]) => {
                    list[value[0]][value[1]] = false;
                });
                return (list);

            default:
                return state;
        }
    };
    // Here we make it a reducer
    const [openList, setOpenList]: [
        boolean[][],
        Dispatch<{ type: string; payload: any }>
    ] = useReducer(openListReducer, getInitialState());

    // This is called when mouse button is pressed
    const handleDown = () => {
        setMouseCapture(true);
    };

    // This is called when mouse is realsed
    const handleUp = () => {
        setMouseCapture(false);
    };

    const start = async (): Promise<void> => {
        console.log(openList);
        let pathFinding: PathFindingAlgos = new PathFindingAlgos();
        // console.log('Algo called');
        let path: number[][] = await pathFinding.backTracking(openList, [0, 0]);
        // console.log('algo finised');
        console.log(path);
        setOpenList({ type: "BULK", payload: path });
    };

    // This handels the setting of the new  dimension
    const onClick = (newDimension: number, _: number): void => {
        if (newDimension !== dimension) {
            setDimension(newDimension);
            setOpenList({ type: "RESET", payload: [-1, -1] });
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
                    openList.map((value: boolean[], i: number) => {
                        return value.map((val: boolean, j: number) => (
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
    open: boolean,
    mouseCapture: boolean,
    setOpenList: Dispatch<{ type: string; payload: number[] }>,
    position: number[]
}

const Box = (props: Props) => {
    // This is to handle he hovering effect

    const handleEnter = () => {
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
                    background: props.open ? "white" : "red",
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