import Queue from "algorithms/Queue";

const makeEdges = (
  source: number,
  target: number,
  introBy: Map<number, number>
): [number, number][] => {
  let cur = target;
  const ans: [number, number][] = [];
  while (cur !== source) {
    const now = introBy.get(cur);
    ans.push([now, cur]);
    cur = now;
  }
  return ans;
};

const bfs = async (
  graph: Map<number, Set<number>>,
  source: number,
  target: number,
  tick: (done: Set<number>, q: Queue<number>, cur: number) => Promise<unknown>,
  pathFound: (edges: [number, number][]) => Promise<unknown>,
  notFound: () => Promise<unknown>
) => {
  const q = new Queue<number>();
  q.enqueue(source);
  const done = new Set<number>();
  const introBy = new Map<number, number>();
  while (!q.isEmpty()) {
    const cur = q.dequeue();
    if (done.has(cur)) continue;
    await tick(done, q, cur);
    if (cur === target)
      return await pathFound(makeEdges(source, target, introBy));
    done.add(cur);
    for (const e of graph.get(cur)) {
      if (done.has(e)) continue;
      q.enqueue(e);
      if (!introBy.has(e)) introBy.set(e, cur);
    }
    await tick(done, q, cur);
  }
  await notFound();
};

export default bfs;
