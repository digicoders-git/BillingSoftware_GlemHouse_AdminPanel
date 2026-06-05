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
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  IconButton, 
  VStack, 
  Divider,
  HStack,
  Select,
  useToast,
  Spinner,
  Badge,
  Switch
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash, 
  Printer, 
  Download, 
  Save, 
  User,
  ShoppingBag,
  ChevronLeft
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { pdfTemplate } from '../../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../../utils/downloadInvoice';

const SalesRepNewInvoice = ({ isGst: propIsGst }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isGst, setIsGst] = useState(propIsGst ?? false);
  
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0, expiryDate: '', hsn: '', batch: '' }
  ]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get('/branch-inventory'); // Superstockist role gets their own stock
      setInventory(data.inventory || []);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to load my shelf inventory", status: "error" });
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0, expiryDate: '', hsn: '', batch: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, productId) => {
    const selectedProduct = inventory.find(inv => 
      inv.productID === productId || 
      inv._id === productId || 
      inv.product === productId
    );
    
    if (selectedProduct) {
      setItems(items.map(item => {
        if (item.id === id) {
          const qty = 1;
          const price = selectedProduct.price || 0;
          return {
            ...item,
            product: selectedProduct._id,
            name: selectedProduct.name,
            price: price,
            qty: qty,
            total: qty * price,
            maxStock: selectedProduct.stock || 0,
            expiryDate: selectedProduct.product?.expiry || selectedProduct.expiry || '',
            hsn: selectedProduct.product?.hsn || selectedProduct.hsn || '',
            batch: selectedProduct.product?.batch || selectedProduct.batch || ''
          };
        }
        return item;
      }));
    }
  };

  const handleQtyChange = (id, qty) => {
    const q = parseInt(qty) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        const validQty = Math.min(q, item.maxStock);
        if (q > item.maxStock) toast({ title: `Only ${item.maxStock} in stock`, status: "warning" });
        return { ...item, qty: validQty, total: validQty * item.price };
      }
      return item;
    }));
  };

  const taxableAmount = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = isGst ? (taxableAmount * gstRate) / 100 : 0;
  const totalAmount = taxableAmount + gstAmount - discount;

  const handleCompleteTransaction = async () => {
    if (!customerDetails.name) return toast({ title: "Customer name required", status: "error" });
    const validItems = items.filter(i => i.product && i.qty > 0);
    if (validItems.length === 0) return toast({ title: "Add products", status: "error" });

    // Strict Stock Validation
    for (const item of validItems) {
      const qtyNum = Number(item.qty) || 0;
      if (qtyNum > item.maxStock) {
        return toast({ 
          title: `Insufficient Stock for ${item.name}`, 
          description: `Only ${item.maxStock} units available in your shelf inventory. You entered ${qtyNum}.`,
          status: "error",
          duration: 4000,
          isClosable: true
        });
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        paymentMethod: customerDetails.paymentMethod,
        notes: customerDetails.notes,
        items: validItems.map(i => ({
          product: i.product,
          name: i.name,
          qty: i.qty,
          price: i.price,
          total: i.total,
          expiryDate: i.expiryDate || '',
          hsn: i.hsn || '',
          batch: i.batch || ''
        })),
        billingType: isGst ? 'With GST' : 'Without GST',
        gstRate: isGst ? gstRate : 0,
        taxableAmount,
        gstAmount,
        discount,
        totalAmount
      };

      const { data: newSale } = await API.post('/branch-sales', payload);
      
      toast({ title: "Sale Completed!", status: "success" });

      const billData = {
        billNo: newSale.invoiceId,
        clientName: customerDetails.name,
        clientPhone: customerDetails.phone,
        items: payload.items,
        subTotal: taxableAmount,
        totalTax: gstAmount,
        taxPercentage: isGst ? gstRate : 0,
        totalAmount: totalAmount,
        isGstEnabled: isGst,
        createdAt: newSale.createdAt
      };
      
      const html = pdfTemplate(billData);
      await downloadInvoiceAsJpg(html, `Bill_${newSale.invoiceId}.jpg`);
      navigate('/sales/history');
    } catch (error) {
      toast({ title: "Transaction Failed", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Layout><Flex justify="center" align="center" h="70vh"><Spinner size="xl" color="brand.500" /></Flex></Layout>;
  }

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <HStack spacing="3" mb="2" cursor="pointer" onClick={() => navigate(-1)} _hover={{ color: 'brand.500' }}>
               <ChevronLeft size={18} />
               <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Back to Records</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">
               {isGst ? 'New GST Invoice' : 'Standard Bill'}
            </Heading>
            <Text color="gray.500" fontWeight="500" fontSize="sm">Generate a professional receipt for your field Superstockist</Text>
          </Box>
          <HStack spacing="4" bg="white" p="2" borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.50">
             <Box px="4" py="2" borderRight="1px solid" borderColor="gray.100">
                <Text fontSize="10px" fontWeight="800" color="gray.400" mb="1">BILLING MODE</Text>
                <Badge colorScheme={isGst ? "green" : "orange"} variant="subtle" borderRadius="md" px="3" py="0.5" fontSize="10px">
                   {isGst ? "GST ENABLED" : "NON-GST"}
                </Badge>
             </Box>
             <FormControl display="flex" alignItems="center" px="2">
                <Switch colorScheme="brand" isChecked={isGst} onChange={() => setIsGst(!isGst)} size="md" />
             </FormControl>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="0" overflow="hidden" border="1px solid" borderColor="gray.100">
              <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/30">
                 <HStack spacing="3">
                    <Box p="2.5" bg="brand.50" borderRadius="xl" color="brand.500 shadow-sm"><ShoppingBag size={20} /></Box>
                    <VStack align="start" spacing="0">
                        <Heading size="sm" color="secondary" fontWeight="800">Product Particulars</Heading>
                        <Text fontSize="xs" color="gray.400">Select items from your current shelf stock</Text>
                    </VStack>
                 </HStack>
                 <Button 
                    leftIcon={<Plus size={16} />} 
                    variant="solid" 
                    colorScheme="brand" 
                    size="sm" 
                    borderRadius="xl" 
                    onClick={addItem}
                    px="6"
                    fontWeight="800"
                    boxShadow="0 4px 12px rgba(41, 138, 198, 0.2)"
                 >
                    Add Product
                 </Button>
              </Flex>
              
              <Box overflowX="auto" p="2">
                <Table variant="simple" size="sm" minW="750px">
                  <Thead>
                     <Tr>
                       <Th py="4" color="gray.400" fontSize="10px" letterSpacing="1px" minW="220px">ITEM DESCRIPTION</Th>
                       <Th py="4" color="gray.400" fontSize="10px" letterSpacing="1px" w="140px">EXPIRY (OPTIONAL)</Th>
                       <Th py="4" color="gray.400" fontSize="10px" letterSpacing="1px" w="110px" textAlign="center">QUANTITY</Th>
                       <Th py="4" color="gray.400" fontSize="10px" letterSpacing="1px" w="120px">UNIT PRICE</Th>
                       <Th py="4" color="gray.400" fontSize="10px" letterSpacing="1px" textAlign="right" w="100px">TOTAL</Th>
                       <Th py="4" w="50px"></Th>
                     </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }} transition="0.2s">
                        <Td py="4">
                          <Select 
                            placeholder="Select from shelf..." 
                            variant="filled" 
                            size="sm"
                            h="45px"
                            borderRadius="xl" 
                            fontWeight="700"
                            bg="gray.50"
                            _focus={{ bg: 'white', borderColor: 'brand.300' }}
                            value={item.product || ''}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {inventory.map(inv => (
                              <option 
                                key={inv._id} 
                                value={inv._id} 
                              >
                                {inv.name} ({inv.sku}) — {inv.stock} available
                              </option>
                            ))}
                          </Select>
                        </Td>
                        <Td>
                          <Input
                            type="text"
                            value={item.expiryDate || ''}
                            onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, expiryDate: e.target.value } : i))}
                            variant="filled"
                            borderRadius="xl"
                            h="45px"
                            fontWeight="700"
                            bg="gray.50"
                            fontSize="sm"
                            placeholder="MM/YYYY (optional)"
                          />
                        </Td>
                        <Td>
                          <Input 
                            type="number" 
                            value={item.qty} 
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            variant="filled" 
                            borderRadius="xl" 
                            h="45px" 
                            fontWeight="900"
                            textAlign="center"
                            bg="gray.50"
                          />
                        </Td>
                        <Td>
                          <Input 
                            type="number" 
                            value={item.price}
                            isReadOnly
                            variant="filled" 
                            borderRadius="xl" 
                            h="45px" 
                            fontWeight="900"
                            bg="gray.50/50"
                            color="gray.500"
                          />
                        </Td>
                        <Td textAlign="right">
                          <Text fontWeight="900" color="secondary" fontSize="md">₹{item.total.toLocaleString()}</Text>
                        </Td>
                        <Td>
                          <IconButton 
                            icon={<Trash size={16} />} 
                            colorScheme="red" 
                            variant="ghost" 
                            size="sm" 
                            borderRadius="full"
                            onClick={() => removeItem(item.id)}
                            isDisabled={items.length === 1}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Box className="premium-card" p="6" mt="8">
              <Heading size="xs" mb="4" color="gray.400" textTransform="uppercase" letterSpacing="1px" fontWeight="800">Additional Remarks</Heading>
              <Input 
                as="textarea" 
                name="notes"
                value={customerDetails.notes}
                onChange={(e) => setCustomerDetails({...customerDetails, notes: e.target.value})}
                placeholder="Write any special notes or terms here..." 
                h="100px" 
                py="4" 
                variant="filled"
                borderRadius="2xl" 
                fontWeight="600"
                bg="gray.50"
                border="none"
              />
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6" border="1px solid" borderColor="gray.100">
                  <HStack mb="6" spacing="3">
                    <Box p="2.5" bg="blue.50" borderRadius="xl" color="blue.500 shadow-sm"><User size={20} /></Box>
                    <Heading size="sm" color="secondary" fontWeight="800">Customer Info</Heading>
                  </HStack>
                  
                  <VStack spacing="4" align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Customer Name</FormLabel>
                      <Input 
                        placeholder="e.g. Rahul Sharma" 
                        h="48px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="700"
                        bg="gray.50"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Mobile Number</FormLabel>
                      <Input 
                        placeholder="+91 XXXXX XXXXX" 
                        h="48px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="700"
                        bg="gray.50"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Payment Method</FormLabel>
                      <Select 
                        h="48px" 
                        variant="filled"
                        borderRadius="xl"
                        fontWeight="700"
                        bg="gray.50"
                        value={customerDetails.paymentMethod}
                        onChange={(e) => setCustomerDetails({...customerDetails, paymentMethod: e.target.value})}
                      >
                        <option value="Cash">Cash Payment</option>
                        <option value="UPI / QR Code">UPI / QR Code</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Card">Credit/Debit Card</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </Box>

                <Box 
                  className="premium-card" 
                  p="8" 
                  bg="secondary" 
                  color="white" 
                  shadow="2xl" 
                  position="relative" 
                  overflow="hidden"
                >
                  <Box position="absolute" top="-20px" right="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" blur="40px" />
                  
                  <Heading size="xs" mb="8" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="1px" borderBottom="1px solid" borderColor="whiteAlpha.200" pb="4">Order Summary</Heading>
                  <VStack spacing="5" align="stretch">
                    <Flex justify="space-between">
                      <Text color="whiteAlpha.700" fontWeight="600" fontSize="sm">Total Items</Text>
                      <Text fontWeight="800">{items.reduce((sum, i) => sum + Number(i.qty), 0)} Units</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="whiteAlpha.700" fontWeight="600" fontSize="sm">Subtotal</Text>
                      <Text fontWeight="800">₹{taxableAmount.toLocaleString()}</Text>
                    </Flex>
                    
                    {isGst && (
                        <Flex justify="space-between" align="center">
                            <HStack spacing="1">
                                <Text color="whiteAlpha.700" fontWeight="600" fontSize="sm">GST (</Text>
                                <input 
                                    type="number" 
                                    value={gstRate === 0 ? '' : gstRate}
                                    placeholder="0"
                                    onChange={(e) => setGstRate(e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))}
                                    style={{
                                        width: '45px',
                                        height: '24px',
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        borderRadius: '6px',
                                    }}
                                />
                                <Text color="whiteAlpha.700" fontWeight="600" fontSize="sm">%)</Text>
                            </HStack>
                            <Text fontWeight="800" color="brand.300">₹{gstAmount.toLocaleString()}</Text>
                        </Flex>
                    )}

                    <Flex justify="space-between" align="center">
                      <Text color="whiteAlpha.700" fontWeight="600" fontSize="sm">Discount</Text>
                      <HStack>
                         <Text fontSize="xs">₹</Text>
                         <Input 
                            type="number" 
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            size="xs" 
                            w="70px" 
                            bg="whiteAlpha.100"
                            border="none"
                            color="white"
                            textAlign="right"
                            fontWeight="900"
                         />
                      </HStack>
                    </Flex>
                    
                    <Divider borderColor="whiteAlpha.200" my="2" />
                    
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="900" fontSize="md">GRAND TOTAL</Text>
                      <Text fontWeight="900" fontSize="2xl" color="brand.400" letterSpacing="-1px">₹{Math.max(0, totalAmount).toLocaleString()}</Text>
                    </Flex>
                    
                    <Button 
                      colorScheme="brand" 
                      size="lg" 
                      h="65px" 
                      mt="6" 
                      borderRadius="2xl" 
                      leftIcon={<Save size={20} />}
                      onClick={handleCompleteTransaction}
                      isLoading={submitting}
                      fontSize="md"
                      fontWeight="900"
                      boxShadow="0 10px 20px rgba(41, 138, 198, 0.4)"
                      _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
                      _active={{ transform: 'translateY(0)' }}
                    >
                      COMPLETE & PRINT
                    </Button>
                    <Text fontSize="10px" textAlign="center" color="whiteAlpha.500" fontWeight="700">BILL WILL BE DOWNLOADED AUTOMATICALLY</Text>
                  </VStack>
                </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default SalesRepNewInvoice;

