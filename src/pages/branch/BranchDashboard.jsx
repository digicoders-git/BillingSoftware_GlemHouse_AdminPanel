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
  SimpleGrid,
  Divider,
  Avatar,
  Tooltip,
  Progress,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  AlertCircle,
  Package,
  Receipt,
  Plus,
  History,
  Activity,
  ArrowUpRight,
  ShoppingBag,
  Clock,
  ArrowRight,
  PieChart,
  Target,
  Box as BoxIcon
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const MotionBox = motion(Box);

const BranchDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    branchName: '',
    stats: {
      totalProducts: 0,
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
    topProducts: [],
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

      const criticalCount = (dashData.stats.lowStockCount || 0) + (dashData.stats.outOfStockCount || 0);
      if (criticalCount > 0) {
        toast({
          title: "Stock Alert!",
          description: `${criticalCount} products critically low. Check Inventory.`,
          status: "warning",
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({ title: "Sync Error", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const colors = ["#298AC6", "#34D399", "#FBBF24", "#F87171", "#818CF8"];

  return (
    <Layout>
      <Box pb="10">
        {/* Modern Welcome Banner */}
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'start', md: 'center' }} 
          mb="10" 
          gap="6"
          bg="brand.500"
          p="8"
          borderRadius="3xl"
          color="white"
          shadow="0 10px 30px rgba(41, 138, 198, 0.25)"
          position="relative"
          overflow="hidden"
        >
          {/* Abstract background circles */}
          <Box position="absolute" top="-50px" right="-50px" w="200px" h="200px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" bottom="-20px" left="20%" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />
          
          <Box zIndex="1">
            <HStack mb="2">
              <Badge colorScheme="whiteAlpha" color="white" borderRadius="full" px="3" variant="solid">Live Dashboard</Badge>
              <Text fontSize="xs" fontWeight="700" opacity="0.8">SYNCED JUST NOW</Text>
            </HStack>
            <Heading size="lg" fontWeight="900" letterSpacing="-1px">
              {data.branchName || 'Branch'} Control Center
            </Heading>
            <Text fontSize="sm" mt="1" opacity="0.9" fontWeight="500">
               {data.stats.lowStockCount > 0 
                 ? `Action required: ${data.stats.lowStockCount} items need restocking.` 
                 : `Everything is looking great today. You've earned ₹${data.stats.todayRevenue?.toLocaleString()} so far.`}
            </Text>
          </Box>
          
          <HStack spacing="3" zIndex="1" w={{ base: 'full', md: 'auto' }}>
             <Button 
                leftIcon={<ArrowUpRight size={18} />} 
                bg="white" 
                color="brand.500" 
                borderRadius="xl" 
                px="6" 
                _hover={{ bg: 'gray.50', transform: 'scale(1.05)' }}
                onClick={() => navigate('/branch/dispatch-to-sales-gst')}
                shadow="lg"
             >
                Dispatch (GST)
             </Button>
             <Button 
                leftIcon={<ArrowUpRight size={18} />} 
                bg="brand.600" 
                color="white" 
                borderRadius="xl" 
                px="6" 
                _hover={{ bg: 'brand.700', transform: 'scale(1.05)' }}
                onClick={() => navigate('/branch/dispatch-to-sales')}
                shadow="lg"
             >
                Dispatch (Non-GST)
             </Button>
             <Button 
                leftIcon={<History size={18} />} 
                variant="outline" 
                color="white" 
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.100' }}
                borderRadius="xl" 
                onClick={() => navigate('/total-dispatch-stock')}
             >
                Dispatch History
             </Button>
          </HStack>
        </Flex>

        {/* Dynamic Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="6" mb="10">
          <PremiumStatCard 
            title="Total Products" 
            value={data.stats.totalProducts ?? '0'}
            icon={BoxIcon} 
            subtitle="Different models managed"
            color="blue" 
            isLoading={loading}
          />
          <PremiumStatCard 
            title="Total Stock Qty" 
            value={data.stats.totalItems?.toLocaleString() ?? '0'}
            icon={Package} 
            subtitle="Total units in inventory"
            color="brand" 
            isLoading={loading}
          />
          <PremiumStatCard 
            title="Today's Revenue" 
            value={`₹${data.stats.todayRevenue?.toLocaleString() ?? '0'}`}
            icon={TrendingUp} 
            subtitle={`${data.stats.todayQty} items sold today`}
            color="green" 
            isLoading={loading}
          />
          <PremiumStatCard 
            title="Stock Alerts" 
            value={data.stats.lowStockCount ?? '0'}
            icon={AlertCircle} 
            subtitle={data.stats.lowStockCount > 0 ? "Critical attention needed" : "All stock levels optimal"}
            color="orange" 
            isLoading={loading}
            isAlert={data.stats.lowStockCount > 0}
          />
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          {/* Main Visual Section */}
          <GridItem colSpan={{ base: 3, lg: 2 }}>
             <VStack spacing="8" align="stretch">
                {/* Revenue Trend Chart */}
                <Box className="premium-card" p="8">
                  <Flex justify="space-between" align="center" mb="8">
                    <VStack align="start" spacing="0">
                      <Heading size="xs" color="secondary" fontWeight="900" textTransform="uppercase" letterSpacing="1px">Revenue Performance</Heading>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">Last 7 days earnings</Text>
                    </VStack>
                    <SelectRange />
                  </Flex>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weeklyTrend}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#298AC6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#298AC6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 11, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 11, fontWeight: 700}} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700 }} 
                        />
                        <Area type="monotone" dataKey="sales" stroke="#298AC6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Top Selling Products Bar Chart */}
                <Box className="premium-card" p="8">
                  <Flex justify="space-between" align="center" mb="8">
                    <VStack align="start" spacing="0">
                      <Heading size="xs" color="secondary" fontWeight="900" textTransform="uppercase" letterSpacing="1px">Fast Moving Stock</Heading>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">Top 5 products by quantity sold</Text>
                    </VStack>
                    <Icon as={PieChart} color="brand.500" />
                  </Flex>
                  <Box h="250px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topProducts} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#2D3748', fontSize: 11, fontWeight: 800}} width={120} />
                        <RechartsTooltip />
                        <Bar dataKey="qty" radius={[0, 10, 10, 0]} barSize={20}>
                          {data.topProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
             </VStack>
          </GridItem>

          {/* Activity & Alerts Panel */}
          <GridItem colSpan={{ base: 3, lg: 1 }}>
             <VStack spacing="8" align="stretch">
                {/* Recent Dispatches Preview */}
                <Box className="premium-card" p="6">
                   <Flex justify="space-between" align="center" mb="6">
                      <Heading size="xs" color="secondary" fontWeight="900">DISPATCH HISTORY</Heading>
                      <IconButton size="xs" variant="ghost" icon={<ArrowRight size={14} />} onClick={() => navigate('/total-dispatch-stock')} />
                   </Flex>
                   <VStack align="stretch" spacing="4">
                      <Text fontSize="xs" color="gray.500" fontWeight="600" textAlign="center" py="4">
                        Check the Dispatch History for recent stock transfers.
                      </Text>
                      <Button size="xs" variant="outline" colorScheme="brand" onClick={() => navigate('/total-dispatch-stock')}>
                        View All Dispatches
                      </Button>
                   </VStack>
                </Box>

                {/* Stock Warning Panel */}
                <Box className="premium-card" p="6" border={data.stats.lowStockCount > 0 ? "2px solid" : "none"} borderColor="orange.200">
                   <Flex justify="space-between" align="center" mb="6">
                      <HStack>
                         <Heading size="xs" color="secondary" fontWeight="900">STOCK ALERTS</Heading>
                         {data.stats.lowStockCount > 0 && <Badge colorScheme="orange" borderRadius="full" px="2">{data.stats.lowStockCount}</Badge>}
                      </HStack>
                      <Button size="xs" variant="link" color="brand.500" onClick={() => navigate('/branch/low-stock')}>Manage</Button>
                   </Flex>
                   {loading ? (
                     <Flex justify="center" py="4"><Spinner size="sm" color="brand.500" /></Flex>
                   ) : data.lowStockPreview.length === 0 ? (
                     <VStack py="8" spacing="4">
                        <CircularProgress value={100} color="green.400" size="80px" thickness="8px">
                           <CircularProgressLabel color="green.500" fontWeight="900">100%</CircularProgressLabel>
                        </CircularProgress>
                        <Text fontSize="xs" color="gray.500" fontWeight="700" textAlign="center">Shelf stock is healthy!</Text>
                     </VStack>
                   ) : (
                     <VStack align="stretch" spacing="3">
                        {data.lowStockPreview.map((item, idx) => (
                          <Box key={idx} p="3" bg={item.status === 'Out of Stock' ? 'red.50' : 'orange.50'} borderRadius="xl" borderLeft="4px solid" borderColor={item.status === 'Out of Stock' ? 'red.400' : 'orange.400'}>
                             <Flex justify="space-between" align="center" mb="2">
                                <Text fontSize="xs" fontWeight="800" color="secondary" noOfLines={1}>{item.name}</Text>
                                <Text fontSize="10px" fontWeight="900" color={item.stock === 0 ? 'red.600' : 'orange.600'}>{item.stock} left</Text>
                             </Flex>
                             <Progress value={(item.stock / 10) * 100} size="xs" borderRadius="full" colorScheme={item.stock === 0 ? 'red' : 'orange'} />
                          </Box>
                        ))}
                     </VStack>
                   )}
                </Box>

                {/* Quick Shortcuts */}
                <Box className="premium-card" p="6" bg="background">
                   <Heading size="xs" mb="4" color="secondary" fontWeight="900" letterSpacing="0.5px">QUICK ACTIONS</Heading>
                   <SimpleGrid columns={2} spacing="3">
                      <ShortcutBtn icon={Package} label="Products" onClick={() => navigate('/branch/manage-products')} />
                      <ShortcutBtn icon={Target} label="Reports" onClick={() => navigate('/branch/reports')} />
                   </SimpleGrid>
                </Box>
             </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

const PremiumStatCard = ({ title, value, icon, subtitle, color, isLoading, isAlert }) => (
  <MotionBox 
    whileHover={{ y: -5 }}
    bg="white" 
    p="6" 
    borderRadius="3xl" 
    border="1px solid"
    borderColor={isAlert ? 'orange.200' : 'gray.100'}
    shadow="sm"
    transition="0.3s"
    _hover={{ shadow: 'xl', borderColor: `${color}.200` }}
  >
    <Flex justify="space-between" align="start">
      <VStack align="start" spacing="1">
        <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase" letterSpacing="0.5px">{title}</Text>
        {isLoading ? (
          <Spinner size="sm" color={`${color}.500`} mt="2" />
        ) : (
          <Heading size="md" fontWeight="900" color="secondary" letterSpacing="-0.5px">{value}</Heading>
        )}
        <Text fontSize="10px" fontWeight="600" color="gray.400" noOfLines={1}>{subtitle}</Text>
      </VStack>
      <Box p="3" bg={`${color}.50`} borderRadius="xl" color={`${color}.500`}>
        <Icon as={icon} fontSize="20px" />
      </Box>
    </Flex>
  </MotionBox>
);

const ShortcutBtn = ({ icon, label, onClick }) => (
  <Button 
    variant="white" 
    bg="white" 
    borderRadius="2xl" 
    h="80px" 
    flexDirection="column" 
    gap="2" 
    onClick={onClick}
    shadow="sm"
    _hover={{ shadow: 'md', transform: 'scale(1.02)' }}
  >
    <Icon as={icon} color="brand.500" fontSize="20px" />
    <Text fontSize="10px" fontWeight="800" color="gray.500">{label}</Text>
  </Button>
);

const SelectRange = () => (
  <HStack spacing="1" bg="gray.100" p="1" borderRadius="lg">
     <Button size="xs" variant="ghost" colorScheme="brand" bg="white" shadow="sm" borderRadius="md" px="3">7D</Button>
     <Button size="xs" variant="ghost" color="gray.500" px="3">30D</Button>
  </HStack>
);

const IconButton = ({ icon, ...props }) => (
  <Box as="button" p="1.5" borderRadius="lg" _hover={{ bg: 'gray.100' }} transition="0.2s" {...props}>
    {icon}
  </Box>
);

export default BranchDashboard;

