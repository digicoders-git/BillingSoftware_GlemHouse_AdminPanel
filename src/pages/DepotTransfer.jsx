import { useState, useEffect } from 'react';
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
  Spinner,
  Divider,
  Badge
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer,
  ChevronLeft,
  Truck
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const DepotTransfer = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0, expiryDate: '' }
  ]);

  const [dispatchData, setDispatchData] = useState({
    receiverId: '',
    receiverType: 'Branch',
    date: new Date().toISOString().split('T')[0],
    method: 'Company Truck',
    reference: '',
    gstRate: 0
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
        API.get('/Branches'),
        API.get('/products')
      ]);
      setBranches(branchesRes.data.Branches || []);
      setProducts(productsRes.data || []);
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
    setItems([...items, { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0, expiryDate: '' }]);
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
        ? { 
            ...item, 
            product: productId, 
            name: product?.name || '', 
            sku: product?.sku || '', 
            price: 0,
            total: 0,
            expiryDate: product?.expiry || ''
          }
        : item
    ));
  };

  const handleQtyChange = (id, qty) => {
    const q = parseInt(qty) || 0;
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: q, total: 0 } : item
    ));
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const handleConfirmTransfer = async () => {
    if (!dispatchData.receiverId) {
      toast({
        title: "Missing Information",
        description: "Please select a Depot.",
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

    if (totalItems <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please add valid product quantities.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Verify Stock First
    for (const item of items) {
      const product = products.find(p => p._id === item.product);
      if (!product) continue;
      const qtyNum = Number(item.qty) || 0;
      if (qtyNum <= 0) {
        toast({
          title: "Invalid Quantity",
          description: `Quantity for "${product.name}" must be greater than zero.`,
          status: "error",
          duration: 3000,
        });
        return;
      }
      if (qtyNum > product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Product "${product.name}" only has ${product.stock} units available in Central Warehouse stock. You entered ${qtyNum}.`,
          status: "error",
          duration: 4000,
          isClosable: true
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await API.post('/dispatches', {
        ...dispatchData,
        items,
        totalItems,
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        billingType: 'Transfer'
      });
      
      toast({
        title: "Transfer Successful",
        description: `Transfer Ref: ${response.data.invoiceNo} generated.`,
        status: "success",
        duration: 3000,
      });
      
      // Navigate to summary/invoice view
      navigate(`/dispatch-summary/${response.data._id}`);
    } catch (error) {
      toast({
        title: "Transfer Failed",
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
               <ChevronLeft size={18} />
               <Text fontSize="sm" fontWeight="700">Back</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">
                Depot Stock Transfer
            </Heading>
            <Text color="gray.500" fontWeight="500">Record a stock transfer to Depot (No Billing/GST)</Text>
          </Box>
          <HStack spacing="3">
             <Badge colorScheme="blue" p="2" borderRadius="lg" fontSize="10px">
                MODE: STOCK TRANSFER
             </Badge>
          </HStack>
        </Flex>
 
        <Grid templateColumns={{ base: "1fr", lg: "repeat(4, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 4, lg: 1 }}>
            <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6">
                    <Heading size="xs" mb="6" color="secondary" borderBottom="1px solid" borderColor="gray.100" pb="3">
                        <HStack><Truck size={14} /><Text>Depot Details</Text></HStack>
                    </Heading>
                    <VStack spacing="5" align="stretch">
                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Target Depot</FormLabel>
                            <Select 
                                placeholder="Choose Depot" 
                                h="45px" 
                                borderRadius="lg" 
                                fontWeight="700"
                                value={dispatchData.receiverId}
                                onChange={(e) => setDispatchData({...dispatchData, receiverId: e.target.value})}
                            >
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name} ({b.branchId})</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Transfer Date</FormLabel>
                            <Input 
                                type="date" 
                                h="45px" 
                                borderRadius="lg" 
                                fontWeight="700"
                                value={dispatchData.date}
                                onChange={(e) => setDispatchData({...dispatchData, date: e.target.value})}
                            />
                        </FormControl>
                    </VStack>
                </Box>

                <Box className="premium-card" p="6">
                    <Heading size="xs" mb="6" color="secondary" borderBottom="1px solid" borderColor="gray.100" pb="3">
                        <HStack><Truck size={14} /><Text>Transport Method</Text></HStack>
                    </Heading>
                    <VStack spacing="5" align="stretch">
                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Dispatch Method</FormLabel>
                            <Select 
                                h="45px" 
                                borderRadius="lg" 
                                fontWeight="700"
                                value={dispatchData.method}
                                onChange={(e) => setDispatchData({...dispatchData, method: e.target.value})}
                            >
                                <option value="Company Truck">Company Truck (Fast)</option>
                                <option value="Standard Delivery">Standard Delivery</option>
                                <option value="Urgent Air Freight">Urgent Air Freight</option>
                                <option value="Third Party Logistics">Third Party Logistics</option>
                                <option value="Self Pickup">Self Pickup</option>
                            </Select>
                        </FormControl>
                    </VStack>
                </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 4, lg: 3 }}>
            <Box className="premium-card" p="0" overflow="hidden">
              <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50">
                 <VStack align="start" spacing="0">
                    <Heading size="sm" color="secondary">Item Particulars</Heading>
                    <Text fontSize="xs" color="gray.400">Add products and quantities for this transfer</Text>
                 </VStack>
                 <Button leftIcon={<Plus size={18} />} variant="solid" colorScheme="brand" borderRadius="lg" size="sm" onClick={handleAddItem}>
                    Add Line
                 </Button>
              </Flex>
              
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="gray.50/50">
                    <Tr>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" minW="200px">Description</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" w="130px">Expiry (Optional)</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" w="150px">Quantity Transferring</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }}>
                        <Td py="4">
                          <Select 
                            placeholder="Select product" 
                            size="sm"
                            h="40px"
                            borderRadius="lg"
                            fontWeight="600" 
                            value={item.product}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.name} ({p.sku}) — Stock: {p.stock || 0}</option>
                            ))}
                          </Select>
                        </Td>
                        <Td>
                          <Input
                            type="text"
                            size="sm"
                            h="40px"
                            borderRadius="lg"
                            fontWeight="700"
                            value={item.expiryDate || ''}
                            onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, expiryDate: e.target.value } : i))}
                            placeholder="MM/YYYY (optional)"
                          />
                        </Td>
                        <Td>
                          <Input 
                            type="number" 
                            size="sm" 
                            h="40px"
                            borderRadius="lg" 
                            fontWeight="800"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </Td>
                        <Td>
                          <IconButton 
                            aria-label="Delete" 
                            icon={<Trash2 size={16} />} 
                            size="sm" 
                            variant="ghost" 
                            color="red.300" 
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box p="8" borderTop="1px solid" borderColor="gray.100" bg="gray.50/30">
                 <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="10">
                    <GridItem>
                        <VStack align="start" spacing="4">
                            <Box>
                                <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Consignment Summary</Text>
                                <Text fontSize="sm" color="gray.600" mt="1">Total items being transferred: <b>{totalItems} Units</b></Text>
                            </Box>
                            <Divider />
                            <Box w="full" bg="white" p="4" borderRadius="xl" border="1px dashed" borderColor="gray.200">
                                <Text fontSize="10px" fontWeight="800" color="brand.500" mb="2">TRACKING PREVIEW</Text>
                                <Text fontSize="xs" color="gray.500">Unique tracking code will be generated automatically upon confirmation.</Text>
                            </Box>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <VStack spacing="3" align="stretch" justify="center" h="full">
                            <Button 
                                colorScheme="brand" 
                                leftIcon={<Save size={20} />} 
                                w="full"
                                h="55px" 
                                borderRadius="xl" 
                                onClick={handleConfirmTransfer}
                                isLoading={submitting}
                            >
                                Confirm Transfer
                            </Button>
                        </VStack>
                    </GridItem>
                 </Grid>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DepotTransfer;
