import React from "react";
import Header from "./Header.jsx";
import PrintSimulator from "./PrintSimulator.jsx";
import { ParamsProvider } from "../context/ParamsContext.jsx";
const App = () => {
  return (
    <ParamsProvider>
      <Header />
      <PrintSimulator />
    </ParamsProvider>
  );
};

export default App;
