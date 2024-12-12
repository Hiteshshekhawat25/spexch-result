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
// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./AuthModal/Login";
// import Layout from "./Layout";

// import SuperAdminForm from "./SuperAdmin/SuperAdminComponents/SuperAdminForm/SuperAdminForm";
// import CreateNewMatch from "./components/Matches/CreateNewMatch";
// // Defining Routes
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Login />,
//   },
//   {
//     path: "/dashboard",
//     element: <Layout />,
//   },
//   {
//     path: "/adminform",
//     element: <SuperAdminForm />,
//   },
//   {
//     path: "/creatematch",
//     element: <CreateNewMatch/>,
//   },
// ]);

// export default function App() {
//   return <RouterProvider router={router} />;
// }
