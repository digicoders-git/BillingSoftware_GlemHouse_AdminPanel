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
  Badge,
  InputGroup,
  InputRightAddon
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

const DeepoBilling = ({ isGst }) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0 }
  ]);

  const [dispatchData, setDispatchData] = useState({
    receiverId: '',
    receiverType: 'Branch',
    date: new Date().toISOString().split('T')[0],
    method: 'Company Truck',
    reference: '',
    gstRate: isGst ? 18 : 0
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
    setItems([...items, { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0 }]);
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
            price: product?.price || 0,
            total: (product?.price || 0) * item.qty
          }
        : item
    ));
  };

  const handleQtyChange = (id, qty) => {
    const q = parseInt(qty) || 0;
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: q, total: q * item.price } : item
    ));
  };

  const handlePriceChange = (id, price) => {
    const p = parseFloat(price) || 0;
    setItems(items.map(item => 
      item.id === id ? { ...item, price: p, total: p * item.qty } : item
    ));
  };

  const taxableAmount = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = isGst ? (taxableAmount * dispatchData.gstRate) / 100 : 0;
  const totalAmount = taxableAmount + gstAmount;
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const handleConfirmBilling = async () => {
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

    setSubmitting(true);
    try {
      const response = await API.post('/dispatches', {
        ...dispatchData,
        items,
        totalItems,
        taxableAmount,
        gstAmount,
        totalAmount,
        billingType: isGst ? 'With GST' : 'Without GST'
      });
      
      toast({
        title: "Billing Successful",
        description: `Invoice ${response.data.invoiceNo} generated.`,
        status: "success",
        duration: 3000,
      });
      
      // Navigate to summary/invoice view
      navigate(`/dispatch-summary/${response.data._id}`);
    } catch (error) {
      toast({
        title: "Billing Failed",
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
                Depot Billing {isGst ? '(With GST)' : '(Without GST)'}
            </Heading>
            <Text color="gray.500" fontWeight="500">Create official invoice and dispatch record for Depot</Text>
          </Box>
          <HStack spacing="3">
             <Button leftIcon={<Printer size={18} />} variant="outline" borderRadius="xl">Save as Draft</Button>
             <Badge colorScheme={isGst ? "green" : "orange"} p="2" borderRadius="lg" fontSize="10px">
                MODE: {isGst ? "GST BILLING" : "NON-GST BILLING"}
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
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Billing Date</FormLabel>
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
                        <HStack><Truck size={14} /><Text>Transport & Tax</Text></HStack>
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

                        {isGst && (
                            <FormControl isRequired>
                                <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">GST Rate (%)</FormLabel>
                                <InputGroup size="md">
                                    <Input 
                                        type="number" 
                                        h="45px" 
                                        borderRadius="lg" 
                                        fontWeight="700"
                                        value={dispatchData.gstRate}
                                        onChange={(e) => setDispatchData({...dispatchData, gstRate: parseFloat(e.target.value) || 0})}
                                    />
                                    <InputRightAddon children="%" h="45px" borderRadius="lg" />
                                </InputGroup>
                            </FormControl>
                        )}
                    </VStack>
                </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 4, lg: 3 }}>
            <Box className="premium-card" p="0" overflow="hidden">
              <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50">
                 <VStack align="start" spacing="0">
                    <Heading size="sm" color="secondary">Item Particulars</Heading>
                    <Text fontSize="xs" color="gray.400">Add products and quantities for this bill</Text>
                 </VStack>
                 <Button leftIcon={<Plus size={18} />} variant="solid" colorScheme="brand" borderRadius="lg" size="sm" onClick={handleAddItem}>
                    Add Line
                 </Button>
              </Flex>
              
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="gray.50/50">
                    <Tr>
                      <Th color="gray.500" border="none" py="4" fontSize="10px">Description</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" w="120px">Quantity</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" w="150px">Unit Price</Th>
                      <Th color="gray.500" border="none" py="4" fontSize="10px" textAlign="right">Taxable Value</Th>
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
                              <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                            ))}
                          </Select>
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
                            <Input 
                                type="number" 
                                size="sm" 
                                h="40px"
                                borderRadius="lg" 
                                fontWeight="800"
                                value={item.price}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            />
                        </Td>
                        <Td textAlign="right">
                           <Text fontWeight="900" color="secondary">₹{item.total.toLocaleString()}</Text>
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
                                <Text fontSize="sm" color="gray.600" mt="1">Total items being dispatched: <b>{totalItems} Units</b></Text>
                            </Box>
                            <Divider />
                            <Box w="full" bg="white" p="4" borderRadius="xl" border="1px dashed" borderColor="gray.200">
                                <Text fontSize="10px" fontWeight="800" color="brand.500" mb="2">TRACKING PREVIEW</Text>
                                <Text fontSize="xs" color="gray.500">Unique tracking code and Invoice No will be generated automatically upon confirmation.</Text>
                            </Box>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <VStack spacing="3" align="stretch">
                            <Flex justify="space-between">
                                <Text color="gray.500" fontWeight="600">Taxable Subtotal</Text>
                                <Text fontWeight="700">₹{taxableAmount.toLocaleString()}</Text>
                            </Flex>
                            {isGst && (
                                <Flex justify="space-between">
                                    <Text color="gray.500" fontWeight="600">GST ({dispatchData.gstRate}%)</Text>
                                    <Text fontWeight="700" color="orange.500">₹{gstAmount.toLocaleString()}</Text>
                                </Flex>
                            )}
                            <Divider borderColor="gray.300" />
                            <Flex justify="space-between" pt="2">
                                <Text fontSize="lg" fontWeight="900" color="secondary">Grand Total</Text>
                                <Text fontSize="xl" fontWeight="900" color="brand.500">₹{totalAmount.toLocaleString()}</Text>
                            </Flex>
                            
                            <Button 
                                colorScheme="brand" 
                                leftIcon={<Save size={20} />} 
                                w="full"
                                mt="6"
                                h="55px" 
                                borderRadius="xl" 
                                onClick={handleConfirmBilling}
                                isLoading={submitting}
                            >
                                Confirm & Generate Invoice
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

export default DeepoBilling;
