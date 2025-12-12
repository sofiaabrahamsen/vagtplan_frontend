// src/pages/AdminManagementPage.tsx
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

const AdminManagementPage = () => {
  const navItems: DashboardNavItem[] = [
    // go back to the admin dashboard profile view
    { label: "My Profile", to: "/dashboard-admin" },

    // In-page sections on the management page
    { label: "Accounts", targetId: "section-employees" },
    { label: "Bicycles", targetId: "section-bicycles" },
    { label: "Routes", targetId: "section-routes" },
    { label: "Shifts (ListOfShift)", targetId: "section-shifts" },
    { label: "Shift plans", targetId: "section-shiftplans" },
    { label: "Substitutes", targetId: "section-substitutes" },
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
          <Heading size="md" mb={2}>
            Bicycles
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Bicycle management UI not implemented yet. We can wire this to
            <code> /api/Bicycles </code> next.
          </Alert>
        </Box>

        {/* ROUTES */}
        <Box id="section-routes">
          <Heading size="md" mb={2}>
            Routes
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Route management UI not implemented yet. We can use
            <code> /api/Routes </code> for CRUD.
          </Alert>
        </Box>

        {/* SHIFTS (ListOfShift) */}
        <Box id="section-shifts">
          <Heading size="md" mb={2}>
            Shifts (ListOfShift)
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Shift management UI not implemented yet. Your current
            <code> ShiftController </code> supports creating and updating single
            shifts – we can extend the backend with list endpoints and hook them
            up here.
          </Alert>
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

        {/* SUBSTITUTES */}
        <Box id="section-substitutes">
          <Heading size="md" mb={2}>
            Substitutes
          </Heading>
          <Alert status="info" variant="subtle">
            <AlertIcon />
            Substitute management UI not implemented yet. Once your
            <code>Substituteds</code> endpoints are ready, we&apos;ll hook them
            up here.
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
