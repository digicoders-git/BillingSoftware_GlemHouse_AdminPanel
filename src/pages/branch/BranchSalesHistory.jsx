import React, { useState, useEffect } from 'react';
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
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Spinner,
  useToast,
  VStack
} from '@chakra-ui/react';
import { 
  Search, 
  Download, 
  Calendar, 
  Receipt,
  User,
  ShoppingBag,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import { pdfTemplate } from '../../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../../utils/downloadInvoice';

const BranchSalesHistory = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sales: [], stats: {} });
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const { data } = await API.get('/branch-sales');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching sales history", status: "error" });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.sales.length === 0) return;
    
    const headers = ['Invoice ID', 'Products', 'Customer Name', 'Qty Sold', 'Total Amount', 'Date', 'Time'];
    const csvData = data.sales.map(s => [
      s.invoiceId,
      `"${s.products}"`,
      s.customerName,
      s.totalQty,
      s.totalAmount,
      s.date,
      s.time
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Sales_History_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, sales history has been downloaded as CSV.",
      status: "success",
    });
  };

  const handleDownloadInvoice = async (row) => {
    // Reconstruct billData from the sale row
    const billData = {
      billNo: row.invoiceId,
      clientName: row.customerName,
      clientPhone: 'N/A', // If not available in row
      clientAddress: 'AS PER RECORDS',
      items: row.items || [],
      subTotal: row.totalAmount, // Assuming no tax/discount was tracked separately in this specific history view
      totalTax: 0,
      totalAmount: row.totalAmount,
      isGstEnabled: false, // Fallback if no specific GST record is found
      createdAt: row.date
    };
    
    const html = pdfTemplate(billData);
    toast({ title: "Generating JPG...", status: "info", duration: 2000 });
    try {
      await downloadInvoiceAsJpg(html, `Invoice_${row.invoiceId}.jpg`);
    } catch (error) {
      toast({ title: "Failed to download", status: "error" });
    }
  };

  const filteredSales = data.sales.filter(s => 
    s.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.products.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Heading size="md" color="secondary">Daily Sales Records</Heading>
            <Text fontSize="sm" color="gray.500">Track your sold stock and customer transactions</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Download size={18} />} colorScheme="brand" borderRadius="xl" flex={1} onClick={handleExport}>Export Sales</Button>
          </HStack>
        </Flex>

        {/* Quick Sales Stats */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(4, 1fr)" }} gap="6" mb="8">
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="blue.50" color="blue.500" borderRadius="xl">
                  <ShoppingBag size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Total Sold</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">{data.stats.totalSold} Units</Text>
                </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="green.50" color="green.500" borderRadius="xl">
                  <TrendingUp size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Revenue</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">₹{data.stats.revenue?.toLocaleString()}</Text>
                </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="orange.50" color="orange.500" borderRadius="xl">
                  <Receipt size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Invoices</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">{data.stats.invoiceCount} Bills</Text>
                 </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }} bg="brand.500" color="white">
              <Flex align="center" gap="4">
                <Box p="3" bg="whiteAlpha.200" borderRadius="xl">
                  <TrendingUp size={20} color="white" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="whiteAlpha.800" fontWeight="700" textTransform="uppercase">Avg Value</Text>
                  <Text fontSize="xl" fontWeight="800">₹{data.stats.avgValue}</Text>
                </Box>
              </Flex>
           </Box>
        </Grid>

        {/* Sales Table */}
        <Box className="premium-card">
          <Box p="4" borderBottom="1px solid" borderColor="gray.50">
            <Flex direction={{ base: 'column', sm: 'row' }} gap="4" justify="space-between">
              <Heading size="sm" color="secondary">Product-wise Sales Log</Heading>
              <InputGroup maxW={{ base: 'full', sm: '300px' }}>
                <InputLeftElement pointerEvents="none">
                  <Search size={18} color="#637381" />
                </InputLeftElement>
                <Input 
                  placeholder="Search invoice or product..." 
                  bg="background" 
                  borderRadius="xl" 
                  border="none" 
                  _focus={{ bg: 'white', shadow: 'md' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="background">
                <Tr>
                  <Th color="gray.500" border="none">Invoice ID</Th>
                  <Th color="gray.500" border="none">Product Details</Th>
                  <Th color="gray.500" border="none">Customer</Th>
                  <Th color="gray.500" border="none">Qty Sold</Th>
                  <Th color="gray.500" border="none">Total Amount</Th>
                  <Th color="gray.500" border="none">Date & Time</Th>
                  <Th color="gray.500" border="none" textAlign="right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSales.length > 0 ? filteredSales.map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100">
                      <Text fontWeight="700" color="brand.500" fontSize="sm">{row.invoiceId}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Box p="1" bg="background" borderRadius="md">
                           <BarChart2 size={14} color="#298AC6" />
                        </Box>
                        <Text fontWeight="600" fontSize="sm">{row.products}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Icon as={User} size={14} color="gray.400" />
                        <Text fontSize="sm">{row.customerName}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontWeight="700">{row.totalQty} Units</Text></Td>
                    <Td borderColor="gray.100"><Text fontWeight="800" color="secondary">₹{row.totalAmount?.toLocaleString()}</Text></Td>
                    <Td borderColor="gray.100">
                      <VStack align="start" spacing="0">
                        <Text fontSize="xs" fontWeight="700">{row.time}</Text>
                        <Text fontSize="10px" color="gray.400">{row.date}</Text>
                      </VStack>
                    </Td>
                    <Td borderColor="gray.100" textAlign="right">
                      <Button 
                        size="xs" 
                        variant="outline" 
                        colorScheme="brand" 
                        leftIcon={<Download size={14} />}
                        onClick={() => handleDownloadInvoice(row)}
                      >
                        Download
                      </Button>
                    </Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan="7" textAlign="center" py="10" color="gray.400">No sales records found</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default BranchSalesHistory;
