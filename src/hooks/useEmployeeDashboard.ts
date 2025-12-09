import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { Employee } from "../entities/Employee";
import type { Route } from "../entities/Route";
import type { MonthlyHoursRow } from "../entities/WorkHours";

import { workHoursService } from "../services/workHoursService";

interface EmployeeDashboardData {
  employee: Employee | null;
  routes: Route[];
  workHours: MonthlyHoursRow[];
  loading: boolean;
  error: string | null;
}

export const useEmployeeDashboard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [workHours, setWorkHours] = useState<MonthlyHoursRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ------------------------------
    // Helper: Load last X months of hours
    // ------------------------------
    const fetchWorkHoursForLastMonths = async (
      employeeId: number,
      monthsBack = 3
    ) => {
      const results: MonthlyHoursRow[] = [];
      const now = new Date();

      for (let offset = 0; offset < monthsBack; offset++) {
        const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        try {
          const rows = await workHoursService.getAll({
            params: { employeeId, month, year },
          });

          if (rows.length > 0) {
            results.push(rows[0]); // backend returns one row for the month
          }
        } catch (err) {
          console.warn(`Failed to load hours for ${month}/${year}`, err);
        }
      }

      return results.reverse(); // oldest → newest for chart display
    };

    // ------------------------------
    // Main data loader
    // ------------------------------
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Decode employee ID from JWT
        const decoded = jwtDecode<{ nameid: string }>(token);
        const userId = Number(decoded.nameid);
        if (!userId) throw new Error("Token does not contain userId");

        const apiUrl = import.meta.env["VITE_API_URL"];

        // Fetch the employee
        const employeeResponse = await fetch(`${apiUrl}/Employees/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!employeeResponse.ok)
          throw new Error("Failed to fetch employee");

        const employeeData: Employee = await employeeResponse.json();
        setEmployee(employeeData);

        const employeeId = employeeData.employeeId;

        // -----------------------------------------
        // Fetch ONLY the employee's own routes
        // -----------------------------------------
        const routesResponse = await fetch(
          `${apiUrl}/employee/get-employee-routes-by-id/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!routesResponse.ok)
          throw new Error("Failed to fetch employee routes");

        const employeeRoutes: Route[] = await routesResponse.json();
        setRoutes(employeeRoutes);

        // -----------------------------------------
        // Fetch 3 months of work hours
        // -----------------------------------------
        const hours = await fetchWorkHoursForLastMonths(employeeId, 3);
        setWorkHours(hours);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    employee,
    routes,
    workHours,
    loading,
    error,
  } as EmployeeDashboardData;
};
