import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Grid,
  SimpleGrid,
  Icon,
  Badge,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Progress,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react';
import { 
  Search, 
  Download, 
  TrendingUp, 
  BarChart2, 
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  MoreVertical,
  Calendar,
  Filter,
  Eye,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Layout from '../../components/Layout';

const productSalesData = [
  { name: 'iPhone 15 Pro', sales: 45, revenue: 44955, growth: 12.5, status: 'Increasing' },
  { name: 'MacBook Air M2', sales: 28, revenue: 36372, growth: 8.2, status: 'Stable' },
  { name: 'AirPods Pro 2', sales: 156, revenue: 38844, growth: 25.4, status: 'Increasing' },
  { name: 'iPad Pro', sales: 15, revenue: 11985, growth: -5.1, status: 'Decreasing' },
  { name: 'Apple Watch S9', sales: 54, revenue: 21546, growth: 15.8, status: 'Increasing' },
  { name: 'USB-C Adapter', sales: 210, revenue: 3990, growth: 2.1, status: 'Stable' },
];

const weeklyData = [
  { day: 'Mon', sales: 12, revenue: 12000 },
  { day: 'Tue', sales: 19, revenue: 18000 },
  { day: 'Wed', sales: 15, revenue: 15000 },
  { day: 'Thu', sales: 22, revenue: 21000 },
  { day: 'Fri', sales: 30, revenue: 28000 },
  { day: 'Sat', sales: 45, revenue: 42000 },
  { day: 'Sun', sales: 38, revenue: 35000 },
];

const BranchProductWiseSales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProducts = productSalesData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box pb="10">
        {/* Header Section */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Product Sales Tracking</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Analyze individual product performance and sales velocity</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Calendar size={16} />} variant="outline" borderRadius="xl" size="sm">Custom Date</Button>
            <Button leftIcon={<Download size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" size="sm">Export report</Button>
          </HStack>
        </Flex>

        {/* Top Performing Highlights */}
        <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} spacing="6" mb="10">
           {[
              { label: 'MOST SOLD', name: 'AirPods Pro 2', value: '156 Units', revenue: '$38.8k', trend: '+25%', color: 'green', icon: ShoppingBag },
              { label: 'TOP REVENUE', name: 'iPhone 15 Pro', value: '45 Units', revenue: '$44.9k', trend: '+12%', color: 'blue', icon: TrendingUp },
              { label: 'DAILY SPEED', name: '8.4 Units', value: 'Avg Sales', revenue: '92%', trend: 'Good', color: 'orange', icon: BarChart2 },
              { label: 'GROWTH', name: '+18.2%', value: 'This Month', revenue: 'Report', trend: 'Up', color: 'brand', icon: TrendingUp, isDark: true },
           ].map((stat, idx) => (
              <Box key={idx} className="premium-card" p="5" position="relative" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }} bg={stat.isDark ? 'brand.500' : 'white'} color={stat.isDark ? 'white' : 'inherit'}>
                 <VStack align="start" spacing="3">
                    <Badge bg={stat.isDark ? 'whiteAlpha.200' : `${stat.color}.50`} color={stat.isDark ? 'white' : `${stat.color}.600`} borderRadius="full" px="2.5" py="0.5" fontSize="9px" fontWeight="700">{stat.label}</Badge>
                    <Box>
                       <Heading size="xs" fontWeight="700">{stat.name}</Heading>
                       <Text fontSize="10px" opacity="0.6" fontWeight="600" mt="0.5">{stat.value}</Text>
                    </Box>
                    <HStack spacing="2">
                       <Text fontSize="xl" fontWeight="800" color={stat.isDark ? 'white' : 'brand.500'}>{stat.revenue}</Text>
                       {stat.trend && !stat.isDark && <Badge colorScheme="green" variant="ghost" fontSize="10px" fontWeight="700">{stat.trend}</Badge>}
                    </HStack>
                 </VStack>
              </Box>
           ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6" mb="10">
           {/* Weekly Sales Trend Chart */}
           <Box gridColumn={{ lg: "span 2" }} className="premium-card" p="6">
              <Flex justify="space-between" align="center" mb="6">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Weekly Sales Velocity</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Daily units sold across products</Text>
                 </VStack>
                 <Select maxW="130px" borderRadius="lg" size="xs" bg="gray.50" fontWeight="600">
                    <option>This Week</option>
                    <option>Last Week</option>
                 </Select>
              </Flex>
              <Box h="300px">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                       <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#FF9F43" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 10, fontWeight: 600}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 10, fontWeight: 600}} />
                       <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                       <Area type="monotone" dataKey="sales" stroke="#FF9F43" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </Box>
           </Box>

           {/* Quick Action Panel */}
           <Box className="premium-card" p="6" bg="secondary" color="white">
              <VStack align="stretch" spacing="5">
                 <Heading size="xs" fontWeight="700">Sales Insights</Heading>
                 <Box p="4" bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack align="start" spacing="3">
                       <Icon as={TrendingUp} size={16} color="brand.400" mt="1" />
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="700">High Demand Alert!</Text>
                          <Text fontSize="10px" opacity="0.7">AirPods Pro 2 is selling 30% faster than usual.</Text>
                       </VStack>
                    </HStack>
                 </Box>
                 <Box p="4" bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack align="start" spacing="3">
                       <Icon as={ArrowDownRight} size={16} color="blue.400" mt="1" />
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="700">Slow Mover</Text>
                          <Text fontSize="10px" opacity="0.7">iPad Pro has seen a decline. Consider a promotion.</Text>
                       </VStack>
                    </HStack>
                 </Box>
                 <Button colorScheme="brand" size="sm" borderRadius="lg" mt="2" rightIcon={<ArrowRight size={16} />}>
                    View Analysis
                 </Button>
              </VStack>
           </Box>
        </Grid>

        {/* Product Sales Detailed Table */}
        <Box className="premium-card" overflow="hidden">
           <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
              <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Performance Log</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Detailed unit and revenue tracking</Text>
                 </VStack>
                 <HStack spacing="3">
                    <InputGroup maxW="250px" size="sm">
                       <InputLeftElement pointerEvents="none">
                          <Search size={16} color="#919EAB" />
                       </InputLeftElement>
                       <Input 
                          placeholder="Search products..." 
                          bg="white" 
                          borderRadius="lg" 
                          border="1px solid" 
                          borderColor="gray.100"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </InputGroup>
                    <Button leftIcon={<Filter size={16} />} variant="outline" borderRadius="lg" size="sm" px="4">Filters</Button>
                 </HStack>
              </Flex>
           </Box>

           <Box overflowX="auto">
              <Table variant="simple">
                 <Thead bg="gray.50/50">
                    <Tr>
                       <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Product</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Units</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Revenue</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Trend</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                       <Th color="gray.400" border="none" py="4" px="8"></Th>
                    </Tr>
                 </Thead>
                 <Tbody>
                    {filteredProducts.map((product, idx) => (
                       <Tr key={idx} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                          <Td borderColor="gray.100" py="4" px="8">
                             <HStack spacing="3">
                                <Avatar size="xs" icon={<ShoppingBag size={14} />} bg="brand.50" color="brand.500" borderRadius="lg" />
                                <Text fontWeight="700" color="secondary" fontSize="xs">{product.name}</Text>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <VStack align="start" spacing="1">
                                <Text fontWeight="800" fontSize="xs">{product.sales}</Text>
                                <Progress value={(product.sales / 250) * 100} size="xs" w="60px" colorScheme="brand" borderRadius="full" />
                             </VStack>
                          </Td>
                          <Td borderColor="gray.100"><Text fontWeight="700" color="secondary" fontSize="xs">${product.revenue.toLocaleString()}</Text></Td>
                          <Td borderColor="gray.100">
                             <HStack spacing="1" color={product.growth > 0 ? 'green.500' : 'red.500'}>
                                <Icon as={product.growth > 0 ? ArrowUpRight : ArrowDownRight} size={12} />
                                <Text fontWeight="700" fontSize="10px">{Math.abs(product.growth)}%</Text>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <Badge 
                                colorScheme={product.status === 'Increasing' ? 'green' : product.status === 'Stable' ? 'blue' : 'red'} 
                                variant="subtle" 
                                borderRadius="full" 
                                px="2" 
                                py="0.5" 
                                fontSize="9px" 
                                fontWeight="700"
                             >
                                {product.status}
                             </Badge>
                          </Td>
                          <Td borderColor="gray.100" py="4" px="8" textAlign="right">
                             <HStack justify="flex-end" spacing="1">
                                <IconButton aria-label="View" icon={<Eye size={14} />} variant="ghost" size="xs" color="gray.400" borderRadius="full" />
                                <IconButton aria-label="Actions" icon={<MoreVertical size={14} />} variant="ghost" size="xs" borderRadius="full" />
                             </HStack>
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

export default BranchProductWiseSales;
