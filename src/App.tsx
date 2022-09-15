import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "./components/Grid";
import { KanbanProvider, useKanban } from "./context/KanbanContext";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <>
      <ChakraProvider>
        <KanbanProvider>
          <div style={{ height: "1000px", width: "900px", margin: "auto" }}>
            <Grid />
          </div>
        </KanbanProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
