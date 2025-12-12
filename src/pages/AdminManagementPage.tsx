import {
  Box,
  Heading,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import DashboardLayout, {
  type DashboardNavItem,
} from "../components/DashboardLayout";
import AdminEmployeesSection from "../components/admin/AdminEmployeesSection";
import AdminBicyclesSection from "../components/admin/AdminBicyclesSection";
import AdminRoutesSection from "../components/admin/AdminRoutesSection";
import AdminShiftsSection from "../components/admin/AdminShiftsSection";  

const AdminManagementPage = () => {
  const navItems: DashboardNavItem[] = [
    // go back to the admin dashboard profile view
    { label: "My Profile", to: "/dashboard-admin" },

    // In-page sections on the management page
    { label: "Accounts", targetId: "section-employees" },
    { label: "Bicycles", targetId: "section-bicycles" },
    { label: "Routes", targetId: "section-routes" },
    { label: "Shifts", targetId: "section-shifts" },
    { label: "Shift plans", targetId: "section-shiftplans" },
    { label: "Work hours", targetId: "section-workhours" },
  ];

  return (
    <DashboardLayout title="Admin Management" navItems={navItems}>
      <VStack spacing={6} align="stretch">
        {/* EMPLOYEES & USERS */}
        <Box id="section-employees">
          <Heading size="md" mb={3} color="gray.600">
            Users
          </Heading>
          <AdminEmployeesSection />
        </Box>

        {/* BICYCLES */}
        <Box id="section-bicycles">
          <Heading size="md" mb={3} color="gray.600">
            Bicycles
          </Heading>
          <AdminBicyclesSection />
        </Box>

        {/* ROUTES */}
        <Box id="section-routes">
          <Heading size="md" mb={2} color="gray.600">
            Routes
          </Heading>
          <AdminRoutesSection />
        </Box>

        {/* SHIFTS */}
        <Box id="section-shifts">
          <Heading size="md" mb={2} color="gray.600">
            Shifts
          </Heading>
          <AdminShiftsSection />
        </Box>

        {/* SHIFT PLANS */}
        <Box id="section-shiftplans">
          <Heading size="md" mb={2}>
            Shift plans
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Shift plan management UI not implemented yet. We can call
            <code> /api/shiftplans </code> and{" "}
            <code>/api/shiftplans/generate-6weeks</code> from here.
          </Alert>
        </Box>

        {/* WORK HOURS */}
        <Box id="section-workhours">
          <Heading size="md" mb={2}>
            Work hours (6-week plan)
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Here we can later add actions to generate work hours in
            <code> WorkHoursInMonths </code> based on a 6-week plan and show
            reports using <code>/api/reports/monthly-hours</code>.
          </Alert>
        </Box>
      </VStack>
    </DashboardLayout>
  );
};

export default AdminManagementPage;
