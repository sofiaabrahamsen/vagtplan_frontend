import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import type { Employee } from "../../entities/Employee";

interface Props {
  user: Employee;
  onEditClick?: () => void; // Dashboard will handle the modal
}

const PersonalInfoCard = ({ user, onEditClick }: Props) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="blue.600">
      <Heading size="md" mb={3}>About you</Heading>

      <VStack align="start" spacing={2}>
        <Text><b>Name:</b> {user.firstName} {user.lastName}</Text>
        <Text><b>Email:</b> {user.email}</Text>
        <Text><b>Phone:</b> {user.phone}</Text>
        {user.address && <Text><b>Address:</b> {user.address}</Text>}
        <Text><b>Experience level:</b> {user.experienceLevel}</Text>

        <Button colorScheme="blue" size="sm" onClick={onEditClick}>
          Edit Info
        </Button>
      </VStack>
    </Box>
  );
};

export default PersonalInfoCard;
