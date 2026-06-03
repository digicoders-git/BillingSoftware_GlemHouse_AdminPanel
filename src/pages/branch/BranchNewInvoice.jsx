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
import { useNavigate, useLocation } from 'react-router-dom';
import { pdfTemplate } from '../../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../../utils/downloadInvoice';

const BranchNewInvoice = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inventory, setInventory] = useState([]);
  
  // GST Mode from query or default
  const [isGst, setIsGst] = useState(location.pathname.includes('gst'));
  
  // Invoice State
  const [items, setItems] = useState([
    { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0, expiryDate: '' }
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
      const userRole = localStorage.getItem('userRole');
      let endpoint = '/branch-inventory';
      if (userRole === 'distributor') endpoint = '/distributor-inventory';
      
      const { data } = await API.get(endpoint);
      setInventory(data.inventory || []);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to load inventory", status: "error" });
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', name: '', qty: 1, price: 0, total: 0, maxStock: 0, expiryDate: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, productId) => {
    const selectedProduct = inventory.find(inv => 
      inv._id === productId || 
      inv.product?._id === productId || 
      inv.productID === productId
    );
    
    if (selectedProduct) {
      if (items.some(item => item.product === productId && item.id !== id)) {
         toast({ title: "Product already added", status: "warning" });
         return;
      }
      
      setItems(items.map(item => {
        if (item.id === id) {
          const qty = 1;
          const price = selectedProduct.product?.price || selectedProduct.price || 0;
          return {
            ...item,
            product: productId,
            name: selectedProduct.product?.name || selectedProduct.name,
            category: selectedProduct.product?.category || selectedProduct.category,
            price: price,
            qty: qty,
            total: qty * price,
            maxStock: selectedProduct.stock || 0,
            expiryDate: selectedProduct.product?.expiry || selectedProduct.expiry || ''
          };
        }
        return item;
      }));
    }
  };

  const handleQtyChange = (id, qty) => {
    if (qty === '') {
      setItems(items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            qty: '',
            total: 0
          };
        }
        return item;
      }));
      return;
    }

    const parsedQty = parseInt(qty);
    if (isNaN(parsedQty)) return;

    setItems(items.map(item => {
      if (item.id === id) {
        let finalQty = parsedQty;
        if (item.product && finalQty > item.maxStock) {
          toast({ 
            title: `Only ${item.maxStock} units available`, 
            status: "warning", 
            duration: 1500 
          });
          finalQty = item.maxStock;
        }
        if (finalQty < 0) {
          finalQty = 0;
        }
        return {
          ...item,
          qty: finalQty,
          total: finalQty * item.price
        };
      }
      return item;
    }));
  };

  const handlePriceChange = (id, price) => {
    const parsedPrice = parseFloat(price) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          price: parsedPrice,
          total: item.qty * parsedPrice
        };
      }
      return item;
    }));
  };

  const handleCustomerChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  // Calculations
  const taxableAmount = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = isGst ? (taxableAmount * gstRate) / 100 : 0;
  const totalAmount = taxableAmount + gstAmount - discount;

  const handlePrint = () => {
    const validItems = items.filter(i => i.product && i.qty > 0);
    const billData = {
      billNo: `INV-DRAFT`,
      clientName: customerDetails.name,
      clientPhone: customerDetails.phone,
      clientAddress: customerDetails.notes,
      items: validItems,
      subTotal: taxableAmount,
      totalTax: gstAmount,
      taxPercentage: isGst ? gstRate : 0,
      totalAmount: totalAmount,
      isGstEnabled: isGst,
      createdAt: new Date().toISOString()
    };
    
    const html = pdfTemplate(billData);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
  };

  const handleDownloadDraft = async () => {
    const validItems = items.filter(i => i.product && i.qty > 0);
    if (validItems.length === 0) return toast({ title: "Add at least one product", status: "warning" });

    const billData = {
      billNo: `INV-DRAFT`,
      clientName: customerDetails.name,
      clientPhone: customerDetails.phone,
      clientAddress: customerDetails.notes,
      items: validItems,
      subTotal: taxableAmount,
      totalTax: gstAmount,
      taxPercentage: isGst ? gstRate : 0,
      totalAmount: totalAmount,
      isGstEnabled: isGst,
      createdAt: new Date().toISOString()
    };
    
    const html = pdfTemplate(billData);
    toast({ title: "Generating JPG...", status: "info", duration: 2000 });
    try {
      await downloadInvoiceAsJpg(html, `Invoice_Draft.jpg`);
    } catch (error) {
      toast({ title: "Failed to download", status: "error" });
    }
  };

  const handleCompleteTransaction = async () => {
    if (!customerDetails.name) {
      return toast({ title: "Customer name is required", status: "error" });
    }
    const validItems = items.filter(i => i.product && i.qty > 0);
    if (validItems.length === 0) {
      return toast({ title: "Add at least one valid product", status: "error" });
    }

    // Strict stock validation
    for (const item of validItems) {
      if (item.qty > item.maxStock) {
        return toast({ 
          title: `Insufficient stock for ${item.name}`, 
          description: `Only ${item.maxStock} units available in branch inventory.`,
          status: "error" 
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
          expiryDate: i.expiryDate || ''
        })),
        billingType: isGst ? 'With GST' : 'Without GST',
        gstRate: isGst ? gstRate : 0,
        taxableAmount,
        gstAmount,
        discount,
        totalAmount
      };

      const { data: newSale } = await API.post('/branch-sales', payload);
      
      toast({
        title: "Transaction Successful",
        status: "success",
      });

      // Auto Download Invoice
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
      try {
        await downloadInvoiceAsJpg(html, `Invoice_${newSale.invoiceId}.jpg`);
      } catch (e) {
        console.error('Download error:', e);
      }

      navigate('/sales/history');
    } catch (error) {
      toast({ 
        title: "Transaction Failed", 
        description: error.response?.data?.message || "Something went wrong", 
        status: "error" 
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
                New Invoice {isGst ? '(GST)' : '(Non-GST)'}
            </Heading>
            <Text color="gray.500" fontWeight="500">Create a professional bill for your customer</Text>
          </Box>
          <HStack spacing="4">
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="gst-mode" mb="0" fontSize="sm" fontWeight="700">GST Billing</FormLabel>
                <Switch id="gst-mode" colorScheme="brand" isChecked={isGst} onChange={() => setIsGst(!isGst)} />
            </FormControl>
            <HStack spacing="2">
                <Button leftIcon={<Printer size={18} />} variant="outline" borderRadius="xl" size="sm" onClick={handlePrint}>Print</Button>
                <Button leftIcon={<Download size={18} />} variant="outline" borderRadius="xl" size="sm" onClick={handleDownloadDraft}>Draft</Button>
            </HStack>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="0" overflow="hidden">
              <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50">
                 <HStack spacing="3">
                    <Box p="2" bg="brand.50" borderRadius="lg" color="brand.500"><ShoppingBag size={20} /></Box>
                    <VStack align="start" spacing="0">
                        <Heading size="sm" color="secondary">Product Particulars</Heading>
                        <Text fontSize="xs" color="gray.400">Select products from your inventory</Text>
                    </VStack>
                 </HStack>
                 <Button leftIcon={<Plus size={16} />} variant="solid" colorScheme="brand" size="sm" borderRadius="lg" onClick={addItem}>
                    Add Item
                 </Button>
              </Flex>
              
              <Box overflowX="auto">
                <Table variant="simple" minW="750px">
                  <Thead bg="gray.50/50">
                    <Tr>
                      <Th py="4" border="none" fontSize="10px" minW="220px">Description</Th>
                      <Th py="4" border="none" fontSize="10px" w="140px">Expiry (Optional)</Th>
                      <Th py="4" border="none" fontSize="10px" w="110px">Qty</Th>
                      <Th py="4" border="none" fontSize="10px" w="120px">Unit Price</Th>
                      <Th py="4" border="none" fontSize="10px" textAlign="right" w="100px">Total</Th>
                      <Th py="4" border="none" fontSize="10px" w="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }}>
                        <Td py="4">
                          <Select 
                            placeholder="Select Product" 
                            variant="filled" 
                            size="sm"
                            h="45px"
                            borderRadius="lg" 
                            fontWeight="600"
                            value={item.product || ''}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {inventory.map(inv => (
                              <option 
                                key={inv._id} 
                                value={inv._id} 
                              >
                                {inv.name} ({inv.sku || inv.product?.sku}) — Stock: {inv.stock || 0}
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
                            borderRadius="lg"
                            h="45px"
                            fontWeight="700"
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
                            borderRadius="lg" 
                            h="45px" 
                            fontWeight="800"
                            textAlign="center"
                          />
                        </Td>
                        <Td>
                          <Input 
                            type="number" 
                            value={item.price}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            variant="filled" 
                            borderRadius="lg" 
                            h="45px" 
                            fontWeight="800"
                          />
                        </Td>
                        <Td textAlign="right">
                          <Text fontWeight="900" color="secondary">₹{item.total.toLocaleString()}</Text>
                        </Td>
                        <Td>
                          <IconButton 
                            icon={<Trash size={16} />} 
                            colorScheme="red" 
                            variant="ghost" 
                            size="sm" 
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
              <Heading size="xs" mb="4" color="gray.500" textTransform="uppercase" letterSpacing="1px">Notes & Terms</Heading>
              <Input 
                as="textarea" 
                name="notes"
                value={customerDetails.notes}
                onChange={handleCustomerChange}
                placeholder="Notes for the customer or internal records..." 
                h="120px" 
                py="4" 
                variant="filled"
                borderRadius="xl" 
                fontWeight="500"
              />
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6">
                  <HStack mb="6" spacing="3">
                    <Box p="2" bg="blue.50" borderRadius="lg" color="blue.500"><User size={20} /></Box>
                    <Heading size="sm" color="secondary">Customer</Heading>
                  </HStack>
                  
                  <VStack spacing="4" align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Full Name</FormLabel>
                      <Input 
                        name="name"
                        value={customerDetails.name}
                        onChange={handleCustomerChange}
                        placeholder="e.g. Rahul Sharma" 
                        h="45px" 
                        variant="filled"
                        borderRadius="lg" 
                        fontWeight="700"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Phone Number</FormLabel>
                      <Input 
                        name="phone"
                        value={customerDetails.phone}
                        onChange={handleCustomerChange}
                        placeholder="+91 00000 00000" 
                        h="45px" 
                        variant="filled"
                        borderRadius="lg" 
                        fontWeight="700"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Payment Method</FormLabel>
                      <Select 
                        name="paymentMethod"
                        value={customerDetails.paymentMethod}
                        onChange={handleCustomerChange}
                        h="45px" 
                        variant="filled"
                        borderRadius="lg"
                        fontWeight="700"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI / QR Code">UPI / QR Code</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Card Payment">Card Payment</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </Box>

                <Box className="premium-card" p="6" bg="secondary" color="white">
                  <Heading size="sm" mb="8" color="whiteAlpha.800" borderBottom="1px solid" borderColor="whiteAlpha.200" pb="4">Order Summary</Heading>
                  <VStack spacing="4" align="stretch">
                    <Flex justify="space-between">
                      <Text color="whiteAlpha.600" fontWeight="600">Taxable Value</Text>
                      <Text fontWeight="700">₹{taxableAmount.toLocaleString()}</Text>
                    </Flex>
                    
                    {isGst && (
                        <Flex justify="space-between" align="center">
                            <HStack spacing="1">
                                <Text color="whiteAlpha.600" fontWeight="600">GST (</Text>
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
                                <Text color="whiteAlpha.600" fontWeight="600">% )</Text>
                            </HStack>
                            <Text fontWeight="700" color="orange.300">₹{gstAmount.toLocaleString()}</Text>
                        </Flex>
                    )}

                    <Flex justify="space-between" align="center">
                      <Text color="whiteAlpha.600" fontWeight="600">Discount</Text>
                      <Input 
                        type="number" 
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        size="xs" 
                        w="80px" 
                        bg="whiteAlpha.100"
                        border="none"
                        color="white"
                        textAlign="right"
                      />
                    </Flex>
                    
                    <Divider borderColor="whiteAlpha.200" my="2" />
                    
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="800" fontSize="lg">Grand Total</Text>
                      <Text fontWeight="900" fontSize="2xl" color="brand.400">₹{Math.max(0, totalAmount).toLocaleString()}</Text>
                    </Flex>
                    
                    <Button 
                      colorScheme="brand" 
                      size="lg" 
                      h="60px" 
                      mt="6" 
                      borderRadius="xl" 
                      leftIcon={<Save size={20} />}
                      onClick={handleCompleteTransaction}
                      isLoading={submitting}
                      fontSize="md"
                      fontWeight="900"
                    >
                      Complete & Print
                    </Button>
                  </VStack>
                </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchNewInvoice;
