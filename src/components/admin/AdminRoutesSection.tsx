// src/components/admin/AdminRoutesSection.tsx
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
import { useRoutes } from "../../hooks/admin/useRoutes";
import type { Route, RoutePayload } from "../../services/routeService";

type Mode = "create" | "edit";

interface RouteForm {
  id?: number;
  routeNumber: string; // keep as string in form, convert to number in payload
}

const emptyForm: RouteForm = {
  routeNumber: "",
};

const AdminRoutesSection = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { routes, loading, error, createRoute, updateRoute, deleteRoute } =
    useRoutes();

  const [form, setForm] = useState<RouteForm>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isEdit = mode === "edit";

  const isFormValid = useMemo(() => {
    if (!form.routeNumber.trim()) return false;
    const num = Number(form.routeNumber);
    return Number.isFinite(num) && num > 0;
  }, [form.routeNumber]);

  // -----------------------------
  // Modal helpers
  // -----------------------------
  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    onOpen();
  };

  const openEdit = (route: Route) => {
    setMode("edit");
    setForm({
      id: route.id,
      routeNumber: String(route.routeNumber),
    });
    onOpen();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Save (create / update)
  // -----------------------------
  const handleSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      const payload: RoutePayload = {
        routeNumber: Number(form.routeNumber.trim()),
      };

      if (isEdit && form.id != null) {
        await updateRoute(form.id, payload);
        toast({
          title: "Route updated",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } else {
        await createRoute(payload);
        toast({
          title: "Route created",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }

      onClose();
    } catch (err: unknown) {
      let description;
       if (err instanceof Error) {
        description = err.message;
       }else {
        description = "Unknown error";
       }
      toast({
        title: "Save failed",
        description: description,
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
      await deleteRoute(id);
      toast({
        title: "Route deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err: unknown) {
      let description;
        if (err instanceof Error) {
        description = err.message;
       }
      else {
        description = "Unknown error";
       }
      toast({
        title: "Delete failed",
        description: description,
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
          New route
        </Button>
      </HStack>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading routes...
          </Text>
        </HStack>
      )}

      {error && !loading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && routes.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No routes found.
        </Text>
      )}

      {!loading && routes.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple" width="100%">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.700">Route number</Th>
                <Th color="gray.700" textAlign="right">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {routes.map((r) => (
                <Tr key={r.id}>
                  <Td color="gray.800">{r.routeNumber}</Td>
                  <Td textAlign="right">
                    <HStack spacing={2} justify="flex-end">
                      <IconButton
                        aria-label="Edit route"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={()=> openEdit(r)}
                      />
                      <IconButton
                        aria-label="Delete route"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        isLoading={deletingId === r.id}
                        onClick={()=> void handleDelete(r.id)}
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
            {isEdit ? "Edit route" : "Create route"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mb={4}
              isRequired
              isInvalid={!form.routeNumber.trim() || !isFormValid}
            >
              <FormLabel>Route number</FormLabel>
              <Input
                name="routeNumber"
                type="number"
                value={form.routeNumber}
                onChange={handleChange}
                placeholder="e.g. 101, 202"
              />
              {!form.routeNumber.trim() ? (
                <FormErrorMessage>Route number is required.</FormErrorMessage>
              ) : (
                !isFormValid && (
                  <FormErrorMessage>
                    Route number must be a positive number.
                  </FormErrorMessage>
                )
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

export default AdminRoutesSection;
