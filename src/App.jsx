
import React from "react"; // Add this at the top
import { BrowserRouter } from "react-router-dom";
import RoutesComp from "./routes/Routes";

export default function App() {
  return (
    <BrowserRouter>
      <RoutesComp />
    </BrowserRouter>
  );
}

