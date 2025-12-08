import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  title: string;
  bgColor?: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, bgColor, children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <Flex direction="column" minHeight="100vh" bg="gray.100">
      {/* Header */}
      <Flex justify="space-between" align="center" bg={bgColor} color="white" p={4}>
        <Heading size="md">{title}</Heading>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      {/* Main Content */}
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
