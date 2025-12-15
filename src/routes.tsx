import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagementPage from "./pages/AdminManagementPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },

  {
    path: "/dashboard-admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/management",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-employee",
    element: (
      <ProtectedRoute roles={["employee"]}> 
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
// TODO - NICE TO HAVE - add list of roles as refactoring

export default router;
