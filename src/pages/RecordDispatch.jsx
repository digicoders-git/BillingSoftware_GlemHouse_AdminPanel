import React, { useState, useEffect } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const RecordDispatch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0 }
  ]);

  const [dispatchData, setDispatchData] = useState({
    branch: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Company Truck',
    reference: ''
  });

  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [branchesRes, productsRes] = await Promise.all([
        API.get('/branches'),
        API.get('/products')
      ]);
      setBranches(branchesRes.data.branches);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching data",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, productId) => {
    const product = products.find(p => p._id === productId);
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, product: productId, name: product?.name || '', sku: product?.sku || '', price: product?.price || 0 }
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

  const handleConfirmDispatch = async () => {
    if (!dispatchData.branch || !dispatchData.method) {
      toast({
        title: "Missing Information",
        description: "Please select branch and transport method.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (items.some(item => !item.product)) {
      toast({
        title: "Invalid Items",
        description: "Please select a product for all rows.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/dispatches', {
        ...dispatchData,
        items,
        totalItems,
        totalValue
      });
      
      toast({
        title: "Dispatch Successful",
        description: "Stock has been dispatched to the branch.",
        status: "success",
        duration: 3000,
      });
      navigate('/total-dispatch-stock');
    } catch (error) {
      toast({
        title: "Dispatch Failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
      });
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
                  <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">Target Branch</FormLabel>
                  <Select 
                    placeholder="Choose branch" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="white" 
                    border="1px solid"
                    borderColor="gray.200" 
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    fontWeight="700"
                    value={dispatchData.branch}
                    onChange={(e) => setDispatchData({...dispatchData, branch: e.target.value})}
                  >
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name} ({b.branchId})</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">Dispatch Date</FormLabel>
                  <Input 
                    type="date" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="white" 
                    border="1px solid"
                    borderColor="gray.200" 
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    fontWeight="700"
                    value={dispatchData.date}
                    onChange={(e) => setDispatchData({...dispatchData, date: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">Transport Method</FormLabel>
                  <Select 
                    h="50px" 
                    borderRadius="xl" 
                    bg="white" 
                    border="1px solid"
                    borderColor="gray.200" 
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    fontWeight="700"
                    value={dispatchData.method}
                    onChange={(e) => setDispatchData({...dispatchData, method: e.target.value})}
                  >
                    <option value="Company Truck">Company Truck (Fast)</option>
                    <option value="Standard Delivery">Standard Delivery</option>
                    <option value="Urgent Air Freight">Urgent Air Freight</option>
                    <option value="Third Party Logistics">Third Party Logistics</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">Tracking Reference</FormLabel>
                  <Input 
                    placeholder="e.g. BATCH-2024-X" 
                    h="50px" 
                    borderRadius="xl" 
                    bg="white" 
                    border="1px solid"
                    borderColor="gray.200" 
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    fontWeight="700"
                    value={dispatchData.reference}
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
                            size="sm"
                            h="38px"
                            borderRadius="lg"
                            bg="white"
                            border="1px solid"
                            borderColor="gray.100"
                            fontWeight="700" 
                            value={item.product}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </Select>
                        </Td>
                        <Td borderColor="gray.100"><Text fontSize="xs" color="gray.400" fontWeight="700">{item.sku || '---'}</Text></Td>
                        <Td borderColor="gray.100">
                          <Input 
                            type="number" 
                            size="sm" 
                            h="38px"
                            borderRadius="lg" 
                            bg="white" 
                            border="1px solid"
                            borderColor="gray.100" 
                            fontWeight="800"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </Td>
                        <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="700">₹{item.price}</Text></Td>
                        <Td borderColor="gray.100" textAlign="right">
                           <Text fontWeight="900" color="secondary">₹{(item.qty * item.price).toLocaleString()}</Text>
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
                          <Text fontSize="lg" fontWeight="900" color="brand.500">₹{totalValue.toLocaleString()}</Text>
                       </VStack>
                    </HStack>
                    <Button 
                      colorScheme="brand" 
                      leftIcon={<Save size={20} />} 
                      px="10" 
                      h="55px" 
                      borderRadius="2xl" 
                      shadow="0 10px 20px -5px rgba(41, 138, 198, 0.4)"
                      onClick={handleConfirmDispatch}
                      isLoading={submitting}
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
