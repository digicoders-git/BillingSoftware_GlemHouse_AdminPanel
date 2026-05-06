import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  HStack,
  Button,
  Grid,
  GridItem,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  SimpleGrid,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Progress
} from '@chakra-ui/react';
import { 
  Calendar, 
  Filter, 
  Download, 
  TrendingUp,
  Truck,
  Package,
  MapPin,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Activity,
  ArrowRight
} from 'lucide-react';
import Layout from '../components/Layout';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { date: 'Oct 20', count: 120, value: 12000 },
  { date: 'Oct 21', count: 150, value: 15000 },
  { date: 'Oct 22', count: 80, value: 8000 },
  { date: 'Oct 23', count: 200, value: 20000 },
  { date: 'Oct 24', count: 170, value: 17000 },
  { date: 'Oct 25', count: 250, value: 25000 },
  { date: 'Oct 26', count: 210, value: 21000 },
];

const COLORS = ['#FF9F43', '#3182ce', '#38a169', '#E53E3E'];

const DispatchSummary = () => {
  const [filterBranch, setFilterBranch] = useState('All');

  const branchData = [
    { name: 'Downtown Branch', count: 450, value: '$45,000', growth: '+12%', items: 'Electronic Gadgets', status: 'Delivered' },
    { name: 'Westside Hub', count: 320, value: '$32,000', growth: '+8%', items: 'Office Stationery', status: 'In Transit' },
    { name: 'Central Plaza', count: 680, value: '$68,000', growth: '+25%', items: 'Apparel & Shoes', status: 'Pending' },
    { name: 'North Station', count: 210, value: '$21,000', growth: '-5%', items: 'Kitchen Appliances', status: 'Delivered' },
    { name: 'East Coast', count: 550, value: '$55,000', growth: '+18%', items: 'Furniture', status: 'In Transit' },
  ];

  const summaryStats = [
    { label: 'Avg daily Dispatch', value: '168 Units', icon: Activity, color: 'brand', trend: '+5.2%' },
    { label: 'Total Value (MTD)', value: '$116,000', icon: TrendingUp, color: 'green', trend: '+18.4%' },
    { label: 'Active Shipments', value: '14 Trucks', icon: Truck, color: 'blue', trend: 'Normal' },
    { label: 'Failed/Cancelled', value: '3 Records', icon: Package, color: 'red', trend: '-1.2%' },
  ];

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ base: 'start', lg: 'center' }} mb="10" gap="6">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Dispatch Master Summary</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Overview of shipment patterns by date and branch location</Text>
          </Box>
          <HStack flexWrap="wrap" spacing="2">
            <InputGroup maxW="160px" size="sm">
               <InputLeftElement pointerEvents="none">
                  <Calendar size={14} color="#FF9F43" />
               </InputLeftElement>
               <Input type="date" borderRadius="lg" bg="white" border="1px solid" borderColor="gray.100" fontSize="11px" />
            </InputGroup>
            <Button size="sm" variant="outline" leftIcon={<Filter size={16} />} borderRadius="lg" fontWeight="600">Filter</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} borderRadius="lg" shadow="sm" fontWeight="600">Export Report</Button>
          </HStack>
        </Flex>

        {/* Quick Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="10">
          {summaryStats.map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
               <Flex justify="space-between" align="start" mb="4">
                  <Box bg={`${stat.color}.50`} p="3" borderRadius="16px" color={`${stat.color}.500`}>
                     <Icon as={stat.icon} fontSize="18" />
                  </Box>
                  <Badge variant="ghost" colorScheme={stat.trend.startsWith('+') ? 'green' : 'red'} fontSize="9px" fontWeight="700">
                     {stat.trend}
                  </Badge>
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
            <Box className="premium-card" p="6">
              <Flex justify="space-between" align="center" mb="6">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Date-wise Dispatch Trend</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Volume and Value comparison over time</Text>
                 </VStack>
                 <HStack bg="gray.50" p="1" borderRadius="lg">
                    <Button size="xs" variant="ghost" fontSize="10px">Qty</Button>
                    <Button size="xs" colorScheme="brand" borderRadius="md" px="3" fontSize="10px">Value</Button>
                 </HStack>
              </Flex>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#FF9F43" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#FF9F43" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
             <Box className="premium-card" p="6">
                <Heading size="xs" mb="6" color="secondary" fontWeight="700">Dispatch Distribution</Heading>
                <VStack spacing="5" align="stretch">
                   {branchData.slice(0, 4).map((branch, idx) => (
                      <VStack key={idx} align="stretch" spacing="1.5">
                         <Flex justify="space-between" align="center">
                            <Text fontSize="xs" fontWeight="700" color="secondary">{branch.name}</Text>
                            <Text fontSize="10px" fontWeight="800" color="brand.500">{branch.value}</Text>
                         </Flex>
                         <Progress 
                           value={(branch.count / 700) * 100} 
                           size="xs" 
                           borderRadius="full" 
                           colorScheme={idx === 0 ? 'blue' : idx === 1 ? 'orange' : idx === 2 ? 'green' : 'purple'} 
                         />
                         <Flex justify="space-between">
                            <Text fontSize="9px" color="gray.400" fontWeight="600">{branch.items}</Text>
                            <HStack spacing="1">
                               <Icon as={ArrowUpRight} size={10} color="green.500" />
                               <Text fontSize="9px" color="green.500" fontWeight="700">{branch.growth}</Text>
                            </HStack>
                         </Flex>
                      </VStack>
                   ))}
                </VStack>
                <Button w="full" mt="6" variant="ghost" size="xs" colorScheme="brand" rightIcon={<ArrowRight size={12} />} fontSize="10px" fontWeight="700">
                   Detailed Analytics
                </Button>
             </Box>
          </GridItem>
        </Grid>

        <Box className="premium-card" overflow="hidden">
           <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
              <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Branch Detailed Analysis</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Inventory allocation and status overview</Text>
                 </VStack>
                 <HStack spacing="3">
                    <Select placeholder="All Branches" size="xs" borderRadius="lg" maxW="150px" bg="white" fontSize="10px">
                       <option>Downtown Branch</option>
                       <option>Westside Hub</option>
                       <option>Central Plaza</option>
                    </Select>
                    <InputGroup maxW="200px" size="xs">
                       <InputLeftElement pointerEvents="none">
                          <Search size={14} color="#919EAB" />
                       </InputLeftElement>
                       <Input placeholder="Search..." borderRadius="lg" bg="white" fontSize="10px" />
                    </InputGroup>
                 </HStack>
              </Flex>
           </Box>
           <Box overflowX="auto">
              <Table variant="simple">
                 <Thead bg="gray.50/50">
                    <Tr>
                       <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Branch Name</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Category</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Units</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Value</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                       <Th color="gray.400" border="none" py="4" px="8"></Th>
                    </Tr>
                 </Thead>
                 <Tbody>
                    {branchData.map((branch, idx) => (
                       <Tr key={idx} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                          <Td borderColor="gray.100" py="4" px="8">
                             <HStack spacing="2">
                                <Avatar size="xs" name={branch.name} bg="secondary" color="white" />
                                <Text fontWeight="700" color="secondary" fontSize="xs">{branch.name}</Text>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100"><Text fontSize="11px" color="gray.600" fontWeight="600">{branch.items}</Text></Td>
                          <Td borderColor="gray.100"><Text fontWeight="700" fontSize="xs">{branch.count}</Text></Td>
                          <Td borderColor="gray.100"><Text fontWeight="700" color="brand.500" fontSize="xs">{branch.value}</Text></Td>
                          <Td borderColor="gray.100">
                             <Badge 
                                colorScheme={branch.status === 'Delivered' ? 'green' : branch.status === 'In Transit' ? 'blue' : 'orange'} 
                                borderRadius="full" 
                                px="2.5" 
                                py="0.5"
                                fontSize="9px"
                                variant="subtle"
                                fontWeight="700"
                             >
                                {branch.status}
                             </Badge>
                          </Td>
                          <Td borderColor="gray.100" px="8">
                             <Button size="xs" variant="ghost" colorScheme="blue" fontSize="10px">View Log</Button>
                          </Td>
                       </Tr>
                    ))}
                 </Tbody>
              </Table>
           </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DispatchSummary;
