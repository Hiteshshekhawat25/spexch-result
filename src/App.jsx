import React from "react";
import { BrowserRouter } from "react-router-dom"; // Provides routing context
import RoutesComp from "./routes/Routes"; // Import your RoutesComp
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <RoutesComp />
      <ToastContainer /> {/* Render the routes */}
    </BrowserRouter>
  );
};

export default App;

