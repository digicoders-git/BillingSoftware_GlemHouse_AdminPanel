import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  useToast,
  HStack,
  Button,
  Select,
  Spacer,
  FormControl,
  FormLabel,
  VStack,
  Divider,
  Stack
} from '@chakra-ui/react';
import { RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Layout from '../components/Layout';
import moment from 'moment';

const AdminInventoryLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const toast = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/inventory/logs');
      setLogs(data);
    } catch (error) {
      toast({ title: 'Error fetching logs', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const filteredLogs = logs.filter(log => {
    let locMatch = true;
    if (filterLocation === 'Warehouse') locMatch = !log.branch && !log.salesRep;
    else if (filterLocation === 'Deepo') locMatch = !!log.branch;
    else if (filterLocation === 'Superstockist') locMatch = !!log.salesRep;
    
    const typeMatch = filterType === 'All' || log.type === filterType;
    return locMatch && typeMatch;
  });

  return (
    <Layout>
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="lg" color="secondary">Inventory History</Heading>
            <Text color="gray.500" fontSize="sm">Track all stock movements across the network</Text>
          </Box>
          <HStack>
             <Button leftIcon={<RefreshCcw size={16} />} onClick={handleRefresh} isLoading={refreshing} size="sm" variant="outline">
                Refresh
             </Button>
          </HStack>
        </Flex>

        {/* Simplified Filters */}
        <HStack spacing="4" mb="6" bg="white" p="4" borderRadius="xl" shadow="sm">
           <FormControl w="200px">
              <FormLabel fontSize="10px" fontWeight="800" color="gray.400" mb="1">LOCATION</FormLabel>
              <Select size="sm" borderRadius="md" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                  <option value="All">All Locations</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Deepo">All Depots (Branches)</option>
                  <option value="Superstockist">All Superstockist Partners</option>
              </Select>
           </FormControl>
           <FormControl w="200px">
              <FormLabel fontSize="10px" fontWeight="800" color="gray.400" mb="1">TYPE</FormLabel>
              <Select size="sm" borderRadius="md" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                 <option value="All">All Types</option>
                 <option value="Stock In">Stock In (+)</option>
                 <option value="Stock Out">Stock Out (-)</option>
              </Select>
           </FormControl>
           <Spacer />
           <Badge colorScheme="blue" variant="subtle" px="3" py="1" borderRadius="md">
              {filteredLogs.length} Records Found
           </Badge>
        </HStack>

        <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
           {loading && !refreshing ? (
             <Flex py="20" justify="center" direction="column" align="center" gap="4">
                <Spinner color="brand.500" />
                <Text fontSize="sm" color="gray.500">Loading history...</Text>
             </Flex>
           ) : (
             <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                   <Tr>
                      <Th py="4">Date & Time</Th>
                      <Th py="4">Product</Th>
                      <Th py="4">Location</Th>
                      <Th py="4">Type</Th>
                      <Th py="4" isNumeric>Qty</Th>
                      <Th py="4">Reason</Th>
                      <Th py="4">User</Th>
                   </Tr>
                </Thead>
                <Tbody>
                   {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                      <Tr key={log._id} _hover={{ bg: 'gray.50' }}>
                         <Td>
                            <Text fontSize="xs" fontWeight="700">{moment(log.createdAt).format('DD/MM/YY')}</Text>
                            <Text fontSize="10px" color="gray.500">{moment(log.createdAt).format('hh:mm A')}</Text>
                         </Td>
                         <Td>
                            <Text fontWeight="700" fontSize="xs">{log.product?.name || 'N/A'}</Text>
                            <Text fontSize="10px" color="gray.400">{log.product?.sku}</Text>
                         </Td>
                         <Td>
                            <HStack spacing="2">
                               <Box w="8px" h="8px" borderRadius="full" bg={log.branch ? 'blue.400' : log.salesRep ? 'purple.400' : 'gray.400'} />
                               <VStack align="start" spacing="0">
                                  <Text fontSize="xs" fontWeight="700" color={log.branch ? 'blue.600' : log.salesRep ? 'purple.600' : 'gray.600'}>
                                     {log.branch ? log.branch.name : log.salesRep ? log.salesRep.name : 'Warehouse'}
                                  </Text>
                                  {log.salesRep && <Text fontSize="9px" color="gray.400" fontWeight="700">Superstockist PARTNER</Text>}
                               </VStack>
                            </HStack>
                         </Td>
                         <Td>
                            <Badge variant="solid" colorScheme={log.type.includes('In') ? 'green' : 'orange'} fontSize="9px">
                               {log.type}
                            </Badge>
                         </Td>
                         <Td isNumeric>
                            <Text fontWeight="800" color={log.type.includes('In') ? 'green.600' : 'orange.600'}>
                               {log.type.includes('In') ? '+' : '-'}{log.quantity}
                            </Text>
                         </Td>
                         <Td maxW="200px" isTruncated fontSize="xs" color="gray.600">
                            {log.reason}
                         </Td>
                         <Td>
                            <Text fontSize="xs" fontWeight="600">{log.adjustedBy?.name || 'Admin'}</Text>
                         </Td>
                      </Tr>
                   )) : (
                      <Tr>
                         <Td colSpan="7" textAlign="center" py="10" color="gray.400">No logs found.</Td>
                      </Tr>
                   )}
                </Tbody>
             </Table>
           )}
        </Box>
      </Box>
    </Layout>
  );
};

export default AdminInventoryLogs;

