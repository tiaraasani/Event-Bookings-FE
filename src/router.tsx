import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },

  {
    element: <ProtectedRoute />,
    children: [],
  },

  {
    element: <ProtectedRoute roles={["ORGANIZER"]} />,
    children: [],
  },
]);
