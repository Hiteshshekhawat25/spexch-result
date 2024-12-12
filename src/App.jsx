import React from "react";
import { BrowserRouter } from "react-router-dom"; // Provides routing context
import RoutesComp from "./routes/Routes"; // Import your RoutesComp

const App = () => {
  return (
    <BrowserRouter>
      <RoutesComp /> {/* Render the routes */}
    </BrowserRouter>
  );
};

export default App;

