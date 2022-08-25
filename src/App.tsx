import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "./components/Grid";

function App() {
  return (
    <>
      <button>New</button>
      <div style={{ height: "1000px", width: "900px", margin:'auto' }}>
        <Grid />
      </div>
    </>
  );
}

export default App;
