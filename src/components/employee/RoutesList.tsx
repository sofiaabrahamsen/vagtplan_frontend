import { Box, Heading, SimpleGrid, Flex, Text, Icon } from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import type { Route } from "../../entities/Route";

interface Props {
  routes: Route[];
}

const RoutesList = ({ routes }: Props) => {
  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
    >
      <Heading size="md" mb={4} color="gray.700">
        Your Routes
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {routes.map((route) => (
          <Box
            key={route.id}
            p={4}
            rounded="lg"
            borderWidth="1px"
            borderColor="gray.200"
            bg="gray.50"
            shadow="xs"
            _hover={{
              shadow: "md",
              transform: "scale(1.02)",
              bg: "gray.100",
            }}
            transition="all 0.15s ease-out"
          >
            <Flex align="center" gap={3}>
              <Box
                p={2}
                rounded="full"
                bg="blue.100"
                color="blue.600"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Icon as={FiMapPin} boxSize={5} />
              </Box>

              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Route {route.routeNumber}
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RoutesList;
