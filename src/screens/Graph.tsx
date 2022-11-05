import bfs from "algorithms/BFS";
import Queue from "algorithms/Queue";
import {
  Link,
  sleep,
  Node,
  edgeIdFromSourceAndTarget,
  getId,
} from "algorithms/utils";
import { useEffect, useState, useRef } from "react";
import GraphSim from "./GraphSim";

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

  const pathFinderAlgos = ["BFS", "Dijkstra"];
  const [selectedAlgo, setSelectedAlgo] = useState(0);

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
      else curNodeColor.set(node.id, nodeColor.get(node.id));
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
      else
        curEdgeColor.set(
          edgeIdFromSourceAndTarget(getId(edge.source), getId(edge.target)),
          edgeColor.get(
            edgeIdFromSourceAndTarget(getId(edge.source), getId(edge.target))
          )
        );
    }
    setNodeColor(curNodeColor);
    setEdgeColor(curEdgeColor);
    await sleep(animationSpeeds[animationSpeed]);
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
    const graph = makeGraph(nodes, links);
    const source = startNode,
      target = endNode;
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
        await sleep(animationSpeeds[animationSpeed]);
      },
      async () => {}
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
      <div className="ml-2 flex flex-row items-center space-x-2 flex-wrap">
        <button
          className="p-2 mt-1 mb-1 rounded-md bg-green-200 shadow-md hover:bg-green-300"
          onClick={onClick}
        >
          Start
        </button>

        <button
          className="p-2 mt-1 mb-1 rounded-md bg-purple-200 shadow-md hover:bg-purple-300"
          onClick={() =>
            setSelectedAlgo((selectedAlgo + 1) % pathFinderAlgos.length)
          }
        >
          {pathFinderAlgos[selectedAlgo]}
        </button>

        <button
          className={`p-2 mt-1 mb-1 rounded-md shadow-md hover:bg-purple-300 ${
            changeStartNode
              ? "bg-red-200 hover:bg-red-300"
              : "bg-purple-200 hover:bg-purple-300"
          }`}
          onClick={() => {
            setChangeEndNode(false);
            setChangeStartNode(!changeStartNode);
          }}
        >
          Source Node {startNode}
        </button>

        <button
          className={`p-2 mt-1 mb-1 rounded-md shadow-md ${
            changeEndNode
              ? "bg-red-200 hover:bg-red-300"
              : "hover:bg-purple-300 bg-purple-200"
          }`}
          onClick={() => {
            setChangeStartNode(false);
            setChangeEndNode(!changeEndNode);
          }}
        >
          Target Node {endNode}
        </button>

        <button
          className="p-2 mt-1 mb-1 rounded-md bg-purple-200 shadow-md hover:bg-purple-300"
          onClick={() =>
            setAnimationSpeed((animationSpeed + 1) % animationSpeeds.length)
          }
        >
          Animation Speed: {animationSpeedsInEnglish[animationSpeed]}
        </button>

        <button
          className="p-2 mt-1 mb-1 rounded-md bg-purple-200 shadow-md hover:bg-purple-300"
          onClick={() => renderRandomGraph()}
        >
          Reload Graph
        </button>

        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="number"
          placeholder="Number of Nodes"
          value={nodeNum}
          onChange={onNumberOfNodeChange}
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
