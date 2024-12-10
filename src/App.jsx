import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './AuthModal/Login'; 
import Layout from './Layout';

// Defining Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <Layout/>
    ),
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
