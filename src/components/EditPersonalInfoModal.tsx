import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Employee } from "../entities/Employee";

interface Props {
  user: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Employee) => void;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const EditPersonalInfoModal = ({ user, isOpen, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState<Employee | null>(user);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);

  // Sync form data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({ ...user });
      setErrors({});
      setSubmittedOnce(false);
    }
  }, [isOpen, user]);

  if (!formData) return null;

  // Simple validation
  const validate = (data: Employee): FormErrors => {
    const next: FormErrors = {};

    if (!data.firstName?.trim()) next.firstName = "First name is required.";
    if (!data.lastName?.trim()) next.lastName = "Last name is required.";

    if (!data.email?.trim()) {
      next.email = "Email is required.";
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) next.email = "Please enter a valid email.";
    }

    if (!data.phone?.trim()) next.phone = "Phone is required.";
    if (!data.address?.trim()) next.address = "Address is required.";

    return next;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // If user already tried to submit once, validate live
    if (submittedOnce) {
      setErrors(validate(updated));
    }
  };

  const handleSave = () => {
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setSubmittedOnce(true);

    if (Object.keys(nextErrors).length > 0) return;

    onSave(formData);
  };

  const handleClose = () => {
    setErrors({});
    setSubmittedOnce(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Edit your information
          <Text fontSize="sm" color="gray.500" mt={1}>
            Update your profile details for scheduling and contact.
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Divider />

            {/* Names in two columns on desktop */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.firstName} isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName ?? ""}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName ?? ""}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                placeholder="name@example.com"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.phone} isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone ?? ""}
                  onChange={handleChange}
                  placeholder="+45 12 34 56 78"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.address} isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={formData.address ?? ""}
                  onChange={handleChange}
                  placeholder="Street, city"
                />
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handleClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPersonalInfoModal;
