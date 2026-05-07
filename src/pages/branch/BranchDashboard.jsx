import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Text, 
  Heading, 
  Flex, 
  Icon,
  HStack,
  Badge,
  VStack,
  Button,
  useToast,
  Spinner,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  AlertCircle,
  Package,
  Receipt,
  Plus,
  History,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const data = [
  { name: '10 AM', sales: 1200 },
  { name: '12 PM', sales: 3400 },
  { name: '02 PM', sales: 4500 },
  { name: '04 PM', sales: 2800 },
  { name: '06 PM', sales: 5900 },
  { name: '08 PM', sales: 3200 },
  { name: '10 PM', sales: 1500 },
];

const StatCard = ({ title, value, icon, trend, trendColor, color, onClick, isLoading, suffix }) => (
  <Box 
    position="relative"
    bg="white" 
    p="6" 
    borderRadius="24px" 
    border="1px solid"
    borderColor="gray.100"
    shadow="sm"
    overflow="hidden"
    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    _hover={{ transform: 'translateY(-6px)', shadow: '2xl', cursor: 'pointer', borderColor: `${color}.200` }}
    onClick={onClick}
  >
    {/* Background Decorative Shape */}
    <Box 
      position="absolute" 
      top="-10px" 
      right="-10px" 
      w="80px" 
      h="80px" 
      bg={`${color}.50`} 
      borderRadius="full" 
      opacity="0.5"
      filter="blur(20px)"
    />
    
    <Flex justify="space-between" align="start" position="relative" zIndex="1">
      <VStack align="start" spacing="1">
        <Text color="gray.400" fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">{title}</Text>
        {isLoading ? (
          <Spinner size="sm" color={`${color}.500`} mt="2" />
        ) : (
          <HStack align="baseline" spacing="1">
            <Heading size="md" fontWeight="700" color="secondary" letterSpacing="-0.5px">{value}</Heading>
            {suffix && <Text fontSize="10px" fontWeight="600" color="gray.400">{suffix}</Text>}
          </HStack>
        )}
      </VStack>
      
      <Box 
        bg={`${color}.50`} 
        p="2.5" 
        borderRadius="15px" 
        color={`${color}.500`}
      >
        <Icon as={icon} fontSize="18" />
      </Box>
    </Flex>

    <HStack mt="5" spacing="2" position="relative" zIndex="1">
      <Badge 
        colorScheme={trendColor || 'gray'}
        variant="subtle" 
        borderRadius="xl" 
        px="2.5"
        py="0.5"
        fontSize="10px"
        fontWeight="800"
        display="flex"
        alignItems="center"
        gap="1"
      >
        <Box w="4px" h="4px" borderRadius="full" bg={`${trendColor}.500`} />
        {trend}
      </Badge>
      <Text fontSize="10px" color="gray.400" fontWeight="600">Updated just now</Text>
    </HStack>

    {/* Bottom Accent Bar */}
    <Box 
      position="absolute" 
      bottom="0" 
      left="0" 
      w="full" 
      h="4px" 
      bg={`${color}.400`}
      opacity="0.1"
    />
  </Box>
);

const BranchDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    branchName: '',
    stats: {
      totalItems: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      todayRevenue: 0,
      todayQty: 0,
      totalSales: 0
    },
    weeklyTrend: [],
    recentSales: [],
    lowStockPreview: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: dashData } = await API.get('/branch-sales/dashboard');
      setData(dashData);

      // Show toast if there are critical stock issues
      const criticalCount = (dashData.stats.lowStockCount || 0) + (dashData.stats.outOfStockCount || 0);
      if (criticalCount > 0) {
        toast({
          title: "⚠️ Stock Attention Needed",
          description: `Bhai, ${criticalCount} items are running low or out of stock.`,
          status: "warning",
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast({
        title: "Error fetching data",
        description: "Could not sync dashboard stats.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box pb="10">
        {/* Welcome Header         <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="6">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">
              {data.branchName || 'Branch'} Control Center
            </Heading>
            <Text fontSize="sm" color="gray.500" mt="1" fontWeight="400">
              {data.stats.lowStockCount > 0 || data.stats.outOfStockCount > 0
                ? <Text as="span">Stock attention needed — <Text as="span" color="red.500" fontWeight="600">{(data.stats.lowStockCount || 0) + (data.stats.outOfStockCount || 0)} items critical</Text></Text>
                : <Text as="span">Bhai, your branch is performing <Text as="span" color="green.500" fontWeight="600">Well</Text> today! <Text as="span" color="brand.500" fontWeight="700">₹{data.stats.todayRevenue?.toLocaleString()}</Text> earned so far.</Text>
              }
            </Text>
          </Box>
          <HStack spacing="3">
             <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" size="sm" onClick={() => navigate('/branch/new-invoice')}>New Invoice</Button>
             <Button leftIcon={<History size={16} />} variant="outline" borderRadius="xl" size="sm" onClick={() => navigate('/branch/sales-history')}>Sales History</Button>
          </HStack>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="6" mb="10">
          <StatCard 
            title="Today's Revenue" 
            value={`₹${data.stats.todayRevenue?.toLocaleString() ?? '0'}`}
            icon={TrendingUp} 
            trend={`${data.stats.todayQty} Items`} 
            trendColor="green"
            color="green" 
            isLoading={loading}
            onClick={() => navigate('/branch/sales-history')}
          />
          <StatCard 
            title="Total Stock Value" 
            value={`₹${(data.stats.totalValue / 1000).toFixed(1)}k`}
            icon={Activity} 
            trend={`${data.stats.totalItems} Units`}
            trendColor="blue"
            color="brand" 
            isLoading={loading}
            onClick={() => navigate('/branch/manage-products')}
          />
          <StatCard 
            title="Low Stock Items" 
            value={data.stats.lowStockCount ?? '0'}
            suffix="Critical"
            icon={AlertCircle} 
            trend={data.stats.lowStockCount > 0 ? "Needs Action" : "All Good"}
            trendColor={data.stats.lowStockCount > 0 ? "orange" : "green"}
            color="orange" 
            isLoading={loading}
            onClick={() => navigate('/branch/low-stock')}
          />
          <StatCard 
            title="Total Sales" 
            value={data.stats.totalSales ?? '0'}
            suffix="Invoices"
            icon={Receipt} 
            trend="Lifetime"
            trendColor="purple"
            color="purple" 
            isLoading={loading}
            onClick={() => navigate('/branch/sales-history')}
          />
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
          {/* Sales Chart */}
          <GridItem colSpan={{ base: 3, lg: 2 }} className="premium-card" p="6">
            <Flex justify="space-between" align="center" mb="6">
              <HStack spacing="3">
                 <Box bg="brand.50" p="2" borderRadius="lg">
                    <Icon as={Activity} color="brand.500" size={18} />
                 </Box>
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Weekly Revenue Trend</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Sales performance over the last 7 days</Text>
                 </VStack>
              </HStack>
              <Box bg="background" px="3" py="1" borderRadius="lg">
                 <Text fontSize="10px" fontWeight="700" color="secondary">Live Sync</Text>
              </Box>
            </Flex>
            <Box h="300px">
              {data.weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weeklyTrend}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#298AC6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#298AC6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="sales" stroke="#298AC6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Flex align="center" justify="center" h="full" color="gray.400" fontSize="sm">No sales data available yet.</Flex>
              )}
            </Box>
          </GridItem>

          {/* Right Panel */}
          <GridItem colSpan={{ base: 3, lg: 1 }}>
             <VStack spacing="6" align="stretch">
                {/* Recent Sales List */}
                <Box className="premium-card" p="6">
                   <Flex justify="space-between" align="center" mb="5">
                     <Heading size="xs" color="secondary" fontWeight="700">Recent Sales</Heading>
                     <Text fontSize="10px" color="brand.500" fontWeight="700" cursor="pointer" onClick={() => navigate('/branch/sales-history')}>View All</Text>
                   </Flex>
                   <VStack align="stretch" spacing="4">
                      {data.recentSales.length > 0 ? data.recentSales.map((sale, idx) => (
                        <Flex key={idx} justify="space-between" align="center">
                          <HStack spacing="3">
                            <Box p="2" bg="green.50" borderRadius="lg" color="green.600">
                               <Receipt size={14} />
                            </Box>
                            <VStack align="start" spacing="0">
                               <Text fontSize="12px" fontWeight="700" color="secondary">{sale.customerName}</Text>
                               <Text fontSize="10px" color="gray.400">{sale.time}</Text>
                            </VStack>
                          </HStack>
                          <Text fontSize="12px" fontWeight="800" color="secondary">₹{sale.amount}</Text>
                        </Flex>
                      )) : (
                        <Text fontSize="xs" color="gray.400" textAlign="center" py="4">No recent sales.</Text>
                      )}
                   </VStack>
                </Box>

                {/* Stock Alert Panel */}
                <Box className="premium-card" p="6">
                   <Flex justify="space-between" align="center" mb="5">
                     <Heading size="xs" color="secondary" fontWeight="700">Stock Alerts</Heading>
                     <Text fontSize="10px" color="brand.500" fontWeight="700" cursor="pointer" onClick={() => navigate('/branch/low-stock')}>Manage</Text>
                   </Flex>
                   {loading ? (
                     <Flex justify="center" py="4"><Spinner size="sm" color="brand.500" /></Flex>
                   ) : data.lowStockPreview.length === 0 ? (
                     <VStack py="4" spacing="2">
                       <Box p="3" bg="green.50" borderRadius="full">
                         <Icon as={Package} color="green.500" fontSize="20" />
                       </Box>
                       <Text fontSize="xs" color="gray.400" fontWeight="600" textAlign="center">All stock levels healthy!</Text>
                     </VStack>
                   ) : (
                     <VStack align="stretch" spacing="3">
                       {data.lowStockPreview.map((item, idx) => (
                         <Flex key={idx} justify="space-between" align="center" p="3" bg={item.status === 'Out of Stock' ? 'red.50' : 'orange.50'} borderRadius="lg" cursor="pointer" onClick={() => navigate('/branch/low-stock')}>
                           <VStack align="start" spacing="0">
                             <Text fontSize="xs" fontWeight="700" color="secondary" noOfLines={1}>{item.name}</Text>
                             <Badge colorScheme={item.status === 'Out of Stock' ? 'red' : 'orange'} borderRadius="full" fontSize="8px" px="2">{item.status}</Badge>
                           </VStack>
                           <Text fontSize="11px" fontWeight="800" color={item.stock === 0 ? 'red.600' : 'orange.600'}>{item.stock} left</Text>
                         </Flex>
                       ))}
                     </VStack>
                   )}
                </Box>
             </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchDashboard;
