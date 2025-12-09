import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout, {
  type DashboardNavItem,
} from "../components/DashboardLayout";
import EditPersonalInfoModal from "../components/EditPersonalInfoModal";
import PersonalInfoCard from "../components/employee/PersonalInfoCard";
import RoutesList from "../components/employee/RoutesList";
import WorkHoursChart from "../components/employee/WorkHoursChart";

import type { Employee } from "../entities/Employee";
import { useEmployeeDashboard } from "../hooks/useEmployeeDashboard";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";

const EmployeeDashboard = () => {
  const {
    employee: fetchedEmployee,
    routes,
    workHours,
    loading,
    error,
  } = useEmployeeDashboard();

  const { updateEmployee } = useUpdateEmployee();

  // Local copy to avoid mutating data returned from the hook
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);

  // Keep local employee state in sync when the hook fetches new data
  useEffect(() => {
    setEmployee(fetchedEmployee ?? null);
  }, [fetchedEmployee]);

  const handleEditClick = () => {
    if (!employee) return;
    // Create a defensive copy (good practice)
    setModalEmployee({ ...employee });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalEmployee(null);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    try {
      const result = await updateEmployee(updatedEmployee);

      if (result.success) {
        // Update local state (no mutation)
        setEmployee(updatedEmployee);

        // Close modal
        handleCloseModal();
      } else {
        alert(result.error || "Failed to update employee");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Unexpected error while updating employee");
    }
  };

  // Small guards + slightly more robust rendering
  const hasRoutes = useMemo(() => routes && routes.length > 0, [routes]);
  const hasWorkHours = useMemo(
    () => workHours && workHours.length > 0,
    [workHours]
  );

  const navItems: DashboardNavItem[] = [
    { label: "Profile", targetId: "section-profile" },
    { label: "Routes", targetId: "section-routes" },
    { label: "Work hours", targetId: "section-hours" },
  ];

  return (
    <DashboardLayout title="Employee Dashboard" navItems={navItems}>
      <VStack spacing={6} align="stretch">
        {loading && (
          <Box>
            <Spinner />
          </Box>
        )}

        {error && (
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        <Box id="section-profile">
          {employee && (
            <PersonalInfoCard user={employee} onEditClick={handleEditClick} />
          )}

          {!loading && !error && !employee && (
            <Alert status="info">
              <AlertIcon />
              No employee data could be found.
            </Alert>
          )}
        </Box>

        <Box id="section-routes">
          {hasRoutes && <RoutesList routes={routes} />}
        </Box>

        <Box id="section-hours">
          {hasWorkHours && <WorkHoursChart workHours={workHours} />}
        </Box>

        <EditPersonalInfoModal
          user={modalEmployee}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </VStack>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
