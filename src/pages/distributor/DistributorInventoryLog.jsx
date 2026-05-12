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
  Badge, 
  HStack, 
  Flex, 
  useToast,
  Spinner,
  Icon,
  VStack,
  Select,
  Input
} from '@chakra-ui/react';
import { History, ArrowDownLeft, ArrowUpRight, Search, Calendar } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const DistributorInventoryLog = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/inventory/logs');
      setLogs(data || []);
    } catch (error) {
      toast({
        title: "Error loading logs",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                       (filterType === 'in' && log.type === 'Stock In') ||
                       (filterType === 'out' && log.type === 'Stock Out');
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Stock Movement Log</Heading>
            <Text color="gray.500" fontWeight="500">Track all incoming and outgoing stock entries</Text>
          </Box>
          <HStack spacing="4" w={{ base: 'full', md: 'auto' }}>
            <Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              bg="white" 
              borderRadius="xl" 
              w="150px"
              shadow="sm"
            >
              <option value="all">All Logs</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </Select>
            <Box position="relative" w={{ base: 'full', md: '250px' }}>
              <Input 
                placeholder="Search logs..." 
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
          </HStack>
        </Flex>

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
                    <Th py="5">Type</Th>
                    <Th py="5">Product</Th>
                    <Th py="5">Quantity</Th>
                    <Th py="5">Reason / Reference</Th>
                    <Th py="5">Date & Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredLogs.map((log) => (
                    <Tr key={log._id} _hover={{ bg: 'gray.50/50' }}>
                      <Td>
                        <HStack>
                          <Icon 
                            as={log.type === 'Stock In' ? ArrowDownLeft : ArrowUpRight} 
                            color={log.type === 'Stock In' ? 'green.500' : 'red.500'} 
                            size={18}
                          />
                          <Badge 
                            colorScheme={log.type === 'Stock In' ? 'green' : 'red'} 
                            variant="subtle" 
                            borderRadius="full" 
                            px="3"
                          >
                            {log.type}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontWeight="800" color="secondary" fontSize="sm">{log.product?.name || 'Deleted Product'}</Text>
                        <Text fontSize="xs" color="gray.400">{log.product?.sku || 'N/A'}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="900" fontSize="md" color={log.type === 'Stock In' ? 'green.600' : 'red.600'}>
                          {log.type === 'Stock In' ? '+' : '-'}{log.quantity}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="xs" fontWeight="600" color="gray.600">{log.reason}</Text>
                      </Td>
                      <Td>
                        <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="700" color="secondary">{moment(log.createdAt).format('DD MMM YYYY')}</Text>
                          <Text fontSize="10px" color="gray.400">{moment(log.createdAt).format('hh:mm A')}</Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {filteredLogs.length === 0 && (
                 <Flex direction="column" align="center" py="20">
                    <Icon as={History} size={40} color="gray.200" mb="4" />
                    <Text color="gray.400" fontWeight="600">No movement logs found</Text>
                 </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default DistributorInventoryLog;
