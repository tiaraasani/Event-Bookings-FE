import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import CreateEvent from "@/pages/CreateEvent";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import EventDetail from "./pages/EventDetail";
import AccessDeniedPage from "./pages/AccessDeniedPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/events",
    element: <EventPage />,
  },
  {
    path: "/events/:id",
    element: <EventDetail />,
  },
  {
    path: "/access-denied",
    element: <AccessDeniedPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/profile", element: <ProfilePage /> }],
  },

  {
    element: <ProtectedRoute roles={["ORGANIZER"]} />,
    children: [
      {
        path: "/events/create",
        element: <CreateEvent />,
      },
    ],
  },

  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
]);
