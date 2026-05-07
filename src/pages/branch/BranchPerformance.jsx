import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Grid,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Badge,
  VStack,
  Divider,
  Progress,
  Avatar,
  AvatarGroup,
  useToast
} from '@chakra-ui/react';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart2, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Users,
  ShoppingBag,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import Layout from '../../components/Layout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, target: 2400 },
  { name: 'Tue', revenue: 3000, target: 1398 },
  { name: 'Wed', revenue: 5000, target: 3800 },
  { name: 'Thu', revenue: 2780, target: 3908 },
  { name: 'Fri', revenue: 1890, target: 4800 },
  { name: 'Sat', revenue: 2390, target: 3800 },
  { name: 'Sun', revenue: 3490, target: 4300 },
];

const categoryData = [
  { name: 'Mobile', value: 45 },
  { name: 'Laptop', value: 25 },
  { name: 'Audio', value: 20 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#298AC6', '#00CFE8', '#222021', '#28C76F'];

const BranchPerformance = () => {
  const [timeRange, setTimeRange] = useState('Weekly');
  const toast = useToast();

  const handleExport = () => {
    const headers = ['Day', 'Revenue', 'Target'];
    const csvData = data.map(row => [
      row.name,
      row.revenue,
      row.target
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Branch_Performance_Data_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, performance analytics has been downloaded as CSV.",
      status: "success",
    });
  };

  return (
    <Layout>
      <Box>
        {/* Header Section */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <HStack spacing="3" mb="1">
               <Box p="2" bg="brand.50" borderRadius="xl" color="brand.500">
                  <TrendingUp size={24} />
               </Box>
               <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Branch Analytics Hub</Heading>
            </HStack>
            <Text color="gray.500" fontWeight="500" ml="12">Detailed performance tracking for Westside Branch</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <HStack bg="background" p="1" borderRadius="2xl" border="1px solid" borderColor="gray.100">
               {['Daily', 'Weekly', 'Monthly'].map((range) => (
                  <Button 
                    key={range}
                    size="sm" 
                    variant={timeRange === range ? 'solid' : 'ghost'} 
                    colorScheme={timeRange === range ? 'brand' : 'gray'}
                    borderRadius="xl"
                    onClick={() => setTimeRange(range)}
                    fontSize="xs"
                    fontWeight="800"
                  >
                    {range}
                  </Button>
               ))}
            </HStack>
            <Button leftIcon={<Download size={18} />} colorScheme="brand" borderRadius="2xl" shadow="lg" px="6" onClick={handleExport}>Export</Button>
          </HStack>
        </Flex>

        {/* Unique Performance Stats */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="6" mb="10">
          {[
            { label: 'Total Sales', value: '₹1,28,450', trend: 'increase', percentage: '12.5%', icon: ShoppingBag, color: 'brand' },
            { label: 'Avg Order Value', value: '₹450.20', trend: 'increase', percentage: '5.2%', icon: Zap, color: 'blue' },
            { label: 'Customer Growth', value: '1,240', trend: 'increase', percentage: '8.4%', icon: Users, color: 'green' },
            { label: 'Conversion Rate', value: '64.2%', trend: 'decrease', percentage: '2.1%', icon: Target, color: 'orange' },
          ].map((stat, idx) => (
            <Box key={idx} className="premium-card" p="6" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex justify="space-between" align="start" mb="4">
                <Box p="3" borderRadius="20px" bg={`${stat.color}.50`} color={`${stat.color}.500`}>
                   <Icon as={stat.icon} size={22} />
                </Box>
                <Badge colorScheme={stat.trend === 'increase' ? 'green' : 'red'} variant="subtle" borderRadius="full" px="2" py="1" fontSize="10px">
                   <HStack spacing="1">
                      <Icon as={stat.trend === 'increase' ? ArrowUpRight : ArrowDownRight} size={10} />
                      <Text>{stat.percentage}</Text>
                   </HStack>
                </Badge>
              </Flex>
              <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">{stat.label}</Text>
              <Heading size="lg" mt="1" color="secondary" fontWeight="900" letterSpacing="-1px">{stat.value}</Heading>
            </Box>
          ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8" mb="10">
           {/* Revenue vs Target Analysis */}
           <Box gridColumn={{ lg: "span 2" }} className="premium-card" p="8">
              <Flex justify="space-between" align="center" mb="8">
                 <VStack align="start" spacing="0">
                    <Heading size="md" color="secondary" fontWeight="900">Revenue Flow Analysis</Heading>
                    <Text fontSize="sm" color="gray.400">Comparing actual revenue against branch targets</Text>
                 </VStack>
                 <HStack spacing="4">
                    <HStack spacing="1">
                       <Box w="8px" h="8px" borderRadius="full" bg="brand.400" />
                       <Text fontSize="xs" fontWeight="700" color="gray.500">Revenue</Text>
                    </HStack>
                    <HStack spacing="1">
                       <Box w="8px" h="8px" borderRadius="full" bg="blue.400" />
                       <Text fontSize="xs" fontWeight="700" color="gray.500">Target</Text>
                    </HStack>
                 </HStack>
              </Flex>
              <Box h="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#298AC6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#298AC6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 12, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 12, fontWeight: 700}} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#298AC6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Line type="monotone" dataKey="target" stroke="#00CFE8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
           </Box>

           {/* Sales Distribution */}
           <Box className="premium-card" p="8">
              <Heading size="md" color="secondary" fontWeight="900" mb="2">Sales Distribution</Heading>
              <Text fontSize="sm" color="gray.400" mb="8">Revenue split by product category</Text>
              <Box h="250px" display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <VStack align="stretch" mt="6" spacing="3">
                 {categoryData.map((cat, idx) => (
                    <Flex key={idx} justify="space-between" align="center" p="2" borderRadius="xl" _hover={{ bg: 'gray.50' }}>
                       <HStack spacing="3">
                          <Box w="12px" h="12px" borderRadius="3px" bg={COLORS[idx % COLORS.length]} />
                          <Text fontSize="sm" fontWeight="700" color="gray.600">{cat.name}</Text>
                       </HStack>
                       <Text fontSize="sm" fontWeight="800" color="secondary">{cat.value}%</Text>
                    </Flex>
                 ))}
              </VStack>
           </Box>
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap="8" mb="10">
           {/* Top Selling Products */}
           <Box className="premium-card" p="8">
              <Flex justify="space-between" align="center" mb="8">
                 <Heading size="md" color="secondary" fontWeight="900">Top Selling Products</Heading>
                 <Button size="xs" variant="ghost" colorScheme="brand" rightIcon={<ArrowUpRight size={14} />}>View Catalog</Button>
              </Flex>
              <VStack align="stretch" spacing="5">
                 {[
                   { name: 'iPhone 15 Pro', sales: 124, revenue: '₹1,23,876', growth: '+15%', status: 'Best Seller' },
                   { name: 'MacBook Air M2', sales: 86, revenue: '₹1,11,714', growth: '+12%', status: 'Trending' },
                   { name: 'AirPods Pro 2', sales: 245, revenue: '₹61,005', growth: '+25%', status: 'High Demand' },
                 ].map((item, idx) => (
                    <Flex key={idx} align="center" justify="space-between" p="4" bg="gray.50/50" borderRadius="22px" border="1px solid" borderColor="gray.100" transition="all 0.2s" _hover={{ shadow: 'md', bg: 'white', borderColor: 'brand.100' }}>
                       <HStack spacing="4">
                          <Box p="3" bg="white" borderRadius="15px" shadow="sm">
                             <ShoppingBag size={20} color="#298AC6" />
                          </Box>
                          <VStack align="start" spacing="0">
                             <Text fontWeight="900" color="secondary" fontSize="sm">{item.name}</Text>
                             <Text fontSize="xs" color="gray.400" fontWeight="600">{item.sales} Units Sold</Text>
                          </VStack>
                       </HStack>
                       <VStack align="end" spacing="0">
                          <Text fontWeight="900" color="brand.500" fontSize="md">{item.revenue}</Text>
                          <Badge colorScheme="green" variant="ghost" fontSize="10px" fontWeight="800">{item.growth} Growth</Badge>
                       </VStack>
                    </Flex>
                 ))}
              </VStack>
           </Box>

           {/* Performance Goals & Feedback */}
           <Box className="premium-card" p="8" bg="secondary" color="white" position="relative" overflow="hidden">
              <Box position="absolute" top="-20px" right="-20px" opacity="0.1">
                 <Target size={150} />
              </Box>
              <VStack align="start" spacing="6" position="relative" zIndex="1">
                 <Box>
                    <Heading size="md" fontWeight="900" mb="2">Store Performance Score</Heading>
                    <Text fontSize="sm" opacity="0.7">Your store is performing <Text as="span" fontWeight="900" color="brand.400">Better than 85%</Text> of other branches.</Text>
                 </Box>
                 
                 <HStack spacing="10" w="full">
                    <VStack align="start" spacing="0">
                       <Text fontSize="2xl" fontWeight="900" color="brand.400">8.4 / 10</Text>
                       <Text fontSize="xs" opacity="0.6" fontWeight="700">Service Rating</Text>
                    </VStack>
                    <Divider orientation="vertical" h="40px" opacity="0.2" />
                    <VStack align="start" spacing="0">
                       <Text fontSize="2xl" fontWeight="900" color="blue.400">92%</Text>
                       <Text fontSize="xs" opacity="0.6" fontWeight="700">Inventory Accuracy</Text>
                    </VStack>
                 </HStack>

                 <Box w="full">
                    <Flex justify="space-between" mb="3">
                       <Text fontSize="sm" fontWeight="800">Branch Revenue Goal</Text>
                       <Text fontSize="sm" fontWeight="800">₹45,200 / ₹60k</Text>
                    </Flex>
                    <Progress value={75} colorScheme="orange" bg="whiteAlpha.100" borderRadius="full" size="md" />
                 </Box>

                 <Box p="5" bg="whiteAlpha.100" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.200" w="full">
                    <HStack align="start" spacing="3">
                       <Box p="2" bg="brand.400" borderRadius="lg">
                          <Zap size={16} color="white" />
                       </Box>
                       <VStack align="start" spacing="1">
                          <Text fontSize="sm" fontWeight="800">Quick Tip for Bhai!</Text>
                          <Text fontSize="xs" opacity="0.7" lineHeight="tall">Westside Branch is seeing high demand for Mobile Accessories on weekends. Restock now to capture extra sales!</Text>
                       </VStack>
                    </HStack>
                 </Box>
              </VStack>
           </Box>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchPerformance;
