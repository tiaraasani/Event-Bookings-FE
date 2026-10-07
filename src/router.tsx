import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [],
  },

  {
    element: <ProtectedRoute roles={["ORGANIZER"]} />,
    children: [],
  },
]);
