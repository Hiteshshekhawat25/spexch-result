import React from "react";
import { BrowserRouter } from "react-router-dom"; // Provides routing context
import RoutesComp from "./routes/Routes"; // Import your RoutesComp
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter >
      <RoutesComp />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        // transition={Slide}
      />
    </BrowserRouter>
  );
};

export default App;
