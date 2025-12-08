import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

interface User {
  userName: string;
  employeeId: number;
  email?: string;
  phone?: string;
}

interface PersonalInfoCardProps {
  user: User;
  onEdit?: () => void;
}

const PersonalInfoCard = ({ user, onEdit }: PersonalInfoCardProps) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
      <Heading size="md" mb={3}>My Info</Heading>
      <VStack align="start" spacing={2}>
        <Text><b>Username:</b> {user.userName}</Text>
        {user.email && <Text><b>Email:</b> {user.email}</Text>}
        {user.phone && <Text><b>Phone:</b> {user.phone}</Text>}
        {onEdit && (
          <Button colorScheme="blue" size="sm" onClick={onEdit}>
            Edit Info
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default PersonalInfoCard;
