import { edgeIdFromSourceAndTarget, getId, Link, Node } from "algorithms/utils";
import ForceGraph3d from "react-force-graph-3d";

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  width: number;
  height: number;
  nodeColor: Map<number, string>;
  edgeColor: Map<string, string>;
  onNodeClick: (id: number) => unknown;
}

const GraphSim = ({
  nodes,
  links,
  width,
  height,
  nodeColor,
  edgeColor,
  onNodeClick,
}: ForceGraphProps) => {
  const graph = {
    nodes: nodes,
    links: links,
  };

  return (
    <ForceGraph3d
      linkWidth={1}
      linkLabel={(link: Link) => getId(link.source) + "-" + getId(link.target)}
      nodeLabel={(node) => node.id + ""}
      width={width}
      height={height}
      nodeColor={(node: Node) => nodeColor.get(node.id)}
      linkColor={(link: Link) =>
        edgeColor.get(
          edgeIdFromSourceAndTarget(getId(link.source), getId(link.target))
        )
      }
      graphData={graph}
      backgroundColor="white"
      onNodeClick={(node: Node) => onNodeClick(node.id)}
    />
  );
};

export default GraphSim;
