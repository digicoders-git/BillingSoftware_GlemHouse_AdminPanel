import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Icon, 
  Spinner, 
  useToast,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Input
} from '@chakra-ui/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Package,
  Plus
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const SalesRepInventoryLog = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    product: '',
    type: 'add',
    quantity: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      const [logsRes, invRes] = await Promise.all([
        API.get('/branch-inventory/logs'),
        API.get('/branch-inventory')
      ]);
      setLogs(logsRes.data);
      setInventory(invRes.data.inventory);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching history", status: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjust = async () => {
    if (!formData.product || !formData.quantity || !formData.reason) {
      toast({ title: "Please fill all fields", status: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      await API.put(`/branch-inventory/${formData.product}/adjust`, {
        action: formData.type,
        quantity: formData.quantity,
        reason: formData.reason
      });
      toast({ title: "Shelf updated", status: "success" });
      onClose();
      fetchData();
    } catch (error) {
      toast({ title: "Failed to update", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Layout><Flex justify="center" align="center" h="70vh"><Spinner size="xl" color="brand.500" /></Flex></Layout>;
  }

  return (
    <Layout>
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <HStack spacing="3" mb="2">
               <Box p="2" bg="brand.50" color="brand.500" borderRadius="lg"><History size={22}/></Box>
               <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Stock Movement Log</Heading>
            </HStack>
            <Text color="gray.500" fontWeight="500">Track all additions and subtractions from your shelf</Text>
          </Box>
          <Button leftIcon={<Plus size={18} />} colorScheme="brand" borderRadius="xl" onClick={onOpen}>Manual Adjustment</Button>
        </Flex>

        <Box className="premium-card" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50/50">
              <Tr>
                <Th py="5">Timestamp</Th>
                <Th py="5">Product</Th>
                <Th py="5">Movement</Th>
                <Th py="5">Quantity</Th>
                <Th py="5">Reason</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logs.map((log, idx) => (
                <Tr key={idx} _hover={{ bg: 'gray.50/30' }}>
                  <Td>
                    <Text fontSize="xs" fontWeight="700">{moment(log.createdAt).format('DD MMM, YYYY')}</Text>
                    <Text fontSize="10px" color="gray.400">{moment(log.createdAt).format('hh:mm A')}</Text>
                  </Td>
                  <Td>
                    <HStack>
                       <Icon as={Package} color="gray.400" size={14} />
                       <Text fontWeight="800" fontSize="xs">{log.product?.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={log.type.includes('In') ? 'green' : 'orange'} variant="subtle" borderRadius="full" px="3">
                       {log.type}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                       <Icon as={log.type.includes('In') ? ArrowUpRight : ArrowDownLeft} color={log.type.includes('In') ? 'green.500' : 'orange.500'} size={14} />
                       <Text fontWeight="900">{log.quantity} Units</Text>
                    </HStack>
                  </Td>
                  <Td><Text fontSize="xs" fontWeight="600" color="gray.500">{log.reason}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Adjustment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader color="secondary">Shelf Adjustment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="4">
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800">PRODUCT</FormLabel>
                  <Select placeholder="Choose product" borderRadius="lg" onChange={(e) => setFormData({ ...formData, product: e.target.value })}>
                    {inventory.map(item => (
                      <option key={item._id} value={item._id}>{item.name} (Stock: {item.stock})</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800">TYPE</FormLabel>
                  <Select borderRadius="lg" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="add">Add to Shelf</option>
                    <option value="remove">Remove from Shelf</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800">QUANTITY</FormLabel>
                  <Input type="number" borderRadius="lg" onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800">REASON</FormLabel>
                  <Input placeholder="e.g. Returned from customer, Sample given" borderRadius="lg" onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap="3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button colorScheme="brand" borderRadius="xl" onClick={handleAdjust} isLoading={submitting}>Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Layout>
  );
};

export default SalesRepInventoryLog;

