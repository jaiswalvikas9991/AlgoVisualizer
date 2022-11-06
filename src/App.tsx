import { useState } from "react";
import Graph from "screens/Graph";
import Sorting from "screens/Sorting";

const App = () => {
  const [activeTabNum, setActiveTabNum] = useState(0);

  let activeTabUi;
  if (activeTabNum === 0) activeTabUi = <Sorting />;
  else if (activeTabNum === 1) activeTabUi = <Graph />;

  return (
    <div className="h-screen w-screen flex flex-col items-center scrollbar-none overflow-hidden">
      <nav className="w-full sm:w-5/6 h-min mt-2 mb-2 space-x-3 bg-purple-100 backdrop-blur-md shadow-md rounded-md p-2">
        <span>AlgoVisualizer</span>
        <button
          onClick={() => setActiveTabNum(0)}
          className="p-2 rounded-md bg-purple-200 shadow-md hover:bg-purple-300"
        >
          Sorting
        </button>
        <button
          onClick={() => setActiveTabNum(1)}
          className="p-2 rounded-md bg-purple-200 shadow-md hover:bg-purple-300"
        >
          Path Finding
        </button>
      </nav>
      <div className="flex flex-col w-full h-full">{activeTabUi}</div>
    </div>
  );
};

export default App;
