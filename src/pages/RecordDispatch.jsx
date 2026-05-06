import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Grid, 
  GridItem, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Package, 
  Truck,
  Calendar,
  Search,
  ArrowLeft
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const RecordDispatch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [items, setItems] = useState([
    { id: Date.now(), name: 'iPhone 15 Pro', sku: 'APL-IP15-P', qty: 10, price: 999 }
  ]);

  const [dispatchData, setDispatchData] = useState({
    branch: '',
    date: new Date().toISOString().split('T')[0],
    method: '',
    reference: ''
  });

  const availableProducts = [
    { name: 'iPhone 15 Pro', sku: 'APL-IP15-P', price: 999 },
    { name: 'MacBook Air M2', sku: 'APL-MBA-M2', price: 1299 },
    { name: 'AirPods Pro 2', sku: 'APL-APP-2', price: 249 },
    { name: 'Samsung Galaxy S24', sku: 'SAM-S24', price: 899 },
    { name: 'Sony WH-1000XM5', sku: 'SNY-XM5', price: 349 },
  ];

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', sku: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({
        title: "At least one item required",
        status: "warning",
        duration: 2000,
      });
    }
  };

  const handleProductChange = (id, productName) => {
    const product = availableProducts.find(p => p.name === productName);
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, name: productName, sku: product?.sku || '', price: product?.price || 0 }
        : item
    ));
  };

  const handleQtyChange = (id, qty) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: parseInt(qty) || 0 } : item
    ));
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleConfirmDispatch = () => {
    if (!dispatchData.branch || !dispatchData.method) {
      toast({
        title: "Missing Information",
        description: "Please select branch and transport method.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Dispatch Confirmed!",
      description: `Stock dispatched to ${dispatchData.branch} successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    setTimeout(() => navigate('/total-dispatch-stock'), 2000);
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <HStack spacing="3" mb="2" cursor="pointer" onClick={() => navigate(-1)} _hover={{ color: 'brand.500' }}>
               <ArrowLeft size={18} />
               <Text fontSize="sm" fontWeight="700">Back to Dispatch List</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">New Stock Dispatch</Heading>
            <Text color="gray.500" fontWeight="500">Create a new shipment record for branch allocation</Text>
          </Box>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <Box className="premium-card" p="8" position="sticky" top="20px">
              <Heading size="sm" mb="8" color="secondary" borderBottom="2px solid" borderColor="brand.50" pb="4">
                 Shipment Parameters
              </Heading>
              <VStack spacing="6" align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Target Branch</FormLabel>
                  <Select 
                    placeholder="Choose branch" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="gray.50" 
                    border="none" 
                    fontWeight="700"
                    onChange={(e) => setDispatchData({...dispatchData, branch: e.target.value})}
                  >
                    <option>Downtown Branch</option>
                    <option>Westside Hub</option>
                    <option>Central Plaza</option>
                    <option>North Station</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Dispatch Date</FormLabel>
                  <Input 
                    type="date" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="gray.50" 
                    border="none" 
                    fontWeight="700"
                    value={dispatchData.date}
                    onChange={(e) => setDispatchData({...dispatchData, date: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Transport Method</FormLabel>
                  <Select 
                    placeholder="Select mode" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="gray.50" 
                    border="none" 
                    fontWeight="700"
                    onChange={(e) => setDispatchData({...dispatchData, method: e.target.value})}
                  >
                    <option>Company Truck (Fast)</option>
                    <option>Standard Delivery</option>
                    <option>Urgent Air Freight</option>
                    <option>Third Party Logistics</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Tracking Reference</FormLabel>
                  <Input 
                    placeholder="e.g. BATCH-2024-X" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="gray.50" 
                    border="none" 
                    fontWeight="700"
                    onChange={(e) => setDispatchData({...dispatchData, reference: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="0" overflow="hidden">
              <Flex p="8" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50">
                 <VStack align="start" spacing="0">
                    <Heading size="sm" color="secondary">Product Allocation List</Heading>
                    <Text fontSize="xs" color="gray.400">Select items and quantities to ship</Text>
                 </VStack>
                 <Button leftIcon={<Plus size={18} />} variant="outline" colorScheme="brand" borderRadius="xl" onClick={handleAddItem}>
                    Add Item
                 </Button>
              </Flex>
              
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="gray.50/50">
                    <Tr>
                      <Th color="gray.400" border="none" py="5">Product</Th>
                      <Th color="gray.400" border="none" py="5">SKU</Th>
                      <Th color="gray.400" border="none" py="5" w="120px">Quantity</Th>
                      <Th color="gray.400" border="none" py="5">Unit Price</Th>
                      <Th color="gray.400" border="none" py="5" textAlign="right">Total</Th>
                      <Th color="gray.400" border="none" py="5"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }}>
                        <Td borderColor="gray.100" py="4">
                          <Select 
                            placeholder="Select product" 
                            variant="unstyled" 
                            fontWeight="700" 
                            value={item.name}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {availableProducts.map(p => (
                              <option key={p.sku} value={p.name}>{p.name}</option>
                            ))}
                          </Select>
                        </Td>
                        <Td borderColor="gray.100"><Text fontSize="xs" color="gray.400" fontWeight="700">{item.sku || '---'}</Text></Td>
                        <Td borderColor="gray.100">
                          <Input 
                            type="number" 
                            size="sm" 
                            borderRadius="lg" 
                            bg="gray.50" 
                            border="none" 
                            fontWeight="800"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </Td>
                        <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="700">${item.price}</Text></Td>
                        <Td borderColor="gray.100" textAlign="right">
                           <Text fontWeight="900" color="secondary">${(item.qty * item.price).toLocaleString()}</Text>
                        </Td>
                        <Td borderColor="gray.100">
                          <IconButton 
                            aria-label="Delete" 
                            icon={<Trash2 size={16} />} 
                            size="sm" 
                            variant="ghost" 
                            color="red.400" 
                            _hover={{ bg: 'red.50', color: 'red.600' }}
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box p="8" bg="gray.50/30">
                 <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align="center" gap="6">
                    <HStack spacing="10">
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Total Volume</Text>
                          <Text fontSize="lg" fontWeight="900" color="secondary">{totalItems} Units</Text>
                       </VStack>
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Consignment Value</Text>
                          <Text fontSize="lg" fontWeight="900" color="brand.500">${totalValue.toLocaleString()}</Text>
                       </VStack>
                    </HStack>
                    <Button 
                      colorScheme="brand" 
                      leftIcon={<Save size={20} />} 
                      px="10" 
                      h="55px" 
                      borderRadius="2xl" 
                      shadow="0 10px 20px -5px rgba(255, 159, 67, 0.4)"
                      onClick={handleConfirmDispatch}
                    >
                      Confirm & Dispatch
                    </Button>
                 </Flex>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default RecordDispatch;
