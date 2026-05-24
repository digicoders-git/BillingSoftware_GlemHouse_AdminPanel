import { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Tag, 
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  useToast,
  Badge,
  Button,
  HStack,
  Flex,
  Spinner,
  IconButton,
  Input,
  VStack,
  Icon,
  Divider
} from '@chakra-ui/react';
import { Search, Download, Printer, ShoppingBag, Calendar, Eye, IndianRupee } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';
import { pdfTemplate } from '../../utils/pdfTemplate';

const DistributorSalesHistory = () => {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/branch-sales');
      setSales(data.sales || []);
    } catch (error) {
      toast({
        title: "Error loading sales history",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (sale) => {
    const billData = {
      billNo: sale.invoiceId,
      clientName: sale.customerName,
      clientPhone: sale.customerPhone || 'N/A',
      items: sale.items || [],
      subTotal: sale.taxableAmount || sale.totalAmount,
      totalTax: sale.gstAmount || 0,
      taxPercentage: sale.gstRate || 0,
      totalAmount: sale.totalAmount,
      isGstEnabled: sale.billingType === 'With GST',
      createdAt: sale.date
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

  const handleView = (sale) => {
    setSelectedSale(sale);
    onOpen();
  };

  const filteredSales = sales.filter(sale => 
    (sale.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.invoiceId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Retail Sales History</Heading>
            <Text color="gray.500" fontWeight="500">Overview of all transactions from your partnership</Text>
          </Box>
          <HStack spacing="4" w={{ base: 'full', md: 'auto' }}>
            <Box position="relative" w={{ base: 'full', md: '300px' }}>
              <Input 
                placeholder="Search by invoice or customer..." 
                pl="10" 
                borderRadius="xl" 
                bg="white" 
                shadow="sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400">
                <Search size={18} />
              </Box>
            </Box>
            <Button leftIcon={<Download size={18} />} variant="outline" borderRadius="xl">Export</Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" mb="10">
           <Box className="premium-card" p="6">
              <Flex align="center" gap="4">
                 <Box bg="brand.50" p="3.5" borderRadius="20px" color="brand.500">
                    <ShoppingBag size={24} />
                 </Box>
                 <Box>
                    <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase">TOTAL BILLS</Text>
                    <Heading size="md" color="secondary" fontWeight="900">{sales.length}</Heading>
                 </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="6">
              <Flex align="center" gap="4">
                 <Box bg="green.50" p="3.5" borderRadius="20px" color="green.500">
                    <IndianRupee size={24} />
                 </Box>
                 <Box>
                    <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase">TOTAL REVENUE</Text>
                    <Heading size="md" color="secondary" fontWeight="900">₹{sales.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</Heading>
                 </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="6">
              <Flex align="center" gap="4">
                 <Box bg="purple.50" p="3.5" borderRadius="20px" color="purple.500">
                    <Calendar size={24} />
                 </Box>
                 <Box>
                    <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase">TODAY'S SALES</Text>
                    <Heading size="md" color="secondary" fontWeight="900">
                       ₹{sales.filter(s => moment(s.date).isSame(moment(), 'day')).reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                    </Heading>
                 </Box>
              </Flex>
           </Box>
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden">
          {loading ? (
            <Flex justify="center" align="center" py="20">
              <Spinner size="xl" color="brand.500" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th py="5">Invoice Details</Th>
                    <Th py="5">Customer</Th>
                    <Th py="5">Items</Th>
                    <Th py="5">Total Amount</Th>
                    <Th py="5">Payment</Th>
                    <Th py="5" textAlign="right">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSales.map((sale) => (
                    <Tr key={sale._id} _hover={{ bg: 'gray.50/50' }}>
                      <Td>
                        <VStack align="start" spacing="0">
                          <Text fontWeight="800" color="secondary">{sale.invoiceId}</Text>
                          <Text fontSize="xs" color="gray.400">{moment(sale.date).format('DD MMM, hh:mm A')}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontWeight="700" fontSize="sm">{sale.customerName}</Text>
                        <Text fontSize="xs" color="gray.500">{sale.customerPhone || 'No Phone'}</Text>
                      </Td>
                      <Td>
                        <Badge variant="subtle" colorScheme="purple" borderRadius="full" px="3">
                          {sale.items.length} Products
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="900" color="brand.500">₹{sale.totalAmount.toLocaleString()}</Text>
                        <Text fontSize="10px" color="gray.400">{sale.billingType}</Text>
                      </Td>
                      <Td>
                        <Tag size="sm" variant="solid" colorScheme="green" borderRadius="full">
                           {sale.paymentMethod}
                        </Tag>
                      </Td>
                      <Td textAlign="right">
                        <IconButton 
                          icon={<Eye size={18} />} 
                          variant="ghost" 
                          colorScheme="brand" 
                          size="sm" 
                          onClick={() => handleView(sale)}
                        />
                        <IconButton 
                          icon={<Printer size={18} />} 
                          variant="ghost" 
                          colorScheme="gray" 
                          size="sm" 
                          onClick={() => handlePrint(sale)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {filteredSales.length === 0 && (
                 <Flex direction="column" align="center" py="20">
                    <Icon as={ShoppingBag} size={40} color="gray.200" mb="4" />
                    <Text color="gray.400" fontWeight="600">No Sales records found</Text>
                 </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Sale Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader borderBottom="1px solid" borderColor="gray.100">
            <VStack align="start" spacing="0">
              <Text fontSize="lg" fontWeight="900" color="secondary">Invoice: {selectedSale?.invoiceId}</Text>
              <Text fontSize="xs" color="gray.400" fontWeight="500">{moment(selectedSale?.date).format('DD MMMM YYYY, hh:mm A')}</Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="6">
            <SimpleGrid columns={2} spacing="6" mb="8">
               <Box>
                  <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase" mb="2">Customer Info</Text>
                  <Text fontWeight="800" fontSize="md">{selectedSale?.customerName}</Text>
                  <Text color="gray.500" fontSize="sm">{selectedSale?.customerPhone}</Text>
               </Box>
               <Box textAlign="right">
                  <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase" mb="2">Payment Details</Text>
                  <Badge colorScheme="green" variant="solid" borderRadius="full" px="3">{selectedSale?.paymentMethod}</Badge>
                  <Text color="gray.500" fontSize="sm" mt="1">{selectedSale?.billingType}</Text>
               </Box>
            </SimpleGrid>

            <Box bg="gray.50" p="4" borderRadius="xl" mb="6">
               <Table variant="simple" size="sm">
                  <Thead>
                     <Tr>
                        <Th fontSize="10px" color="gray.400">PRODUCT</Th>
                        <Th fontSize="10px" color="gray.400" textAlign="center">QTY</Th>
                        <Th fontSize="10px" color="gray.400" textAlign="right">PRICE</Th>
                        <Th fontSize="10px" color="gray.400" textAlign="right">TOTAL</Th>
                     </Tr>
                  </Thead>
                  <Tbody>
                     {selectedSale?.items.map((item, idx) => (
                        <Tr key={idx}>
                           <Td fontWeight="700" fontSize="xs">{item.name}</Td>
                           <Td textAlign="center" fontWeight="800">{item.qty}</Td>
                           <Td textAlign="right" fontSize="xs">₹{item.price.toLocaleString()}</Td>
                           <Td textAlign="right" fontWeight="900" color="brand.500">₹{item.total.toLocaleString()}</Td>
                        </Tr>
                     ))}
                  </Tbody>
               </Table>
            </Box>

            <VStack align="stretch" spacing="2" borderTop="1px solid" borderColor="gray.100" pt="4">
               <Flex justify="space-between" fontSize="sm">
                  <Text color="gray.500" fontWeight="600">Subtotal</Text>
                  <Text fontWeight="700">₹{selectedSale?.taxableAmount?.toLocaleString() || selectedSale?.totalAmount?.toLocaleString()}</Text>
               </Flex>
               {selectedSale?.billingType === 'With GST' && (
                  <Flex justify="space-between" fontSize="sm">
                     <Text color="gray.500" fontWeight="600">GST ({selectedSale?.gstRate}%)</Text>
                     <Text fontWeight="700">₹{selectedSale?.gstAmount?.toLocaleString()}</Text>
                  </Flex>
               )}
               {selectedSale?.discount > 0 && (
                  <Flex justify="space-between" fontSize="sm">
                     <Text color="red.500" fontWeight="600">Discount</Text>
                     <Text color="red.500" fontWeight="700">- ₹{selectedSale?.discount?.toLocaleString()}</Text>
                  </Flex>
               )}
               <Divider my="2" />
               <Flex justify="space-between" align="center">
                  <Text fontWeight="900" fontSize="lg" color="secondary">Total Amount</Text>
                  <Text fontWeight="900" fontSize="2xl" color="brand.500">₹{selectedSale?.totalAmount?.toLocaleString()}</Text>
               </Flex>
            </VStack>

            <Button leftIcon={<Printer size={18}/>} colorScheme="brand" w="full" h="50px" borderRadius="xl" mt="8" onClick={() => handlePrint(selectedSale)}>
               Print / Download Invoice
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default DistributorSalesHistory;

