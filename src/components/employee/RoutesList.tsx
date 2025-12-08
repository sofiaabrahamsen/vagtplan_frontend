import { Box, Heading, List, ListItem } from "@chakra-ui/react";

interface Route {
  id: number;
  name: string;
}

interface RoutesListProps {
  routes: Route[];
}

const RoutesList = ({ routes }: RoutesListProps) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
      <Heading size="md" mb={3}>My Routes</Heading>
      <List spacing={2}>
        {routes.map(route => (
          <ListItem key={route.id}>Route: {route.name}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoutesList;
