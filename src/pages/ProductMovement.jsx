import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
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
  Icon,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  SimpleGrid,
  IconButton,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { 
  ArrowRight, 
  Package, 
  Calendar, 
  Truck, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  Download
} from 'lucide-react';
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ProductMovement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const { data } = await API.get('/analytics/movement');
      setMovements(data);
      if (isRefresh) {
        toast({
          title: "Feed Refreshed",
          description: "Bhai, product movement data has been updated.",
          status: "success",
          duration: 2000,
        });
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching movements",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleExport = () => {
    if (movements.length === 0) return;
    
    const headers = ['Movement ID', 'Time', 'Branch', 'Items', 'Value', 'Status'];
    const csvData = movements.map(m => [
      `MOV-${m.id.slice(-4).toUpperCase()}`,
      new Date(m.date).toLocaleTimeString(),
      m.branch,
      m.items,
      m.value,
      m.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Product_Movement_History_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, product movement history has been downloaded as CSV.",
      status: "success",
    });
  };

  const stats = [
    { label: 'In-Transit', value: movements.filter(m => m.status === 'Dispatched' || m.status === 'Pending').length, icon: Truck, color: 'blue' },
    { label: 'Successfully Received', value: movements.filter(m => m.status === 'Received').length, icon: CheckCircle2, color: 'green' },
    { label: 'Total Value', value: `₹${movements.reduce((sum, m) => sum + (m.value || 0), 0).toLocaleString()}`, icon: Package, color: 'orange' },
    { label: 'Pending Verification', value: movements.filter(m => m.status === 'Pending').length, icon: AlertCircle, color: 'red' },
  ];

  const filteredMovements = movements.filter(mov => 
    mov.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(mov => statusFilter === 'All' ? true : mov.status === statusFilter);

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
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Product Movement Tracker</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Real-time monitoring of stock transfers and inter-branch logistics</Text>
          </Box>
          <HStack spacing="3">
            <Button 
              leftIcon={<Calendar size={16} />} 
              variant="outline" 
              borderRadius="xl" 
              size="sm"
              onClick={() => navigate('/total-dispatch-stock')}
            >
              View History
            </Button>
            <Button 
              colorScheme="brand" 
              borderRadius="xl" 
              shadow="sm" 
              size="sm" 
              onClick={() => fetchMovements(true)}
              isLoading={refreshing}
            >
              Refresh Feed
            </Button>
          </HStack>
        </Flex>

        {/* Live Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="6" mb="10">
          {stats.map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
              <Flex align="center" gap="4">
                <Box bg={`${stat.color}.50`} p="3.5" borderRadius="16px" color={`${stat.color}.500`}>
                  <Icon as={stat.icon} fontSize="20" />
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                  <Heading size="sm" color="secondary" mt="1" fontWeight="700">{stat.value}</Heading>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
             <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                <HStack spacing="3">
                   <Heading size="xs" color="secondary" fontWeight="700">Live Movement Feed</Heading>
                   <Badge colorScheme="green" variant="subtle" borderRadius="full" px="2" py="0.5" fontSize="9px" fontWeight="700">Live</Badge>
                </HStack>
                <HStack spacing="3">
                   <InputGroup maxW="250px" size="sm">
                      <InputLeftElement pointerEvents="none">
                         <Search size={16} color="#919EAB" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search branch..." 
                        bg="white" 
                        border="1px solid" 
                        borderColor="gray.100" 
                        borderRadius="lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </InputGroup>
                                       <Menu>
                      <MenuButton 
                        as={Button} 
                        size="sm" 
                        variant="outline" 
                        leftIcon={<Filter size={16} />} 
                        rightIcon={<ChevronDown size={14} />}
                        borderRadius="xl" 
                        fontWeight="600"
                      >
                        Filter: {statusFilter}
                      </MenuButton>
                      <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                        <MenuItem fontSize="xs" fontWeight="700" onClick={() => setStatusFilter('All')}>All Movements</MenuItem>
                        <MenuDivider />
                        <MenuItem fontSize="xs" fontWeight="700" color="blue.500" onClick={() => setStatusFilter('Dispatched')}>Dispatched</MenuItem>
                        <MenuItem fontSize="xs" fontWeight="700" color="green.500" onClick={() => setStatusFilter('Received')}>Received</MenuItem>
                        <MenuItem fontSize="xs" fontWeight="700" color="orange.500" onClick={() => setStatusFilter('Pending')}>Pending</MenuItem>
                      </MenuList>
                    </Menu>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<Download size={16} />} 
                      borderRadius="xl" 
                      fontWeight="600"
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                </HStack>
             </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">ID & Time</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Transfer Path</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Total Items</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Consignment Value</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                  <Th color="gray.400" border="none" py="4" px="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMovements.length > 0 ? filteredMovements.map((mov) => (
                  <Tr key={mov.id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                       <VStack align="start" spacing="0">
                          <Text fontWeight="700" color="brand.500" fontSize="xs">MOV-{mov.id.slice(-4).toUpperCase()}</Text>
                          <HStack spacing="1">
                             <Icon as={Clock} size={10} color="gray.400" />
                             <Text fontSize="10px" color="gray.400" fontWeight="600">{new Date(mov.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                          </HStack>
                       </VStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="3">
                        <Badge variant="subtle" bg="blue.50" color="blue.600" borderRadius="md" px="2" py="0.5" fontSize="9px" fontWeight="700">
                           Main Warehouse
                        </Badge>
                        <Icon as={ArrowRight} size={12} color="gray.300" />
                        <Badge variant="subtle" bg="purple.50" color="purple.600" borderRadius="md" px="2" py="0.5" fontSize="9px" fontWeight="700">
                           {mov.branch}
                        </Badge>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" fontWeight="800" color="secondary">{mov.items} Units</Text></Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" fontWeight="800" color="brand.500">₹{mov.value.toLocaleString()}</Text></Td>
                    <Td borderColor="gray.100">
                      <Badge 
                        colorScheme={mov.status === 'Received' ? 'green' : mov.status === 'Dispatched' ? 'blue' : 'orange'} 
                        borderRadius="full" 
                        px="2.5"
                        py="0.5"
                        variant="subtle"
                        fontSize="9px"
                        fontWeight="700"
                      >
                         <HStack spacing="1">
                            <Box w="5px" h="5px" borderRadius="full" bg={mov.status === 'Received' ? 'green.500' : mov.status === 'Dispatched' ? 'blue.500' : 'orange.500'} />
                            <Text>{mov.status}</Text>
                         </HStack>
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" px="8">
                       <IconButton icon={<MoreVertical size={14} />} variant="ghost" size="xs" borderRadius="full" />
                    </Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan="6" textAlign="center" py="10" color="gray.400">No recent movements found</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default ProductMovement;
