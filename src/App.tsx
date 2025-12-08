import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* ADMIN DASHBOARD (protected) */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE DASHBOARD (protected) */}
        <Route
          path="/dashboard-employee"
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
