import { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
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
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Avatar
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  User,
  ShoppingBag,
  ChevronLeft,
  Search,
  IndianRupee,
  Smartphone,
  Banknote,
  Minus
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { pdfTemplate } from '../../utils/pdfTemplate';

const DistributorNewInvoice = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inventory, setInventory] = useState([]);
  
  // GST Mode from query or path
  const [isGst, setIsGst] = useState(location.pathname.includes('gst'));
  
  // Invoice State
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0 }
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
      const { data } = await API.get('/distributor-inventory');
      setInventory(data.inventory || []);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to load inventory", status: "error" });
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, productId) => {
    const selectedProduct = inventory.find(inv => (
      inv.productID === productId || 
      inv.product?._id === productId || 
      inv.product === productId || 
      inv._id === productId
    ));
    
    if (selectedProduct) {
      if (items.some(item => item.product === productId && item.id !== id)) {
         toast({ title: "Product already added to list", status: "warning", position: 'top' });
         return;
      }
      
      setItems(items.map(item => {
        if (item.id === id) {
          const qty = 1;
          const price = selectedProduct.product?.price || selectedProduct.price || 0;
          return {
            ...item,
            product: selectedProduct.productID || selectedProduct.product?._id || selectedProduct._id,
            name: selectedProduct.product?.name || selectedProduct.name,
            sku: selectedProduct.product?.sku || selectedProduct.sku,
            price: price,
            qty: qty,
            total: qty * price,
            maxStock: selectedProduct.stock || selectedProduct.currentStock || 0
          };
        }
        return item;
      }));
    }
  };

  const updateQty = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.qty || 0) + change);
        if (newQty > item.maxStock) {
          toast({ title: `Limit: ${item.maxStock} units`, status: "warning", duration: 1000 });
          return item;
        }
        return { ...item, qty: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const handlePriceChange = (id, price) => {
    const p = parseFloat(price) || 0;
    setItems(items.map(item => item.id === id ? { ...item, price: p, total: item.qty * p } : item));
  };

  // Calculations
  const taxableAmount = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = isGst ? (taxableAmount * gstRate) / 100 : 0;
  const totalAmount = taxableAmount + gstAmount - discount;

  const [productSearch, setProductSearch] = useState('');

  const quickAddProduct = (invItem) => {
     if (invItem.stock <= 0) return toast({ title: "Out of Stock", status: "error" });
     
     if (items.some(i => i.product === (invItem.productID || invItem.product?._id || invItem._id))) {
        toast({ title: "Already in cart", status: "info" });
        return;
     }

     const newItem = {
        id: Date.now(),
        product: invItem.productID || invItem.product?._id || invItem._id,
        name: invItem.product?.name || invItem.name,
        sku: invItem.product?.sku || invItem.sku,
        price: invItem.product?.price || invItem.price || 0,
        qty: 1,
        total: invItem.product?.price || invItem.price || 0,
        maxStock: invItem.stock || 0
     };

     // Replace the first empty item if it exists, else append
     if (items.length === 1 && !items[0].product) {
        setItems([newItem]);
     } else {
        setItems([...items, newItem]);
     }
     setProductSearch('');
     toast({ title: "Product Added", status: "success", duration: 1000 });
  };

  const filteredInventory = inventory.filter(inv => 
     inv.name.toLowerCase().includes(productSearch.toLowerCase()) || 
     (inv.sku || inv.product?.sku)?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleComplete = async () => {
    if (!customerDetails.name || !customerDetails.phone) {
      return toast({ title: "Customer Name & Phone required", status: "error", position: 'top' });
    }
    const validItems = items.filter(i => i.product && i.qty > 0);
    if (validItems.length === 0) return toast({ title: "Add products first", status: "warning" });

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
          total: i.total
        })),
        billingType: isGst ? 'With GST' : 'Without GST',
        gstRate: isGst ? gstRate : 0,
        taxableAmount,
        gstAmount,
        discount,
        totalAmount
      };

      const { data: newSale } = await API.post('/branch-sales', payload);
      
      toast({ title: "Sale Recorded Successfully!", status: "success" });

      // Auto Print/Download logic
      const billData = {
        billNo: newSale.invoiceId,
        clientName: customerDetails.name,
        clientPhone: customerDetails.phone,
        clientAddress: customerDetails.notes,
        items: payload.items,
        subTotal: taxableAmount,
        totalTax: gstAmount,
        taxPercentage: isGst ? gstRate : 0,
        totalAmount: totalAmount,
        isGstEnabled: isGst,
        createdAt: newSale.createdAt || new Date().toISOString()
      };
      
      const html = pdfTemplate(billData);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          navigate('/distributor/history');
      };
    } catch (error) {
      toast({ title: "Transaction Failed", description: error.response?.data?.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><Flex justify="center" align="center" h="70vh"><Spinner size="xl" color="brand.500" /></Flex></Layout>;

  return (
    <Layout>
      <Box pb="10">
        {/* Header Section */}
        <Flex justify="space-between" align="center" mb="8">
          <Box>
            <HStack spacing="3" mb="1" onClick={() => navigate(-1)} cursor="pointer" _hover={{ color: 'brand.500' }}>
               <ChevronLeft size={18} />
               <Text fontWeight="800" fontSize="xs" textTransform="uppercase" letterSpacing="1px">Back to Records</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">
               Retail Billing Portal <Text as="span" color="brand.500">{isGst ? '(GST)' : '(Non-GST)'}</Text>
            </Heading>
          </Box>
          <HStack spacing="4">
             <Button 
                variant="ghost" 
                colorScheme={isGst ? "green" : "brand"} 
                onClick={() => setIsGst(!isGst)}
                borderRadius="xl"
                fontSize="sm"
                fontWeight="800"
             >
                Switch to {isGst ? "Non-GST" : "GST"} Mode
             </Button>
          </HStack>
        </Flex>

        <VStack spacing="8" align="stretch">
          {/* Top Section: Cart (Full Width) */}
          <Box className="premium-card" p="0" overflow="hidden" border="1px solid" borderColor="gray.100">
             <Flex p="6" justify="space-between" align="center" bg="gray.50/50" borderBottom="1px solid" borderColor="gray.100">
                <HStack spacing="3" flex="1">
                   <Box p="2.5" bg="brand.50" color="brand.500" borderRadius="xl"><ShoppingBag size={22}/></Box>
                   <Box flex="1">
                      <InputGroup size="sm" maxW="400px">
                         <InputLeftElement pointerEvents="none"><Search size={14}/></InputLeftElement>
                         <Input 
                            placeholder="Scan SKU or Search Product..." 
                            borderRadius="xl" 
                            bg="white"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                         />
                      </InputGroup>
                   </Box>
                </HStack>
                <Button leftIcon={<Plus size={18} />} colorScheme="brand" size="sm" borderRadius="xl" fontWeight="800" onClick={addItem}>New Line</Button>
             </Flex>

             {productSearch && (
                <Box p="2" bg="blue.50" borderBottom="1px solid" borderColor="blue.100" maxH="200px" overflowY="auto">
                   {filteredInventory.length > 0 ? filteredInventory.map(inv => (
                      <Flex 
                         key={inv._id} 
                         p="3" 
                         justify="space-between" 
                         align="center" 
                         cursor="pointer" 
                         _hover={{ bg: 'white' }} 
                         borderRadius="lg"
                         onClick={() => quickAddProduct(inv)}
                      >
                         <HStack>
                            <Avatar size="xs" name={inv.name} bg="brand.500" />
                            <VStack align="start" spacing="0">
                               <Text fontSize="xs" fontWeight="800">{inv.name}</Text>
                               <Text fontSize="10px" color="gray.500">Stock: {inv.stock}</Text>
                            </VStack>
                         </HStack>
                         <Text fontSize="xs" fontWeight="900" color="brand.500">₹{inv.product?.price || inv.price}</Text>
                      </Flex>
                   )) : (
                      <Text p="4" textAlign="center" fontSize="xs" color="gray.400">No products found matching your search</Text>
                   )}
                </Box>
             )}

             <Box p="4">
                <Table variant="simple" size="sm">
                   <Thead>
                      <Tr>
                         <Th color="gray.400" fontSize="10px" py="4">PRODUCT DESCRIPTION</Th>
                         <Th color="gray.400" fontSize="10px" py="4" textAlign="center" w="150px">QUANTITY</Th>
                         <Th color="gray.400" fontSize="10px" py="4" w="140px">UNIT RATE</Th>
                         <Th color="gray.400" fontSize="10px" py="4" textAlign="right">SUBTOTAL</Th>
                         <Th color="gray.400" fontSize="10px" py="4" w="50px"></Th>
                      </Tr>
                   </Thead>
                   <Tbody>
                      {items.map((item) => (
                        <Tr key={item.id} _hover={{ bg: 'gray.50/30' }}>
                           <Td py="4">
                              <Select 
                                 placeholder="Select from Warehouse..." 
                                 variant="filled" 
                                 h="48px" 
                                 borderRadius="xl" 
                                 fontWeight="700"
                                 bg="gray.50"
                                 _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                 value={item.product}
                                 onChange={(e) => handleProductChange(item.id, e.target.value)}
                              >
                                 {inventory.map(inv => (
                                    <option key={inv._id} value={inv.productID || inv.product?._id || inv._id} disabled={inv.stock <= 0}>
                                       {inv.name} — ({inv.stock} available)
                                    </option>
                                 ))}
                              </Select>
                           </Td>
                           <Td>
                              <HStack spacing="2" justify="center">
                                 <IconButton icon={<Minus size={14}/>} size="xs" variant="outline" borderRadius="md" onClick={() => updateQty(item.id, -1)} isDisabled={item.qty <= 1} />
                                 <Text fontWeight="900" fontSize="md" w="30px" textAlign="center">{item.qty}</Text>
                                 <IconButton icon={<Plus size={14}/>} size="xs" variant="outline" borderRadius="md" onClick={() => updateQty(item.id, 1)} />
                              </HStack>
                           </Td>
                           <Td>
                              <InputGroup size="sm">
                                 <InputLeftElement pointerEvents="none"><IndianRupee size={12}/></InputLeftElement>
                                 <Input 
                                    type="number" 
                                    value={item.price} 
                                    h="48px" 
                                    variant="filled" 
                                    borderRadius="xl" 
                                    fontWeight="800" 
                                    pl="8"
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                 />
                              </InputGroup>
                           </Td>
                           <Td textAlign="right">
                              <Text fontWeight="900" color="secondary" fontSize="md">₹{item.total.toLocaleString()}</Text>
                           </Td>
                           <Td>
                              <IconButton icon={<Trash2 size={16}/>} variant="ghost" colorScheme="red" size="sm" onClick={() => removeItem(item.id)} isDisabled={items.length === 1} />
                           </Td>
                        </Tr>
                      ))}
                   </Tbody>
                </Table>
             </Box>
          </Box>

          {/* Bottom Section: Customer, Notes, Summary (Horizontal Row) */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="8" align="stretch">
             {/* Customer Info */}
             <Box className="premium-card" p="6" border="1px solid" borderColor="gray.100">
                <HStack mb="6" spacing="3">
                   <Box p="2" bg="blue.50" color="blue.500" borderRadius="xl"><User size={20} /></Box>
                   <Text fontWeight="900" color="secondary" fontSize="md">Customer Info</Text>
                </HStack>
                <VStack spacing="5" align="stretch">
                   <FormControl isRequired>
                      <FormLabel fontSize="11px" fontWeight="800" color="gray.500">CLIENT NAME</FormLabel>
                      <Input placeholder="Full name" variant="filled" h="50px" borderRadius="xl" fontWeight="700" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} />
                   </FormControl>
                   <FormControl isRequired>
                      <FormLabel fontSize="11px" fontWeight="800" color="gray.500">PHONE NUMBER</FormLabel>
                      <Input placeholder="10-digit mobile" variant="filled" h="50px" borderRadius="xl" fontWeight="700" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                   </FormControl>
                   <Box>
                      <FormLabel fontSize="11px" fontWeight="800" color="gray.500">PAYMENT MODE</FormLabel>
                      <SimpleGrid columns={2} spacing="2">
                         {[
                            { id: 'Cash', icon: Banknote, color: 'green' },
                            { id: 'UPI / QR', icon: Smartphone, color: 'blue' }
                         ].map(method => (
                            <Button 
                               key={method.id}
                               variant={customerDetails.paymentMethod === method.id ? 'solid' : 'outline'}
                               colorScheme={customerDetails.paymentMethod === method.id ? method.color : 'gray'}
                               h="45px"
                               borderRadius="xl"
                               onClick={() => setCustomerDetails({...customerDetails, paymentMethod: method.id})}
                               leftIcon={<method.icon size={14}/>}
                               fontSize="10px"
                               fontWeight="800"
                            >
                               {method.id}
                            </Button>
                         ))}
                      </SimpleGrid>
                   </Box>
                </VStack>
             </Box>

             {/* Transaction Notes */}
             <Box className="premium-card" p="6" border="1px solid" borderColor="gray.100">
                <HStack mb="6" spacing="3">
                   <Box p="2" bg="orange.50" color="orange.500" borderRadius="xl"><Save size={20} /></Box>
                   <Text fontWeight="900" color="secondary" fontSize="md">Extra Details</Text>
                </HStack>
                <Text fontSize="11px" fontWeight="800" color="gray.500" mb="2">NOTES & TERMS</Text>
                <Input as="textarea" placeholder="Enter special instructions..." h="130px" borderRadius="2xl" variant="filled" p="4" value={customerDetails.notes} onChange={(e) => setCustomerDetails({...customerDetails, notes: e.target.value})} />
                <Box mt="4" p="3" bg="gray.50" borderRadius="xl">
                   <Text fontSize="10px" color="gray.400" fontWeight="700">Stock will be updated instantly upon invoice generation.</Text>
                </Box>
             </Box>

             {/* Billing Summary */}
             <Box className="premium-card" p="6" bg="secondary" color="white" shadow="2xl" position="relative" overflow="hidden">
                <Box position="absolute" top="-20px" right="-20px" bg="whiteAlpha.100" w="100px" h="100px" borderRadius="full" />
                <Heading size="xs" mb="6" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="1px" borderBottom="1px solid" borderColor="whiteAlpha.200" pb="4">Billing Summary</Heading>
                <VStack spacing="3" align="stretch">
                   <Flex justify="space-between" fontSize="sm">
                      <Text color="whiteAlpha.600" fontWeight="600">Total Units</Text>
                      <Text fontWeight="800">{items.reduce((sum, i) => sum + (i.qty || 0), 0)}</Text>
                   </Flex>
                   <Flex justify="space-between" fontSize="sm">
                      <Text color="whiteAlpha.600" fontWeight="600">Subtotal</Text>
                      <Text fontWeight="800">₹{taxableAmount.toLocaleString()}</Text>
                   </Flex>
                   {isGst && (
                      <VStack spacing="2" align="stretch">
                         <Flex justify="space-between" align="center" fontSize="sm">
                            <Text color="whiteAlpha.600" fontWeight="600">GST Rate (%)</Text>
                            <Input 
                               type="number" 
                               variant="filled" 
                               bg="whiteAlpha.100"
                               color="white"
                               textAlign="right" 
                               w="70px" 
                               size="sm"
                               borderRadius="lg"
                               fontWeight="900" 
                               value={gstRate} 
                               onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)} 
                               _focus={{ bg: 'whiteAlpha.200', borderColor: 'brand.500' }}
                            />
                         </Flex>
                         <Flex justify="space-between" align="center" fontSize="xs">
                            <Text color="whiteAlpha.500" fontWeight="600">GST Amount</Text>
                            <Text fontWeight="700">₹{gstAmount.toLocaleString()}</Text>
                         </Flex>
                      </VStack>
                   )}
                   <Flex justify="space-between" align="center" fontSize="sm">
                      <Text color="whiteAlpha.600" fontWeight="600">Discount</Text>
                      <Input type="number" variant="unstyled" textAlign="right" w="60px" fontWeight="900" color="brand.400" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                   </Flex>
                   <Divider borderColor="whiteAlpha.200" />
                   <Flex justify="space-between" align="center">
                      <Text fontWeight="900" fontSize="lg">Total</Text>
                      <Text fontWeight="900" fontSize="3xl" color="brand.400" letterSpacing="-1px">₹{totalAmount.toLocaleString()}</Text>
                   </Flex>
                   <Button colorScheme="brand" size="lg" h="60px" mt="2" borderRadius="2xl" leftIcon={<Printer size={20} />} isLoading={submitting} onClick={handleComplete} fontSize="md" fontWeight="900">
                      Print Invoice
                   </Button>
                </VStack>
             </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </Layout>
  );
};

export default DistributorNewInvoice;

