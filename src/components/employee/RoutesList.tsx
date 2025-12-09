import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import type { Route } from "../../entities/Route";

interface Props {
  routes: Route[];
}

const RoutesList = ({ routes }: Props) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="blue.600">
      <Heading size="md" mb={3}>My Routes</Heading>
      <UnorderedList>
        {routes.map((route) => (
          <ListItem key={route.id}>Route {route.routeNumber}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default RoutesList;
