import { lazy, ReactNode } from "react";

// Lazy-loaded components
const Login = lazy(() => import("./components/Auth/Login"));
const Signup = lazy(() => import("./components/Auth/Signup"));
const Dashboard = lazy(() => import("./components/Chat/ChatDashboard"));
// const Profile = lazy(() => import("./components/User/Profile"));

// Route configuration type
interface RouteConfig {
  path: string;
  element: ReactNode;
  protected: boolean;
}

// Example routes (expand to ~40 as needed)
const routes: RouteConfig[] = [
  // Public routes
  { path: "/login", element: <Login />, protected: false },
  { path: "/signup", element: <Signup />, protected: false },
  { path: "/forgot-password", element: <div>Forgot Password</div>, protected: false },
  { path: "/reset-password", element: <div>Reset Password</div>, protected: false },

  // Protected routes
  { path: "/dashboard", element: <Dashboard />, protected: true },
//   { path: "/profile", element: <Profile />, protected: true },
  { path: "/settings", element: <div>Settings</div>, protected: true },
  { path: "/orders", element: <div>Orders</div>, protected: true },
  { path: "/admin/dashboard", element: <div>Admin Dashboard</div>, protected: true },
  { path: "/reports", element: <div>Reports</div>, protected: true },
  // Add more routes here to reach ~40, e.g.:
  // { path: "/invoices", element: <div>Invoices</div>, protected: true },
  // { path: "/projects", element: <div>Projects</div>, protected: true },
];

export default routes;