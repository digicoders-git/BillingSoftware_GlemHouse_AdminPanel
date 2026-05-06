import React from 'react';
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
  VStack
} from '@chakra-ui/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History,
  Package,
  Calendar
} from 'lucide-react';
import Layout from '../../components/Layout';

const BranchInventoryLog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Branch Inventory (Stock In/Out)</Heading>
            <Text fontSize="sm" color="gray.500">Maintain your branch stock levels manually</Text>
          </Box>
          <Button leftIcon={<Plus size={18} />} colorScheme="brand" borderRadius="xl" onClick={onOpen}>
            Adjust Stock
          </Button>
        </Flex>

        {/* Inventory History Table */}
        <Box className="premium-card">
          <Box p="4" borderBottom="1px solid" borderColor="gray.50">
            <Heading size="sm" color="secondary">Inventory Adjustment History</Heading>
          </Box>
          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="gray.50">
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
                {[
                  { date: '2023-10-24 09:30 AM', product: 'iPhone 15 Pro', type: 'Stock In', qty: 10, reason: 'New Arrival', user: 'Manager' },
                  { date: '2023-10-24 11:45 AM', product: 'USB-C Cable', type: 'Stock Out', qty: 2, reason: 'Damaged', user: 'Staff' },
                  { date: '2023-10-23 04:15 PM', product: 'MacBook Air', type: 'Stock In', qty: 5, reason: 'Restock', user: 'Manager' },
                ].map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100"><Text fontSize="xs" color="gray.500">{row.date}</Text></Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Icon as={Package} size={16} color="gray.400" />
                        <Text fontWeight="600" fontSize="sm">{row.product}</Text>
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
                         <Text fontWeight="700">{row.qty} Units</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="sm" color="gray.600">{row.reason}</Text></Td>
                    <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="600">{row.user}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Adjustment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
          <ModalOverlay />
          <ModalContent borderRadius="2xl">
            <ModalHeader color="secondary">Stock Adjustment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="4">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Select Product</FormLabel>
                  <Select placeholder="Select a product" borderRadius="lg" h="45px">
                    <option>iPhone 15 Pro</option>
                    <option>MacBook Air M2</option>
                    <option>AirPods Pro</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Adjustment Type</FormLabel>
                  <Select borderRadius="lg" h="45px">
                    <option value="in">Stock In (Add Stock)</option>
                    <option value="out">Stock Out (Reduce Stock)</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Quantity</FormLabel>
                  <Input type="number" placeholder="Enter quantity" borderRadius="lg" h="45px" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">Reason</FormLabel>
                  <Input placeholder="e.g. Damaged, Restock, Return" borderRadius="lg" h="45px" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap="3">
              <Button variant="ghost" onClick={onClose} borderRadius="xl">Cancel</Button>
              <Button colorScheme="brand" borderRadius="xl" px="8">Update Stock</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default BranchInventoryLog;
