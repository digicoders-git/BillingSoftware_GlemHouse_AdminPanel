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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Package
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const BranchInventoryLog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    product: '',
    type: 'add',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      toast({ title: "Error fetching data", status: "error" });
      setLoading(false);
    }
  };

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
      toast({ title: "Inventory updated", status: "success" });
      onClose();
      fetchData();
    } catch (error) {
      toast({ title: "Failed to update", description: error.response?.data?.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Branch Inventory (Stock In/Out)</Heading>
            <Text fontSize="sm" color="gray.500">Maintain your branch stock levels manually</Text>
          </Box>
          <HStack spacing="3">
            <Button variant="ghost" colorScheme="brand" onClick={() => window.location.href = '/branch/manage-products'}>
              View Inventory
            </Button>
            <Button leftIcon={<Plus size={18} />} colorScheme="brand" borderRadius="xl" onClick={onOpen}>
              Adjust Stock
            </Button>
          </HStack>
        </Flex>

        {/* Inventory History Table */}
        <Box className="premium-card">
          <Box p="4" borderBottom="1px solid" borderColor="gray.50">
            <Heading size="sm" color="secondary">Inventory Adjustment History</Heading>
          </Box>
          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="background">
                <Tr>
                  <Th color="gray.500" border="none">Date</Th>
                  <Th color="gray.500" border="none">Product</Th>
                  <Th color="gray.500" border="none">Type</Th>
                  <Th color="gray.500" border="none">Quantity</Th>
                  <Th color="gray.500" border="none">Reason</Th>
                  <Th color="gray.500" border="none">Adjusted By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs.length > 0 ? logs.map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100"><Text fontSize="xs" color="gray.500">{moment(row.createdAt).format('YYYY-MM-DD hh:mm A')}</Text></Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Icon as={Package} size={16} color="gray.400" />
                        <Text fontWeight="600" fontSize="sm">{row.product?.name}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <Badge 
                        colorScheme={row.type === 'Stock In' ? 'green' : 'red'} 
                        variant="subtle" 
                        borderRadius="full" 
                        px="3"
                        fontSize="10px"
                      >
                        {row.type}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack>
                         <Icon as={row.type === 'Stock In' ? ArrowUpRight : ArrowDownLeft} color={row.type === 'Stock In' ? 'green.500' : 'red.500'} size={14} />
                         <Text fontWeight="700">{row.quantity} Units</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="sm" color="gray.600">{row.reason}</Text></Td>
                    <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="600">{row.adjustedBy?.name}</Text></Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan="6" textAlign="center" py="10" color="gray.400">No adjustment history found</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Adjustment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader color="secondary">Stock Adjustment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="4">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Select Product</FormLabel>
                  <Select 
                    placeholder="Select a product" 
                    borderRadius="lg" 
                    h="45px"
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  >
                    {inventory.map(item => (
                      <option key={item._id} value={item._id}>{item.name} (Current: {item.stock})</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Adjustment Type</FormLabel>
                  <Select 
                    borderRadius="lg" 
                    h="45px"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="add">Stock In (Add Stock)</option>
                    <option value="remove">Stock Out (Reduce Stock)</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Quantity</FormLabel>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity" 
                    borderRadius="lg" 
                    h="45px" 
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Reason</FormLabel>
                  <Input 
                    placeholder="e.g. Damaged, Restock, Return" 
                    borderRadius="lg" 
                    h="45px" 
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap="3">
              <Button variant="ghost" onClick={onClose} borderRadius="xl">Cancel</Button>
              <Button 
                colorScheme="brand" 
                borderRadius="xl" 
                px="8" 
                onClick={handleAdjust}
                isLoading={submitting}
              >Update Stock</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default BranchInventoryLog;
