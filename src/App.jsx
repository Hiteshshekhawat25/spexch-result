import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./AuthModal/Login";
import Layout from "./Layout";

import SuperAdminForm from "./SuperAdmin/SuperAdminComponents/SuperAdminForm/SuperAdminForm";
// Defining Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
  },
  {
    path: "/adminform",
    element: <SuperAdminForm />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
