import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Employee } from "../entities/Employee";
import type { Route } from "../entities/Route";
import type { MonthlyHoursRow } from "../entities/WorkHours";

import { employeeService, type UserInfoDto } from "../services/employeeService";
import { workHoursService } from "../services/workHoursService";

const buildLastMonths = (count: number) => {
  const now = new Date();
  const months: { year: number; month: number }[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 }); // month: 1-12
  }

  return months.reverse();
};

const fetchLastMonthsHours = async (employeeId: number, monthsBack = 3) => {
  const months = buildLastMonths(monthsBack);

  const results = await Promise.all(
    months.map(({ year, month }) =>
      // ApiClient method
      workHoursService.getAll({
        params: { employeeId, year, month },
      })
    )
  );

  return results
    .map((rows) => (rows.length > 0 ? rows[0] : null))
    .filter((x): x is MonthlyHoursRow => x !== null);
};

export const useEmployeeDashboard = () => {
  const userQuery = useQuery<UserInfoDto, Error>({
    queryKey: ["userInfo"],
    queryFn: () => employeeService.getUserInfo(),
  });

  const employeeId = userQuery.data?.employeeId ?? null;

  const routesQuery = useQuery<Route[], Error>({
    queryKey: ["employeeRoutes", employeeId],
    queryFn: () => employeeService.getEmployeeRoutesById(employeeId!),
    enabled: employeeId != null,
  });


  const workHoursQuery = useQuery<MonthlyHoursRow[], Error>({
    queryKey: ["workHoursLast3Months", employeeId],
    queryFn: () => fetchLastMonthsHours(employeeId!, 3),
    enabled: !!employeeId,
  });

  const employee: Employee | null = useMemo(() => {
    const u = userQuery.data;
    if (!u?.employee) return null;

    return {
      employeeId: u.employee.employeeId,
      firstName: u.employee.firstName,
      lastName: u.employee.lastName,
      address: u.employee.address,
      email: u.employee.email,
      phone: u.employee.phone,
      experienceLevel: u.employee.experienceLevel,
      username: u.username,
      password: "", // never comes from the backend
    };
  }, [userQuery.data]);

  const loading =
    !!userQuery.isLoading || !!routesQuery.isLoading || !!workHoursQuery.isLoading;

  const error: string | null =
    userQuery.error?.message ??
    routesQuery.error?.message ??
    workHoursQuery.error?.message ??
    null;

  return {
    employee,
    routes: routesQuery.data ?? [],
    workHours: workHoursQuery.data ?? [],
    loading,
    error,
  };
};
