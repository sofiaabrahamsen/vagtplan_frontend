import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { Employee } from "../entities/Employee";
import type { Route } from "../entities/Route";
import type { MonthlyHoursRow } from "../entities/WorkHours";

import { routeService } from "../services/routeService";
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
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Decode JWT to get userId
        const decoded = jwtDecode<{ nameid: string }>(token);
        const userId = Number(decoded.nameid);

        if (!userId) throw new Error("Token does not contain userId");

        // Use .env API URL
        const apiUrl = import.meta.env['VITE_API_URL'];

        // Fetch employee
        const employeeResponse = await fetch(`${apiUrl}/Employees/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!employeeResponse.ok) throw new Error("Failed to fetch employee");
        const employeeData: Employee = await employeeResponse.json();
        setEmployee(employeeData);

        const employeeId = employeeData.employeeId;

        // Fetch routes
        const routeData = await routeService.getAll();
        setRoutes(routeData);

        // Fetch work hours for current month/year
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const hours = await workHoursService.getAll({
          params: { employeeId, month: currentMonth, year: currentYear },
        });
        setWorkHours(hours);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching employee dashboard data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { employee, routes, workHours, loading, error } as EmployeeDashboardData;
};
