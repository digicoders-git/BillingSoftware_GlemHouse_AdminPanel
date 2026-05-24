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
  ChevronLeft,
  Printer,
  Truck,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../utils/api';

const BranchDispatchToSales = ({ isGst: propIsGst }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const isGst = propIsGst ?? location.pathname.includes('gst');

  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0, maxStock: 0 }
  ]);

  const [dispatchData, setDispatchData] = useState({
    receiverId: '',
    receiverType: 'SalesRep',
    date: new Date().toISOString().split('T')[0],
    method: 'Local Delivery',
    reference: '',
    gstRate: isGst ? 18 : 0
  });

  const [salesReps, setSalesReps] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, inventoryRes] = await Promise.all([
        API.get('/sales?status=Active'),
        API.get('/branch-inventory')
      ]);
      setSalesReps(salesRes.data.sales || []);
      setInventory(inventoryRes.data.inventory || []);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching data", status: "error" });
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), product: '', name: '', sku: '', qty: 1, price: 0, total: 0, maxStock: 0 }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, productId) => {
    const invItem = inventory.find(i => i.productID === productId);
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            product: productId, 
            name: invItem?.name || '', 
            sku: invItem?.sku || '', 
            price: invItem?.price || 0,
            total: (invItem?.price || 0) * item.qty,
            maxStock: invItem?.stock || 0
          }
        : item
    ));
  };

  const handleQtyChange = (id, qty) => {
    const q = parseInt(qty) || 0;
    setItems(items.map(item => {
        if (item.id === id) {
            if (q > item.maxStock) {
                toast({ title: `Only ${item.maxStock} units in stock`, status: "warning", duration: 2000 });
            }
            const validQty = Math.min(q, item.maxStock);
            return { ...item, qty: validQty, total: validQty * item.price };
        }
        return item;
    }));
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
      return toast({ title: "Select a Super Stoklist Representative", status: "error" });
    }
    if (items.some(item => !item.product || item.qty <= 0)) {
      return toast({ title: "Invalid items or quantities", status: "error" });
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
        title: "Dispatch Created",
        description: `Invoice ${response.data.invoiceNo} generated for Super Stoklist Rep.`,
        status: "success",
      });
      
      navigate(`/branch/dispatch-summary/${response.data._id}`);
    } catch (error) {
      toast({
        title: "Dispatch Failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
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
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <HStack spacing="3" mb="2" cursor="pointer" onClick={() => navigate(-1)} _hover={{ color: 'brand.500' }}>
               <ChevronLeft size={18} />
               <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Back to Dashboard</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">
               {isGst ? 'GST Dispatch Console' : 'Stock Transfer (Non-GST)'}
            </Heading>
            <Text color="gray.500" fontWeight="500" fontSize="sm">Move inventory from depot storage to Super Stoklist representative shelf</Text>
          </Box>
          <HStack spacing="3">
             <Badge colorScheme={isGst ? "green" : "orange"} px="4" py="2" borderRadius="xl" fontSize="11px" shadow="sm" border="1px solid" borderColor={`${isGst ? 'green' : 'orange'}.100`}>
                MODE: {isGst ? "OFFICIAL GST" : "INTERNAL TRANSFER"}
             </Badge>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(4, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 4, lg: 1 }}>
            <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6" border="1px solid" borderColor="gray.100">
                    <Heading size="xs" mb="6" color="secondary" borderBottom="1px solid" borderColor="gray.100" pb="4" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
                        <HStack spacing="3"><Box p="1.5" bg="blue.50" color="blue.500" borderRadius="lg"><UserIcon size={14} /></Box><Text>Recipient Details</Text></HStack>
                    </Heading>
                    <VStack spacing="5" align="stretch">
                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.400">SELECT SUPER STOKLIST REP</FormLabel>
                            <Select 
                                placeholder="Choose Partner" 
                                h="48px" 
                                variant="filled"
                                borderRadius="xl" 
                                fontWeight="700"
                                bg="gray.50"
                                value={dispatchData.receiverId}
                                onChange={(e) => setDispatchData({...dispatchData, receiverId: e.target.value})}
                            >
                                {salesReps.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} ({s.salesId})</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.400">TRANSFER DATE</FormLabel>
                            <Input 
                                type="date" 
                                h="48px" 
                                variant="filled"
                                borderRadius="xl" 
                                fontWeight="700"
                                bg="gray.50"
                                value={dispatchData.date}
                                onChange={(e) => setDispatchData({...dispatchData, date: e.target.value})}
                            />
                        </FormControl>
                    </VStack>
                </Box>

                <Box className="premium-card" p="6" border="1px solid" borderColor="gray.100">
                    <Heading size="xs" mb="6" color="secondary" borderBottom="1px solid" borderColor="gray.100" pb="4" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
                        <HStack spacing="3"><Box p="1.5" bg="purple.50" color="purple.500" borderRadius="lg"><Truck size={14} /></Box><Text>Logistic Info</Text></HStack>
                    </Heading>
                    <VStack spacing="5" align="stretch">
                        <FormControl isRequired>
                            <FormLabel fontSize="10px" fontWeight="800" color="gray.400">DELIVERY METHOD</FormLabel>
                            <Select 
                                h="48px" 
                                variant="filled"
                                borderRadius="xl" 
                                fontWeight="700"
                                bg="gray.50"
                                value={dispatchData.method}
                                onChange={(e) => setDispatchData({...dispatchData, method: e.target.value})}
                            >
                                <option value="Local Delivery">Local Van / Truck</option>
                                <option value="Self Collected">Self Collected</option>
                                <option value="Courier">Courier Service</option>
                            </Select>
                        </FormControl>

                        {isGst && (
                            <FormControl isRequired>
                                <FormLabel fontSize="10px" fontWeight="800" color="gray.400">GST PERCENTAGE (%)</FormLabel>
                                <InputGroup size="md">
                                    <Input 
                                        type="number" 
                                        h="48px" 
                                        variant="filled"
                                        borderRadius="xl" 
                                        fontWeight="900"
                                        bg="gray.50"
                                        value={dispatchData.gstRate}
                                        onChange={(e) => setDispatchData({...dispatchData, gstRate: parseFloat(e.target.value) || 0})}
                                    />
                                    <InputRightAddon children="%" h="48px" borderRadius="xl" fontWeight="900" />
                                </InputGroup>
                            </FormControl>
                        )}
                    </VStack>
                </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 4, lg: 3 }}>
            <Box className="premium-card" p="0" overflow="hidden" border="1px solid" borderColor="gray.100">
              <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/30">
                 <HStack spacing="3">
                    <Box p="2.5" bg="brand.50" color="brand.500" borderRadius="xl" shadow="sm"><ShoppingBag size={20} /></Box>
                    <VStack align="start" spacing="0">
                        <Heading size="sm" color="secondary" fontWeight="800">Consignment Items</Heading>
                        <Text fontSize="xs" color="gray.400">Items will be deducted from depot inventory</Text>
                    </VStack>
                 </HStack>
                 <Button 
                    leftIcon={<Plus size={18} />} 
                    variant="solid" 
                    colorScheme="brand" 
                    borderRadius="xl" 
                    size="sm" 
                    px="6"
                    fontWeight="800"
                    onClick={handleAddItem}
                    boxShadow="0 4px 12px rgba(41, 138, 198, 0.2)"
                 >
                    Add Product
                 </Button>
              </Flex>
              
              <Box overflowX="auto" p="2">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" letterSpacing="1px">DESCRIPTION</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" letterSpacing="1px" w="100px" textAlign="center">QTY</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" letterSpacing="1px" w="140px">UNIT PRICE</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" letterSpacing="1px" textAlign="right">SUBTOTAL</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" w="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }} transition="0.2s">
                        <Td py="4">
                          <Select 
                            placeholder="Select product..." 
                            size="sm"
                            h="45px"
                            variant="filled"
                            borderRadius="xl"
                            fontWeight="700" 
                            bg="gray.50"
                            value={item.product}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {inventory.map(inv => (
                              <option key={inv._id} value={inv.productID || inv.product}>
                                {inv.name} ({inv.sku || inv.product?.sku}) — {inv.stock} in stock
                              </option>
                            ))}
                          </Select>
                        </Td>
                        <Td>
                          <Input 
                            type="number" 
                            size="sm" 
                            h="45px"
                            variant="filled"
                            borderRadius="xl" 
                            fontWeight="900"
                            bg="gray.50"
                            textAlign="center"
                            max={item.maxStock}
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </Td>
                        <Td>
                            <Input 
                                type="number" 
                                size="sm" 
                                h="45px"
                                variant="filled"
                                borderRadius="xl" 
                                fontWeight="900"
                                bg="gray.50"
                                value={item.price}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            />
                        </Td>
                        <Td textAlign="right">
                           <Text fontWeight="900" color="secondary" fontSize="md">₹{item.total.toLocaleString()}</Text>
                        </Td>
                        <Td>
                          <IconButton 
                            aria-label="Delete" 
                            icon={<Trash2 size={16} />} 
                            size="sm" 
                            variant="ghost" 
                            colorScheme="red" 
                            borderRadius="full"
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box p="8" borderTop="1px solid" borderColor="gray.100" bg="gray.50/20">
                 <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="10">
                    <GridItem>
                        <VStack align="start" spacing="4">
                            <Box>
                                <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Consignment Summary</Text>
                                <Text fontSize="sm" color="gray.600" mt="2" fontWeight="600">Total units to be dispatched: <Badge colorScheme="blue" borderRadius="full" px="3" ml="2">{totalItems} Units</Badge></Text>
                            </Box>
                            <Box w="full" bg="white" p="5" borderRadius="2xl" border="1px dashed" borderColor="gray.200" shadow="sm">
                                <HStack mb="2"><Box p="1" bg="orange.50" color="orange.500" borderRadius="md"><Truck size={12}/></Box><Text fontSize="10px" fontWeight="900" color="orange.600">INVENTORY SYNC</Text></HStack>
                                <Text fontSize="xs" color="gray.500" fontWeight="500">Stock will be deducted from depot and added to Super Stoklist Rep shelf upon their confirmation.</Text>
                            </Box>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <VStack spacing="4" align="stretch" bg="white" p="6" borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.50">
                            <Flex justify="space-between">
                                <Text color="gray.500" fontWeight="700" fontSize="sm">Taxable Subtotal</Text>
                                <Text fontWeight="800" fontSize="sm">₹{taxableAmount.toLocaleString()}</Text>
                            </Flex>
                            {isGst && (
                                <Flex justify="space-between">
                                    <Text color="gray.500" fontWeight="700" fontSize="sm">GST ({dispatchData.gstRate}%)</Text>
                                    <Text fontWeight="800" color="orange.500" fontSize="sm">₹{gstAmount.toLocaleString()}</Text>
                                </Flex>
                            )}
                            <Divider borderColor="gray.100" />
                            <Flex justify="space-between" align="center">
                                <Text fontSize="md" fontWeight="900" color="secondary">Total Value</Text>
                                <Text fontSize="2xl" fontWeight="900" color="brand.500" letterSpacing="-1px">₹{totalAmount.toLocaleString()}</Text>
                            </Flex>
                            
                            <Button 
                                colorScheme="brand" 
                                leftIcon={<Save size={20} />} 
                                w="full"
                                mt="4"
                                h="60px" 
                                borderRadius="2xl" 
                                fontWeight="900"
                                onClick={handleConfirmBilling}
                                isLoading={submitting}
                                shadow="xl"
                                _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
                                _active={{ transform: 'translateY(0)' }}
                            >
                                Confirm & Dispatch Stock
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

export default BranchDispatchToSales;
