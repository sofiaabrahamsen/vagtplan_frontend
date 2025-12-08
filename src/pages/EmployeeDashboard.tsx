import { VStack } from "@chakra-ui/react";
import DashboardLayout from "../components/DashboardLayout";
import PersonalInfoCard from "../components/employee/PersonalInfoCard";
import ShiftsTable from "../components/employee/ShiftsTable";
import RoutesList from "../components/employee/RoutesList";
import WorkHoursChart from "../components/employee/WorkHoursChart";

const EmployeeDashboard = () => {
  // Example placeholder data
  const user = {
    userName: "admin",
    employeeId: 1,
    email: "admin@example.com",
    phone: "12345678",
  };

  const shifts = [
    { date: "2025-12-10", startTime: "09:00", endTime: "17:00", substitute: "Bob" },
    { date: "2025-12-11", startTime: "10:00", endTime: "18:00" },
  ];

  const routes = [
    { id: 1, name: "Route A" },
    { id: 2, name: "Route B" },
  ];

  const workHours = { month: "December", hours: 160 };

  return (
    <DashboardLayout title="Employee Dashboard" bgColor="blue.600">
      <VStack spacing={6} align="stretch">
        <PersonalInfoCard user={user} onEdit={() => console.log("Edit clicked")} />
        <ShiftsTable shifts={shifts} />
        <RoutesList routes={routes} />
        <WorkHoursChart month={workHours.month} hours={workHours.hours} />
      </VStack>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
