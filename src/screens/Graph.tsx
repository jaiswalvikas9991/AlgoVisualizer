import bfs from "algorithms/BFS";
import Queue from "algorithms/Queue";
import {
  Link,
  sleep,
  Node,
  edgeIdFromSourceAndTarget,
  getId,
} from "algorithms/utils";
import Button from "components/Button";
import { useEffect, useState, useRef } from "react";
import GraphSim from "./GraphSim";
import "../slider.css";

const makeGraph = (nodes: Node[], edges: Link[]): Map<number, Set<number>> => {
  const graph = new Map<number, Set<number>>();
  for (const node of nodes)
    if (!graph.has(node.id)) graph.set(node.id, new Set());
  for (const edge of edges) {
    graph.get(getId(edge.source)).add(getId(edge.target));
  }
  return graph;
};

export default function App() {
  const [nodeNum, setNodeNum] = useState(10);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [nodeColor, setNodeColor] = useState<Map<number, string>>(
    new Map<number, string>()
  );
  const [edgeColor, setEdgeColor] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [changeStartNode, setChangeStartNode] = useState(false);
  const [changeEndNode, setChangeEndNode] = useState(false);
  const animationSpeeds = [500, 1000, 2000, 3000, 4000];
  const animationSpeedsInEnglish = [
    "Very Fast",
    "Fast",
    "Normal",
    "Slow",
    "Very Slow",
  ];
  const [animationSpeed, setAnimationSpeed] = useState(2);

  const pathFinderAlgos = ["BFS"];
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);

  const bfsStateUpdate = async (
    done: Set<number>,
    q: Queue<number>,
    cur: number
  ) => {
    const queueSet = new Set<number>(q.queue);

    const curNodeColor = new Map<number, string>();
    for (const node of nodes) {
      if (node.id === cur) curNodeColor.set(node.id, "blue");
      else if (done.has(node.id)) curNodeColor.set(node.id, "red");
      else if (queueSet.has(node.id)) curNodeColor.set(node.id, "yellow");
      // TODO: There is bug here
      else curNodeColor.set(node.id, "purple");
    }

    const curEdgeColor = new Map<string, string>();
    for (const edge of links) {
      if (done.has(getId(edge.source)) && done.has(getId(edge.target)))
        curEdgeColor.set(
          edgeIdFromSourceAndTarget(getId(edge.source), getId(edge.target)),
          "red"
        );
      else if (getId(edge.source) === cur && queueSet.has(getId(edge.target)))
        curEdgeColor.set(
          edgeIdFromSourceAndTarget(getId(edge.source), getId(edge.target)),
          "yellow"
        );
      // TODO: There is bug here
      else
        curEdgeColor.set(
          edgeIdFromSourceAndTarget(getId(edge.source), getId(edge.target)),
          "purple"
        );
    }
    setNodeColor(curNodeColor);
    setEdgeColor(curEdgeColor);
    await sleep(animationSpeeds[animationSpeed]);
  };

  const resetColor = () => {
    setNodeColor((nodes) => {
      const colors = new Map<number, string>();
      for (const key of nodes) colors.set(key[0], "purple");
      return colors;
    });

    setEdgeColor((edges) => {
      const colors = new Map<string, string>();
      for (const key of edges) colors.set(key[0], "purple");
      return colors;
    });
  };

  const renderRandomGraph = () => {
    const nodes = [];
    const nodeColor = new Map<number, string>();
    for (let i = 0; i < nodeNum; i++) {
      nodes.push({ id: i });
      nodeColor.set(i, "purple");
    }

    const links = [];
    const edgeColor = new Map<string, string>();
    for (let i = 0; i < nodeNum; i++)
      for (let j = 0; j < nodeNum; j++)
        if (i !== j && Math.random() <= 0.2) {
          links.push({ source: i, target: j });
          links.push({ source: j, target: i });
          edgeColor.set(edgeIdFromSourceAndTarget(i, j), "purple");
        }

    setNodes(nodes);
    setLinks(links);
    setStartNode(0);
    setEndNode(nodeNum - 1);
    setNodeColor(nodeColor);
    setEdgeColor(edgeColor);
  };

  const resizeCanvas = () => {
    if (!parentRef) return;
    setWidth(parentRef.current.clientWidth);
    setHeight(parentRef.current.clientHeight);
  };

  useEffect(() => {
    renderRandomGraph();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    renderRandomGraph();
  }, [nodeNum]);

  const onClick = async () => {
    resetColor();
    await sleep(1000);
    const graph = makeGraph(nodes, links);
    const source = startNode,
      target = endNode;
    setStartButtonDisabled(true);
    await bfs(
      graph,
      startNode,
      endNode,
      bfsStateUpdate,
      async (edges: [number, number][]) => {
        const curNodeColor = new Map<number, string>();
        for (const node of nodes) {
          curNodeColor.set(node.id, "purple");
        }
        for (const edge of edges) {
          curNodeColor.set(edge[0], "black");
          curNodeColor.set(edge[1], "black");
        }
        curNodeColor.set(source, "blue");
        curNodeColor.set(target, "blue");

        const curEdgeColor = new Map<string, string>();
        for (const edge of links) {
          const eid = edgeIdFromSourceAndTarget(
            getId(edge.source),
            getId(edge.target)
          );
          curEdgeColor.set(eid, "purple");
        }
        for (const edge of edges) {
          const eid = edgeIdFromSourceAndTarget(getId(edge[0]), getId(edge[1]));
          const reid = edgeIdFromSourceAndTarget(
            getId(edge[1]),
            getId(edge[0])
          );
          curEdgeColor.set(eid, "black");
          curEdgeColor.set(reid, "black");
        }
        setNodeColor(curNodeColor);
        setEdgeColor(curEdgeColor);
        setStartButtonDisabled(false);
      },
      async () => {
        alert("No Path Found");
        setStartButtonDisabled(false);
      }
    );
  };

  const onNodeClick = (id: number) => {
    if (changeStartNode) setStartNode(id);
    else if (changeEndNode) setEndNode(id);
    setChangeStartNode(false);
    setChangeEndNode(false);
  };

  const onNumberOfNodeChange = (e) => {
    setNodeNum(e.target.value);
  };

  return (
    <>
      <div className="ml-2 mr-2 flex flex-row items-center space-x-2 flex-wrap">
        <Button
          disabled={startButtonDisabled}
          color={startButtonDisabled ? "disabled" : "success"}
          onClick={onClick}
          text="Start"
        />

        <Button
          disabled={startButtonDisabled}
          color={startButtonDisabled ? "disabled" : "primary"}
          text={pathFinderAlgos[selectedAlgo]}
          onClick={() =>
            setSelectedAlgo((selectedAlgo + 1) % pathFinderAlgos.length)
          }
        />

        <Button
          disabled={startButtonDisabled}
          color={
            startButtonDisabled
              ? "disabled"
              : changeStartNode
              ? "danger"
              : "primary"
          }
          text={`Source Node ${startNode}`}
          onClick={() => {
            setChangeEndNode(false);
            setChangeStartNode(!changeStartNode);
          }}
        />

        <Button
          disabled={startButtonDisabled}
          color={
            startButtonDisabled
              ? "disabled"
              : changeEndNode
              ? "danger"
              : "primary"
          }
          text={`Target Node ${endNode}`}
          onClick={() => {
            setChangeStartNode(false);
            setChangeEndNode(!changeEndNode);
          }}
        />

        <Button
          disabled={startButtonDisabled}
          color={startButtonDisabled ? "disabled" : "primary"}
          onClick={() =>
            setAnimationSpeed((animationSpeed + 1) % animationSpeeds.length)
          }
          text={`Animation Speed: ${animationSpeedsInEnglish[animationSpeed]}`}
        />

        <Button
          disabled={startButtonDisabled}
          color={startButtonDisabled ? "disabled" : "primary"}
          onClick={() => renderRandomGraph()}
          text="Reload Graph"
        />

        <label
          htmlFor="default-range"
          className="block text-sm font-medium text-purple-500"
        >
          No. of Nodes {nodeNum}
        </label>
        <input
          disabled={startButtonDisabled}
          id="default-range"
          type="range"
          value={nodeNum}
          min={2}
          max={50}
          onChange={onNumberOfNodeChange}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
            startButtonDisabled
              ? "bg-slate-300 slider-disabled"
              : "bg-purple-300 slider"
          }`}
        />
      </div>
      <div className="p-2 mt-1 mb-1" />
      <div className="flex-1" ref={parentRef}>
        <GraphSim
          width={width}
          height={height}
          nodes={nodes}
          links={links}
          nodeColor={nodeColor}
          edgeColor={edgeColor}
          onNodeClick={onNodeClick}
        />
      </div>
    </>
  );
}
