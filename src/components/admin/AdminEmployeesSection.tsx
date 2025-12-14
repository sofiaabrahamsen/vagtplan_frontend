import { Alert, AlertIcon, Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Select, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import type { Employee } from "../../entities/Employee";
import { useGetAllEmployees } from "../../hooks/admin/useGetAllEmployees";
import type {
  AdminEmployeeCreatePayload,
  AdminEmployeeUpdatePayload,
} from "../../services/adminEmployeeService";
import EditPersonalInfoModal from "../EditPersonalInfoModal";

const emptyForm: AdminEmployeeCreatePayload = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  experienceLevel: 1,
};

const AdminEmployeesSection = () => {
  const toast = useToast();

  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee } =
    useGetAllEmployees();

  // CREATE modal state
  const [form, setForm] = useState<AdminEmployeeCreatePayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // EDIT modal state (EditPersonalInfoModal)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // -----------------------------
  // CREATE helpers
  // -----------------------------
  const handleCreateOpen = () => {
    setForm(emptyForm);
    onOpen();
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setForm((prev) => ({ ...prev, experienceLevel: value }));
  };

  const isFormValid = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      form.address.trim().length > 0 &&
      form.username.trim().length > 0 &&
      form.password.trim().length > 0 &&
      Number.isFinite(form.experienceLevel) &&
      form.experienceLevel > 0
    );
  }, [form]);

  const handleCreateSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      await createEmployee({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        experienceLevel: form.experienceLevel,
        username: form.username.trim(),
        password: form.password.trim(),
      });

      toast({
        title: "Employee created",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      onClose();
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Save failed",
        description,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // EDIT helpers (EditPersonalInfoModal)
  // -----------------------------
  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setEditingEmployee(null);
    setIsEditOpen(false);
  };

  const handleEditSave = async (updated: Employee) => {
    try {
      if (!updated.employeeId) throw new Error("Missing employee id");

      const payload: AdminEmployeeUpdatePayload = {
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
      };

      await updateEmployee(updated.employeeId, payload);

      toast({
        title: "Employee updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      handleEditClose();
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Update failed",
        description,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // -----------------------------
  // DELETE helpers
  // -----------------------------
  const handleDelete = async (employeeId: number) => {
    setDeletingId(employeeId);
    try {
      await deleteEmployee(employeeId);

      toast({
        title: "Employee deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err: unknown) {
      const description = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Delete failed",
        description,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box
      p={4}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
      color="gray.800"
    >
      <HStack justify="space-between" mb={4}>
        <Button size="sm" leftIcon={<FiPlus />} colorScheme="blue" onClick={handleCreateOpen}>
          New account
        </Button>
      </HStack>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading employees...
          </Text>
        </HStack>
      )}

      {error && !loading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && employees.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No employees found.
        </Text>
      )}

      {!loading && employees.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>ID</Th>
                <Th>First name</Th>
                <Th>Last name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th>Experience</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.map((e) => (
                <Tr key={e.employeeId}>
                  <Td>{e.employeeId}</Td>
                  <Td>{e.firstName}</Td>
                  <Td>{e.lastName}</Td>
                  <Td>{e.email}</Td>
                  <Td>{e.phone}</Td>
                  <Td>{e.address}</Td>
                  <Td>{e.experienceLevel}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit employee"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => openEdit(e)}
                      />
                      <IconButton
                        aria-label="Delete employee"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        isLoading={deletingId === e.employeeId}
                        onClick={() => void handleDelete(e.employeeId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired isInvalid={!form.firstName.trim()}>
              <FormLabel>First name</FormLabel>
              <Input name="firstName" value={form.firstName} onChange={handleCreateChange} />
              <FormErrorMessage>First name is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.lastName.trim()}>
              <FormLabel>Last name</FormLabel>
              <Input name="lastName" value={form.lastName} onChange={handleCreateChange} />
              <FormErrorMessage>Last name is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.email.trim()}>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={form.email} onChange={handleCreateChange} />
              <FormErrorMessage>Email is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.phone.trim()}>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" value={form.phone} onChange={handleCreateChange} />
              <FormErrorMessage>Phone is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.address.trim()}>
              <FormLabel>Address</FormLabel>
              <Input name="address" value={form.address} onChange={handleCreateChange} />
              <FormErrorMessage>Address is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.username.trim()}>
              <FormLabel>User name</FormLabel>
              <Input name="username" value={form.username} onChange={handleCreateChange} />
              <FormErrorMessage>Username is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired isInvalid={!form.password.trim()}>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={form.password} onChange={handleCreateChange} />
              <FormErrorMessage>Password is required.</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Experience</FormLabel>
              <Select value={String(form.experienceLevel)} onChange={handleExperienceChange}>
                <option value="1">Beginner</option>
                <option value="2">Practiced</option>
                <option value="3">Experienced</option>
                <option value="4">Professional</option>
                <option value="5">Legendary</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => void handleCreateSave()}
              isLoading={saving}
              isDisabled={!isFormValid}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <EditPersonalInfoModal
        user={editingEmployee}
        isOpen={isEditOpen}
        onClose={handleEditClose}
        onSave={(emp) => void handleEditSave(emp)}
      />
    </Box>
  );
};

export default AdminEmployeesSection;
