import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Bicycle } from "../../services/bicycleService";
import { useBicycles } from "../../hooks/admin/useBicycles";
import type { BicyclePayload } from "../../services/bicycleService";

type Mode = "create" | "edit";

type BicycleForm = {
  bicycleId?: number;
  bicycleNumber: string;
  inOperate: boolean;
};

const emptyForm: BicycleForm = {
  bicycleNumber: "",
  inOperate: true,
};

const AdminBicyclesSection = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    bicycles,
    loading,
    error,
    createBicycle,
    updateBicycle,
    deleteBicycle,
  } = useBicycles();

  const [form, setForm] = useState<BicycleForm>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isEdit = mode === "edit";

  const isFormValid = useMemo(
    () => form.bicycleNumber.trim().length > 0,
    [form]
  );

  // -----------------------------
  // Modal helpers
  // -----------------------------
  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    onOpen();
  };

  const openEdit = (bicycle: Bicycle) => {
    setMode("edit");
    setForm({
      bicycleId: bicycle.bicycleId,
      bicycleNumber: bicycle.bicycleNumber,
      inOperate: bicycle.inOperate,
    });
    onOpen();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------
  // Save (create / update)
  // -----------------------------
  const handleSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      const payload: BicyclePayload = {
        bicycleNumber: form.bicycleNumber.trim(),
        inOperate: form.inOperate,
      };

      if (isEdit && form.bicycleId != null) {
        await updateBicycle(form.bicycleId, payload);
        toast({
          title: "Bicycle updated",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } else {
        await createBicycle(payload);
        toast({
          title: "Bicycle created",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }

      onClose();
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.message ?? "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteBicycle(id);
      toast({
        title: "Bicycle deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err?.message ?? "Unknown error",
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
    >
      <HStack justify="space-between" mb={4}>
        <Button
          size="sm"
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={openCreate}
        >
          New bicycle
        </Button>
      </HStack>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading bicycles...
          </Text>
        </HStack>
      )}

      {error && !loading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && bicycles.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No bicycles found.
        </Text>
      )}

      {!loading && bicycles.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.700">Number</Th>
                <Th color="gray.700">In operate</Th>
                <Th color="gray.700" textAlign={"right"}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bicycles.map((b) => (
                <Tr key={b.bicycleId}>
                  <Td color="gray.800">{b.bicycleNumber}</Td>
                  <Td color="gray.800">{b.inOperate ? "Yes" : "No"}</Td>
                  <Td>
                    <HStack spacing={2} justify={"end"}>
                      <IconButton
                        aria-label="Edit bicycle"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => openEdit(b)}
                      />
                      <IconButton
                        aria-label="Delete bicycle"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        isLoading={deletingId === b.bicycleId}
                        onClick={() => handleDelete(b.bicycleId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEdit ? "Edit bicycle" : "Create bicycle"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mb={4}
              isRequired
              isInvalid={!form.bicycleNumber.trim()}
            >
              <FormLabel>Bicycle number</FormLabel>
              <Input
                name="bicycleNumber"
                value={form.bicycleNumber}
                onChange={handleChange}
                placeholder="e.g. 101, 202, etc."
              />
              {!form.bicycleNumber.trim() && (
                <FormErrorMessage>
                  Bicycle number is required.
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">In operate</FormLabel>
              <Switch
                name="inOperate"
                isChecked={form.inOperate}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isLoading={saving}
              isDisabled={!isFormValid}
            >
              {isEdit ? "Save changes" : "Create"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminBicyclesSection;
