import { Box, Button, Heading, Text, VStack, Divider } from "@chakra-ui/react";
import type { Employee } from "../../entities/Employee";

interface Props {
  user: Employee;
  onEditClick?: () => void;
}

const PersonalInfoCard = ({ user, onEditClick }: Props) => {
  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.300"
      rounded="md"
      shadow="sm"
    >
      <Heading size="md" mb={4} color="gray.700">
        Profile
      </Heading>

      <VStack align="start" spacing={2} color="gray.700">
        <Text>
          <b>Name:</b> {user.firstName} {user.lastName}
        </Text>

        <Text>
          <b>Email:</b> {user.email}
        </Text>

        <Text>
          <b>Phone:</b> {user.phone}
        </Text>

        {user.address && (
          <Text>
            <b>Address:</b> {user.address}
          </Text>
        )}

        <Text>
          <b>Experience level:</b> {user.experienceLevel}
        </Text>
      </VStack>

      <Divider my={4} />

      <Button
        size="sm"
        bg="gray.700"
        color="white"
        _hover={{ bg: "gray.800" }}
        onClick={onEditClick}
      >
        Edit info
      </Button>
    </Box>
  );
};

export default PersonalInfoCard;
