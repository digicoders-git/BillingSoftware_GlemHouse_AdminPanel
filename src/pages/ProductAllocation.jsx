import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Grid, 
  GridItem,
  Icon,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Avatar,
  SimpleGrid,
  IconButton,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { 
  Package, 
  Building, 
  ArrowUpRight,
  Search,
  Filter,
  ArrowRight,
  Activity,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import Layout from '../components/Layout';
import API from '../utils/api';

const ProductAllocation = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    branchAllocation: [],
    categoryData: [],
    barData: [],
    stats: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchAllocationData();
  }, []);

  const fetchAllocationData = async () => {
    try {
      const { data } = await API.get('/analytics/allocation');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching analytics",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const COLORS = ['#298AC6', '#3182ce', '#38a169', '#805ad5', '#d69e2e'];

  const filteredData = data.branchAllocation.filter(item => 
    item.branch.toLowerCase().includes(searchTerm.toLowerCase())
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

  const summaryStats = [
    { label: 'Total Allocated', value: data.stats.totalAllocated.toLocaleString(), icon: Package, color: 'brand', trend: '+12%', isUp: true },
    { label: 'Top Branch', value: data.stats.topBranch, icon: Building, color: 'blue', trend: 'Active', isUp: true },
    { label: 'Utilization', value: data.stats.utilization, icon: Activity, color: 'green', trend: '+5%', isUp: true },
    { label: 'Understocked', value: `${data.stats.understocked} Branches`, icon: Layers, color: 'red', trend: '-2%', isUp: false },
  ];

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Branch Allocation Tracking</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Analyze stock distribution and utilization across your network</Text>
          </Box>
          <HStack spacing="3">
            <Button leftIcon={<Filter size={16} />} variant="outline" borderRadius="xl" size="sm">Advanced Filters</Button>
            <Button colorScheme="brand" borderRadius="xl" shadow="sm" size="sm" onClick={fetchAllocationData}>Refresh Data</Button>
          </HStack>
        </Flex>

        {/* Dynamic Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="10">
          {summaryStats.map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
               <Flex justify="space-between" align="start" mb="4">
                  <Box bg={`${stat.color}.50`} p="3" borderRadius="16px" color={`${stat.color}.500`}>
                     <Icon as={stat.icon} boxSize="5" />
                  </Box>
                  <HStack spacing="1" color={stat.isUp ? "green.500" : "red.500"}>
                     <Icon as={stat.isUp ? ArrowUpRight : ArrowDownRight} size={12} />
                     <Text fontSize="10px" fontWeight="700">{stat.trend}</Text>
                  </HStack>
               </Flex>
               <VStack align="start" spacing="0">
                  <Text fontSize="10px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                  <Heading size="sm" color="secondary" mt="1" fontWeight="700">{stat.value}</Heading>
               </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap="6" mb="10">
          {/* Main Table Section */}
          <GridItem colSpan={{ base: 12, lg: 8 }}>
            <Box className="premium-card" height="100%" display="flex" flexDirection="column">
              <Box p="6" borderBottom="1px solid" borderColor="gray.50">
                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                  <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="900" textTransform="uppercase" letterSpacing="1px">Branch Distribution</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="600">Current inventory levels across all locations</Text>
                  </VStack>
                  <InputGroup maxW={{ base: 'full', md: '250px' }} size="sm">
                    <InputLeftElement pointerEvents="none">
                      <Search size={16} color="#919EAB" />
                    </InputLeftElement>
                    <Input 
                      placeholder="Search branch..." 
                      bg="gray.50" 
                      border="1px solid" 
                      borderColor="gray.100"
                      borderRadius="xl" 
                      _focus={{ bg: 'white', borderColor: 'brand.500', shadow: 'sm' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Flex>
              </Box>
              <Box overflowX="auto" flex="1">
                <Table variant="simple">
                  <Thead bg="gray.50/30">
                    <Tr>
                      <Th color="gray.400" border="none" py="4" px="8" fontSize="10px" fontWeight="800">BRANCH NAME</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" fontWeight="800">ALLOCATION LEVEL</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px" fontWeight="800">STATUS</Th>
                      <Th color="gray.400" border="none" py="4" px="8"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.length > 0 ? filteredData.map((item, idx) => (
                      <Tr key={idx} _hover={{ bg: 'gray.50/50' }} transition="all 0.2s">
                        <Td borderColor="gray.50" py="5" px="8">
                          <HStack spacing="4">
                             <Box position="relative">
                               <Avatar size="sm" name={item.branch} bg="secondary" color="white" borderRadius="12px" />
                               <Box position="absolute" bottom="-1px" right="-1px" w="10px" h="10px" bg="green.500" borderRadius="full" border="2px solid white" />
                             </Box>
                             <VStack align="start" spacing="0">
                                <Text fontWeight="800" color="secondary" fontSize="sm">{item.branch}</Text>
                                <Text fontSize="10px" color="gray.400" fontWeight="700">REF: {item.branchId}</Text>
                             </VStack>
                          </HStack>
                        </Td>
                        <Td borderColor="gray.50">
                          <VStack align="stretch" spacing="2" minW="180px">
                            <Flex justify="space-between" align="center">
                              <Text fontSize="11px" fontWeight="900" color="secondary">{item.percentage}% Full</Text>
                              <Badge variant="ghost" colorScheme="gray" fontSize="9px" fontWeight="800" textTransform="none">{item.allocated} Units Total</Badge>
                            </Flex>
                            <Progress 
                              value={item.percentage} 
                              size="xs" 
                              borderRadius="full" 
                              bg="gray.100"
                              colorScheme={item.percentage > 90 ? 'red' : item.percentage > 70 ? 'brand' : 'green'} 
                            />
                          </VStack>
                        </Td>
                        <Td borderColor="gray.50">
                           <Badge 
                            borderRadius="lg" 
                            px="3" 
                            py="1"
                            fontSize="9px"
                            fontWeight="800"
                            variant="subtle"
                            colorScheme={item.status === 'Critical' ? 'red' : item.status === 'Optimal' ? 'green' : 'orange'}
                           >
                              {item.status.toUpperCase()}
                           </Badge>
                        </Td>
                        <Td borderColor="gray.50" px="8" textAlign="right">
                           <IconButton icon={<ArrowRight size={14} />} size="xs" variant="ghost" color="gray.400" borderRadius="full" _hover={{ bg: 'brand.50', color: 'brand.500' }} />
                        </Td>
                      </Tr>
                    )) : (
                      <Tr><Td colSpan="4" textAlign="center" py="20" color="gray.400">No matching Branches found</Td></Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </GridItem>

          {/* Charts Section */}
          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <VStack spacing="6" align="stretch" height="100%">
               <Box className="premium-card" p="6" flex="1">
                  <VStack align="start" spacing="0" mb="6">
                    <Heading size="xs" color="secondary" fontWeight="900" textTransform="uppercase" letterSpacing="1px">Inventory Split</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="600">Allocation by product category</Text>
                  </VStack>
                  <Box h="220px" position="relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={data.categoryData}
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                           >
                              {data.categoryData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     <VStack position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" spacing="0">
                        <Text fontSize="20px" fontWeight="900" color="secondary">{data.stats.totalAllocated}</Text>
                        <Text fontSize="8px" fontWeight="800" color="gray.400" textTransform="uppercase">Total</Text>
                     </VStack>
                  </Box>
                  <SimpleGrid columns={1} spacing="2" mt="4">
                     {data.categoryData.map((item, idx) => (
                        <Flex key={idx} justify="space-between" align="center" p="2" borderRadius="xl" _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                           <HStack spacing="3">
                              <Box w="8px" h="8px" borderRadius="full" bg={COLORS[idx]} shadow={`0 0 10px ${COLORS[idx]}40`} />
                              <Text fontSize="11px" fontWeight="700" color="gray.600">{item.name}</Text>
                           </HStack>
                           <Text fontSize="11px" fontWeight="800" color="secondary">{item.value}%</Text>
                        </Flex>
                     ))}
                  </SimpleGrid>
               </Box>

               <Box className="premium-card" p="6" flex="1">
                  <VStack align="start" spacing="0" mb="6">
                    <Heading size="xs" color="secondary" fontWeight="900" textTransform="uppercase" letterSpacing="1px">Top Branches</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="600">Comparing stock across top locations</Text>
                  </VStack>
                  <Box h="200px">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.barData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#919EAB'}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#919EAB'}} />
                           <Tooltip 
                            cursor={{fill: '#f8f9fa'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                           />
                           <Bar dataKey="stock" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={24} />
                           <defs>
                             <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#298AC6" />
                               <stop offset="100%" stopColor="#298AC640" />
                             </linearGradient>
                           </defs>
                        </BarChart>
                     </ResponsiveContainer>
                  </Box>
               </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ProductAllocation;
