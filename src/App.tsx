import React from "react";
import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import MonteCarlo from "./screens/MonteCarlo/MonteCarlo";
import Sorting from "./screens/Sorting/Sorting";
import PathFinding from "./screens/PathFinding/PathFinding";

const App: React.FC = () => {
  return (
    <>
      <Tabs defaultActiveKey="Sorting" id="main_tab_navigator">
        <Tab eventKey="Sorting" title="Sorting">
          <Sorting />
        </Tab>
        <Tab eventKey="UnionFind" title="UnionFind">
          <MonteCarlo />
        </Tab>
        <Tab eventKey="PathFinding" title="PathFinding">
          <PathFinding/>
        </Tab>
      </Tabs>
    </>
  );
};

export default App;
