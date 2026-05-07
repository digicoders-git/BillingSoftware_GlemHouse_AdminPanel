import { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  VStack, 
  Icon, 
  Badge, 
  Divider, 
  Grid, 
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Calendar, 
  Truck, 
  CheckCircle,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';

const DispatchSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDispatchDetails();
  }, [id]);

  const fetchDispatchDetails = async () => {
    try {
      const { data } = await API.get(`/dispatches/${id}`);
      setDispatch(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching details",
        status: "error",
        duration: 3000,
      });
      navigate('/total-dispatch-stock');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'green';
      case 'Dispatched': return 'blue';
      case 'Pending': return 'orange';
      default: return 'gray';
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
               <Text fontSize="sm" fontWeight="700">Back to List</Text>
            </HStack>
            <HStack spacing="4">
              <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Dispatch Summary</Heading>
              <Badge colorScheme={getStatusColor(dispatch.status)} borderRadius="full" px="3" py="1" variant="subtle" fontSize="10px" fontWeight="800">
                {dispatch.status}
              </Badge>
            </HStack>
            <Text color="gray.500" fontWeight="500" mt="1">Transaction Ref: {dispatch.reference || `DSP-${dispatch._id.slice(-6).toUpperCase()}`}</Text>
          </Box>
          <HStack spacing="3">
            <Button leftIcon={<Printer size={16} />} variant="outline" borderRadius="xl">Print Summary</Button>
            <Button leftIcon={<Download size={16} />} colorScheme="brand" borderRadius="xl">Export Invoice</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
             <Box className="premium-card" p="0" overflow="hidden">
                <Box p="8" borderBottom="1px solid" borderColor="gray.50">
                   <Heading size="sm" color="secondary" mb="6">Consignment Items</Heading>
                   <Table variant="simple">
                      <Thead bg="gray.50/50">
                         <Tr>
                            <Th color="gray.400" border="none" py="4">Product Name</Th>
                            <Th color="gray.400" border="none" py="4">SKU Code</Th>
                            <Th color="gray.400" border="none" py="4">Unit Price</Th>
                            <Th color="gray.400" border="none" py="4">Quantity</Th>
                            <Th color="gray.400" border="none" py="4" textAlign="right">Subtotal</Th>
                         </Tr>
                      </Thead>
                      <Tbody>
                         {dispatch.items.map((item, idx) => (
                            <Tr key={idx}>
                               <Td borderColor="gray.100" py="4">
                                  <Text fontWeight="700" color="secondary" fontSize="xs">{item.name}</Text>
                               </Td>
                               <Td borderColor="gray.100"><Text fontSize="10px" color="brand.500" fontWeight="800">{item.sku}</Text></Td>
                               <Td borderColor="gray.100"><Text fontSize="xs" color="gray.600">₹{item.price}</Text></Td>
                               <Td borderColor="gray.100"><Text fontSize="xs" fontWeight="800" color="secondary">{item.qty}</Text></Td>
                               <Td borderColor="gray.100" textAlign="right"><Text fontWeight="900" color="secondary">₹{(item.qty * item.price).toLocaleString()}</Text></Td>
                            </Tr>
                         ))}
                      </Tbody>
                   </Table>
                </Box>
                <Box p="8" bg="gray.50/30">
                   <Flex justify="end">
                      <VStack align="end" spacing="4" w="300px">
                         <Flex justify="space-between" w="full">
                            <Text fontSize="xs" fontWeight="700" color="gray.400">TOTAL UNITS</Text>
                            <Text fontSize="sm" fontWeight="800" color="secondary">{dispatch.totalItems}</Text>
                         </Flex>
                         <Divider />
                         <Flex justify="space-between" w="full">
                            <Text fontSize="sm" fontWeight="800" color="secondary">GRAND TOTAL</Text>
                            <Text fontSize="xl" fontWeight="900" color="brand.500">₹{dispatch.totalValue.toLocaleString()}</Text>
                         </Flex>
                      </VStack>
                   </Flex>
                </Box>
             </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
             <VStack spacing="8" align="stretch">
                <Box className="premium-card" p="8">
                   <Heading size="xs" color="gray.400" textTransform="uppercase" letterSpacing="1px" mb="6">Recipient Details</Heading>
                   <VStack align="start" spacing="5">
                      <HStack spacing="4">
                         <Avatar size="md" name={dispatch.branch?.name} bg="secondary" color="white" />
                         <Box>
                            <Text fontWeight="800" color="secondary" fontSize="md">{dispatch.branch?.name}</Text>
                            <Text fontSize="xs" color="brand.500" fontWeight="700">{dispatch.branch?.branchId}</Text>
                         </Box>
                      </HStack>
                      <Divider />
                      <VStack align="start" spacing="3" w="full">
                         <HStack color="gray.600">
                            <Icon as={User} size={14} />
                            <Text fontSize="xs" fontWeight="600">{dispatch.branch?.manager}</Text>
                         </HStack>
                         <HStack color="gray.600">
                            <Icon as={Phone} size={14} />
                            <Text fontSize="xs" fontWeight="600">{dispatch.branch?.contact}</Text>
                         </HStack>
                         <HStack color="gray.600">
                            <Icon as={Mail} size={14} />
                            <Text fontSize="xs" fontWeight="600">{dispatch.branch?.email}</Text>
                         </HStack>
                         <HStack color="gray.600" align="start">
                            <Icon as={MapPin} size={14} mt="1" />
                            <Text fontSize="xs" fontWeight="600">{dispatch.branch?.location}</Text>
                         </HStack>
                      </VStack>
                   </VStack>
                </Box>

                <Box className="premium-card" p="8">
                   <Heading size="xs" color="gray.400" textTransform="uppercase" letterSpacing="1px" mb="6">Shipping Information</Heading>
                   <VStack align="stretch" spacing="4">
                      <Box>
                         <Text fontSize="10px" fontWeight="800" color="gray.400" mb="1">TRANSPORT METHOD</Text>
                         <HStack color="secondary">
                            <Truck size={16} />
                            <Text fontSize="sm" fontWeight="700">{dispatch.method}</Text>
                         </HStack>
                      </Box>
                      <Box>
                         <Text fontSize="10px" fontWeight="800" color="gray.400" mb="1">DISPATCH DATE</Text>
                         <HStack color="secondary">
                            <Calendar size={16} />
                            <Text fontSize="sm" fontWeight="700">{new Date(dispatch.date).toDateString()}</Text>
                         </HStack>
                      </Box>
                      <Box>
                         <Text fontSize="10px" fontWeight="800" color="gray.400" mb="1">LAST UPDATED</Text>
                         <HStack color="secondary">
                            <CheckCircle size={16} />
                            <Text fontSize="sm" fontWeight="700">{new Date(dispatch.updatedAt).toLocaleString()}</Text>
                         </HStack>
                      </Box>
                   </VStack>
                </Box>
             </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DispatchSummary;
