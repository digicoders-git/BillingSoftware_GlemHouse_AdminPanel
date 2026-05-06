import React, { useState } from 'react';
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
  IconButton
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  Package, 
  Building, 
  ArrowUpRight,
  PieChart as PieIcon,
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

const ProductAllocation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const summaryStats = [
    { label: 'Total Allocated', value: '18,650', icon: Package, color: 'brand', trend: '+12%', isUp: true },
    { label: 'Top Branch', value: 'Central Plaza', icon: Building, color: 'blue', trend: 'Active', isUp: true },
    { label: 'Utilization', value: '82.5%', icon: Activity, color: 'green', trend: '+5%', isUp: true },
    { label: 'Understocked', value: '4 Branches', icon: Layers, color: 'red', trend: '-2%', isUp: false },
  ];

  const allocationData = [
    { id: 1, branch: 'Downtown Branch', category: 'Electronics', allocated: 450, total: 500, percentage: 90, status: 'Optimal' },
    { id: 2, branch: 'Westside Hub', category: 'Furniture', allocated: 210, total: 300, percentage: 70, status: 'Good' },
    { id: 3, branch: 'Central Plaza', category: 'Clothing', allocated: 920, total: 1000, percentage: 92, status: 'Critical' },
    { id: 4, branch: 'North Station', category: 'Electronics', allocated: 120, total: 200, percentage: 60, status: 'Low' },
    { id: 5, branch: 'East Coast', category: 'Accessories', allocated: 550, total: 600, percentage: 91, status: 'Optimal' },
  ];

  const chartData = [
    { name: 'Electronics', value: 400 },
    { name: 'Furniture', value: 300 },
    { name: 'Clothing', value: 300 },
    { name: 'Accessories', value: 200 },
  ];

  const barData = [
    { name: 'Downtown', stock: 450 },
    { name: 'Westside', stock: 210 },
    { name: 'Central', stock: 920 },
    { name: 'North', stock: 120 },
    { name: 'East', stock: 550 },
  ];

  const COLORS = ['#FF9F43', '#3182ce', '#38a169', '#805ad5'];

  const filteredData = allocationData.filter(item => 
    item.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button colorScheme="brand" borderRadius="xl" shadow="sm" size="sm">Export Analytics</Button>
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
                  <Heading size="md" color="secondary" mt="1" fontWeight="700">{stat.value}</Heading>
               </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6" mb="10">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" overflow="hidden">
              <Box p="6" borderBottom="1px solid" borderColor="gray.50">
                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                  <Heading size="xs" color="secondary" fontWeight="700">Live Allocation Feed</Heading>
                  <InputGroup maxW={{ base: 'full', md: '250px' }} size="sm">
                    <InputLeftElement pointerEvents="none">
                      <Search size={16} color="#919EAB" />
                    </InputLeftElement>
                    <Input 
                      placeholder="Search..." 
                      bg="gray.50" 
                      border="none" 
                      borderRadius="lg" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Flex>
              </Box>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="gray.50/50">
                    <Tr>
                      <Th color="gray.400" border="none" py="4" fontSize="10px">Branch</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px">Category</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px">Capacity</Th>
                      <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                      <Th color="gray.400" border="none" py="4"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50/30' }} cursor="pointer">
                        <Td borderColor="gray.100" py="4">
                          <HStack spacing="3">
                             <Avatar size="xs" name={item.branch} bg="secondary" color="white" />
                             <VStack align="start" spacing="0">
                                <Text fontWeight="700" color="secondary" fontSize="xs">{item.branch}</Text>
                                <Text fontSize="10px" color="gray.400">Active Consignment</Text>
                             </VStack>
                          </HStack>
                        </Td>
                        <Td borderColor="gray.100">
                           <Badge colorScheme="blue" variant="subtle" borderRadius="full" px="2" fontSize="9px" fontWeight="700">{item.category}</Badge>
                        </Td>
                        <Td borderColor="gray.100">
                          <VStack align="stretch" spacing="1" minW="120px">
                            <Flex justify="space-between">
                              <Text fontSize="10px" fontWeight="800" color="secondary">{item.percentage}%</Text>
                              <Text fontSize="10px" color="gray.400" fontWeight="600">{item.allocated} / {item.total}</Text>
                            </Flex>
                            <Progress 
                              value={item.percentage} 
                              size="xs" 
                              borderRadius="full" 
                              colorScheme={item.percentage > 90 ? 'red' : item.percentage > 70 ? 'brand' : 'green'} 
                            />
                          </VStack>
                        </Td>
                        <Td borderColor="gray.100">
                           <Badge 
                            borderRadius="full" 
                            px="2" 
                            fontSize="9px"
                            fontWeight="700"
                            bg={item.status === 'Critical' ? 'red.50' : item.status === 'Optimal' ? 'green.50' : 'orange.50'}
                            color={item.status === 'Critical' ? 'red.600' : item.status === 'Optimal' ? 'green.600' : 'orange.600'}
                           >
                              {item.status}
                           </Badge>
                        </Td>
                        <Td borderColor="gray.100">
                           <IconButton icon={<ArrowRight size={14} />} size="xs" variant="ghost" color="gray.400" borderRadius="full" />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <VStack spacing="6" align="stretch">
               <Box className="premium-card" p="6">
                  <Heading size="xs" mb="6" color="secondary" fontWeight="700">Category Split</Heading>
                  <Box h="200px">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={chartData}
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </Box>
                  <SimpleGrid columns={2} spacing="3" mt="4">
                     {chartData.map((item, idx) => (
                        <HStack key={idx} spacing="2">
                           <Box w="2" h="2" borderRadius="full" bg={COLORS[idx]} />
                           <Text fontSize="10px" fontWeight="600" color="gray.500">{item.name}</Text>
                        </HStack>
                     ))}
                  </SimpleGrid>
               </Box>

               <Box className="premium-card" p="6">
                  <Heading size="xs" mb="6" color="secondary" fontWeight="700">Stock by Branch</Heading>
                  <Box h="200px">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 600}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 600}} />
                           <Tooltip />
                           <Bar dataKey="stock" fill="#FF9F43" radius={[3, 3, 0, 0]} barSize={20} />
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
