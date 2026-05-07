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
  Spinner
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash, 
  Printer, 
  Download, 
  Save, 
  User,
  ShoppingBag
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { pdfTemplate } from '../../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../../utils/downloadInvoice';

const BranchNewInvoice = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inventory, setInventory] = useState([]);
  
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
  const [taxPercentage, setTaxPercentage] = useState(18);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get('/branch-inventory');
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
    const selectedProduct = inventory.find(inv => inv.productID === productId || inv.product === productId || inv._id === productId);
    
    if (selectedProduct) {
      // Prevent selecting a product that is already in the list
      if (items.some(item => item.product === selectedProduct.productID && item.id !== id)) {
         toast({ title: "Product already added", status: "warning" });
         return;
      }
      
      setItems(items.map(item => {
        if (item.id === id) {
          const qty = 1;
          const price = selectedProduct.price || 0; // Assuming price is available, otherwise user might need to input
          return {
            ...item,
            product: selectedProduct.productID || selectedProduct.product || selectedProduct._id,
            name: selectedProduct.name,
            category: selectedProduct.category,
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

  const handleQtyChange = (id, qty) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const parsedQty = parseInt(qty) || 0;
        if (parsedQty > item.maxStock) {
          toast({ title: `Only ${item.maxStock} units available in stock`, status: "warning" });
        }
        const validQty = Math.min(parsedQty, item.maxStock);
        return {
          ...item,
          qty: validQty,
          total: validQty * item.price
        };
      }
      return item;
    }));
  };

  const handlePriceChange = (id, price) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const parsedPrice = parseFloat(price) || 0;
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
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * (taxPercentage || 0)) / 100;
  const totalAmount = subtotal + tax - discount;

  const handlePrint = () => {
    const validItems = items.filter(i => i.product && i.qty > 0);
    const billData = {
      billNo: `INV-DRAFT`,
      clientName: customerDetails.name,
      clientPhone: customerDetails.phone,
      clientAddress: customerDetails.notes,
      items: validItems,
      subTotal: subtotal,
      totalTax: tax,
      taxPercentage: taxPercentage,
      totalAmount: totalAmount,
      isGstEnabled: true,
      createdAt: new Date().toISOString()
    };
    
    const html = pdfTemplate(billData);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for images to load before printing
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
      subTotal: subtotal,
      totalTax: tax,
      taxPercentage: taxPercentage,
      totalAmount: totalAmount,
      isGstEnabled: true,
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

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerDetails.name,
        paymentMethod: customerDetails.paymentMethod,
        items: validItems.map(i => ({
          product: i.product,
          name: i.name,
          qty: i.qty,
          price: i.price,
          total: i.total
        }))
      };

      const { data: newSale } = await API.post('/branch-sales', payload);
      
      toast({
        title: "Transaction Successful",
        description: "Generating invoice...",
        status: "success",
        duration: 2000
      });

      // Auto Download Invoice
      const billData = {
        billNo: newSale.invoiceId,
        clientName: customerDetails.name,
        clientPhone: customerDetails.phone,
        clientAddress: customerDetails.notes,
        items: payload.items,
        subTotal: subtotal,
        totalTax: tax,
        taxPercentage: taxPercentage,
        totalAmount: totalAmount,
        isGstEnabled: true,
        createdAt: newSale.createdAt || new Date().toISOString()
      };
      
      const html = pdfTemplate(billData);
      try {
        await downloadInvoiceAsJpg(html, `Invoice_${newSale.invoiceId}.jpg`);
      } catch (e) {
        console.error('Download error:', e);
        toast({ title: "Invoice generated but auto-download failed.", status: "warning" });
      }

      navigate('/branch/sales-history');
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
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Generate New Invoice</Heading>
            <Text fontSize="sm" color="gray.500">Create a professional bill for your customer</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Printer size={18} />} variant="outline" borderRadius="xl" flex={1} onClick={handlePrint}>Print</Button>
            <Button leftIcon={<Download size={18} />} variant="outline" borderRadius="xl" flex={1} onClick={handleDownloadDraft}>Download</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
          {/* Main Billing Section */}
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="6" mb="6">
              <HStack mb="6" spacing="2">
                <Box p="2" bg="brand.50" borderRadius="lg" color="brand.500">
                  <ShoppingBag size={20} />
                </Box>
                <Heading size="sm" color="secondary">Product Details</Heading>
              </HStack>
              
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th border="none">Product Name</Th>
                      <Th border="none">Qty</Th>
                      <Th border="none">Price</Th>
                      <Th border="none">Total</Th>
                      <Th border="none"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id}>
                        <Td borderColor="gray.100" minW="250px">
                          <Select 
                            placeholder="Select Product" 
                            variant="outline" 
                            bg="white" 
                            borderColor="gray.200"
                            borderRadius="lg" 
                            h="45px"
                            value={item.product || ''}
                            onChange={(e) => handleProductChange(item.id, e.target.value)}
                          >
                            {inventory.map(inv => (
                              <option 
                                key={inv._id} 
                                value={inv.productID || inv.product || inv._id} 
                                disabled={(inv.stock || inv.currentStock || 0) === 0}
                              >
                                {inv.name} (Stock: {inv.stock || inv.currentStock || 0})
                              </option>
                            ))}
                          </Select>
                        </Td>
                        <Td borderColor="gray.100" minW="120px" w="120px">
                          <Input 
                            type="number" 
                            value={item.qty} 
                            min={1}
                            max={item.maxStock || 1}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            variant="outline" 
                            bg="white" 
                            borderColor="gray.200"
                            borderRadius="lg" 
                            h="45px" 
                            w="full"
                            textAlign="center"
                          />
                        </Td>
                        <Td borderColor="gray.100" minW="120px" w="140px">
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            value={item.price}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            variant="outline" 
                            bg="white" 
                            borderColor="gray.200"
                            borderRadius="lg" 
                            h="45px" 
                            w="full"
                          />
                        </Td>
                        <Td borderColor="gray.100" minW="120px" w="120px">
                          <Text fontWeight="800" color="secondary">₹{item.total.toLocaleString()}</Text>
                        </Td>
                        <Td borderColor="gray.100" textAlign="right">
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
              
              <Button 
                leftIcon={<Plus size={16} />} 
                variant="dashed" 
                w="full" 
                mt="4" 
                borderColor="brand.300" 
                color="brand.500"
                onClick={addItem}
                _hover={{ bg: 'brand.50' }}
              >
                Add Another Item
              </Button>
            </Box>

            <Box className="premium-card" p="6">
              <Heading size="sm" mb="6" color="secondary">Notes / Terms</Heading>
              <Input 
                as="textarea" 
                name="notes"
                value={customerDetails.notes}
                onChange={handleCustomerChange}
                placeholder="Enter any additional notes or terms here..." 
                h="100px" 
                py="3" 
                variant="outline"
                bg="white" 
                borderColor="gray.200"
                borderRadius="xl" 
              />
            </Box>
          </GridItem>

          {/* Customer & Summary Section */}
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <Box className="premium-card" p="6" mb="6">
              <HStack mb="6" spacing="2">
                <Box p="2" bg="blue.50" borderRadius="lg" color="blue.500">
                  <User size={20} />
                </Box>
                <Heading size="sm" color="secondary">Customer Details</Heading>
              </HStack>
              
              <VStack spacing="4" align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Customer Name</FormLabel>
                  <Input 
                    name="name"
                    value={customerDetails.name}
                    onChange={handleCustomerChange}
                    placeholder="John Doe" 
                    h="45px" 
                    variant="outline"
                    bg="white"
                    borderColor="gray.200"
                    borderRadius="lg" 
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Phone Number</FormLabel>
                  <Input 
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleCustomerChange}
                    placeholder="+1 234 567 890" 
                    h="45px" 
                    variant="outline"
                    bg="white"
                    borderColor="gray.200"
                    borderRadius="lg" 
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Payment Method</FormLabel>
                  <Select 
                    name="paymentMethod"
                    value={customerDetails.paymentMethod}
                    onChange={handleCustomerChange}
                    h="45px" 
                    variant="outline"
                    bg="white"
                    borderColor="gray.200"
                    borderRadius="lg"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </Select>
                </FormControl>
              </VStack>
            </Box>

            <Box className="premium-card" p="6">
              <Heading size="sm" mb="6" color="secondary">Bill Summary</Heading>
              <VStack spacing="3" align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">Subtotal</Text>
                  <Text fontWeight="700" fontSize="sm">₹{subtotal.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text color="gray.500" fontSize="sm">Tax (%)</Text>
                  <Input 
                    type="number" 
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number(e.target.value))}
                    w="80px" 
                    size="sm" 
                    textAlign="right"
                    variant="outline"
                    bg="white"
                    borderColor="gray.200"
                    borderRadius="md"
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text color="gray.500" fontSize="sm">Tax Amount</Text>
                  <Text fontWeight="700" fontSize="sm">₹{tax.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text color="gray.500" fontSize="sm">Discount</Text>
                  <Input 
                    type="number" 
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    size="sm" 
                    w="80px" 
                    textAlign="right"
                    borderRadius="md"
                  />
                </Flex>
                <Divider my="2" />
                <Flex justify="space-between" align="center">
                  <Text fontWeight="800" fontSize="md" color="secondary">Total Amount</Text>
                  <Text fontWeight="800" fontSize="xl" color="brand.500">₹{Math.max(0, totalAmount).toLocaleString()}</Text>
                </Flex>
                
                <Button 
                  colorScheme="brand" 
                  size="lg" 
                  h="55px" 
                  mt="4" 
                  borderRadius="xl" 
                  shadow="lg" 
                  leftIcon={<Save size={20} />}
                  onClick={handleCompleteTransaction}
                  isLoading={submitting}
                >
                  Complete Transaction
                </Button>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchNewInvoice;
