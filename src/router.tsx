import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerLayout from "./components/OrganizerLayout";
import AttendeesRedirect from "./components/AttendeesRedirect";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import CreateEvent from "@/pages/CreateEvent";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import EventDetail from "./pages/EventDetail";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import MyOrdersPage from "./pages/myOrdersPage";
import TransactionPage from "./pages/TransactionPage";
import OrganizerTransactionsPage from "./pages/OrganizerTransactionsPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import OrganizerEventsPage from "./pages/OrganizerEventsPage";
import EventAttendeesPage from "./pages/EventAttendeesPage";
import EditEvent from "./pages/EditEvent";
import NotFoundPage from "./pages/NotFoundPage";
import OrganizerReviewsPage from "./pages/OrganizerReviewsPage";
import PromotionPageForOrganizer from "@/pages/PromotionPageForOrganizer";
import PromotionsPage from "./pages/PromotionPage";

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
    path: "/transaction/:eventId",
    element: <TransactionPage />,
  },
  {
    path: "/promotions",
    element: <PromotionsPage />,
  },
  {
    path: "/organizers/:organizationId/reviews",
    element: <OrganizerReviewsPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/profile", element: <ProfilePage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/my-orders", element: <MyOrdersPage /> }],
  },

  {
    element: <ProtectedRoute roles={["ORGANIZER"]} />,
    children: [
      {
        path: "/events/create",
        element: <CreateEvent />,
      },
      {
        path: "/organizer/promotions",
        element: <PromotionPageForOrganizer />,
      },
      {
        path: "/organizer/events/:id/attendees",
        element: <AttendeesRedirect />,
      },
      {
        // Pages that share the organizer sidebar
        element: <OrganizerLayout />,
        children: [
          {
            path: "/organizer",
            element: <Navigate to="/organizer/dashboard" replace />,
          },
          { path: "/organizer/dashboard", element: <OrganizerDashboardPage /> },
          { path: "/organizer/events", element: <OrganizerEventsPage /> },
          {
            path: "/organizer/transactions",
            element: <OrganizerTransactionsPage />,
          },
          { path: "/organizer/attendees", element: <EventAttendeesPage /> },
          { path: "/events/:id/edit", element: <EditEvent /> },
        ],
      },
    ],
  },

  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
