/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginClient } from "../services/loginClient";

interface TokenPayload {
  role: string;
}

const LoginPage = () => {
  

  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      const token = await loginClient.signIn(username, password);
      localStorage.setItem("token", token);

      // Decode JWT and get role
      const decoded = jwtDecode<TokenPayload>(token);
      const role = decoded.role?.toLowerCase();
      
      toast({
        title: "Sign in successful!",
        status: "success",
        duration: 2500,
      });

      // Redirect based on role
      if (role === "admin") navigate("/dashboard-admin");
      else if (role === "employee") navigate("/dashboard-employee");
      else navigate("/"); // fallback
    } catch (error) {
      console.error("SIGN-IN ERROR:", error);

      toast({
        title: "Sign in failed",
        description: "Invalid username or password.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.100" px={4} flexDirection="column">
      <Heading textAlign="center" mb={4} color="gray.700" size="xl">
        Go-card management system
      </Heading>
      <Box p={10} bg="gray.600" shadow="lg" rounded="md" width="100%" maxWidth="400px">
        <Heading textAlign="center" mb={8} color="white">
          Sign in
        </Heading>

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="white">Username</FormLabel>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Password</FormLabel>
              <Input
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
