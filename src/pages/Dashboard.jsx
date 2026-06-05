import { useState, useEffect } from 'react';
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
  Spinner,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  EllipsisVertical as MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Package,
  Truck,
  Calendar,
  Users,
  ArrowRightLeft,
  LayoutGrid,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const ColoredStatCard = ({ title, value, icon, trend, trendValue, color, onClick }) => (
  <Box 
    bg="white" 
    p="6" 
    borderRadius="xl" 
    border="1px solid"
    borderColor="gray.100"
    shadow="sm"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-3px)', shadow: 'md', cursor: 'pointer', borderColor: `${color}.200` }}
    onClick={onClick}
  >
    <Flex justify="space-between" align="start">
      <VStack align="start" spacing="1">
        <Text fontSize="10px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.5px">{title}</Text>
        <Heading size="md" fontWeight="700" color="secondary" mt="1">{value}</Heading>
        <HStack mt="3" spacing="2">
          <Badge 
            colorScheme={trend === 'up' ? 'green' : 'red'} 
            variant="subtle" 
            fontSize="10px" 
            borderRadius="full" 
            px="2.5"
            py="0.5"
          >
            <HStack spacing="1">
              <Icon as={trend === 'up' ? ArrowUpRight : ArrowDownRight} size={10} />
              <Text fontWeight="700">{trendValue}</Text>
            </HStack>
          </Badge>
          <Text fontSize="10px" color="gray.400" fontWeight="500">Growth</Text>
        </HStack>
      </VStack>
      <Box bg={`${color}.50`} p="3.5" borderRadius="16px" color={`${color}.500`}>
        <Icon as={icon} fontSize="20" />
      </Box>
    </Flex>
  </Box>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, chartData: [], todayDate: '' });
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh when dispatch happens
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('refresh_page_data', handleRefresh);
    return () => window.removeEventListener('refresh_page_data', handleRefresh);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/dashboard');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching dashboard data",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

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
        {/* Welcome Header */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'end' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Master Control Dashboard</Heading>
             <Text fontSize="sm" color="gray.500" mt="1" fontWeight="400">
                Managing <Text as="span" color="brand.500" fontWeight="600">{data.stats?.totalBranches || 0} Depot(s)</Text> with <Text as="span" color="brand.500" fontWeight="600">{data.stats?.todaySales || 0} New Superstockist</Text> recorded today
             </Text>
          </Box>
          <Box bg="white" p="2" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
             <HStack spacing="2" px="2">
                <Icon as={Calendar} size={14} color="brand.500" />
                <Text fontSize="12px" fontWeight="600" color="gray.600">{data.todayDate}</Text>
             </HStack>
          </Box>
        </Flex>

        {/* Top Colored Stats - Row 1: Stock & Movement */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6" mb="6">
          <ColoredStatCard 
            title="Total Main Stock" 
            value={(data.stats?.mainStock || 0) >= 1000 
              ? `${((data.stats?.mainStock || 0) / 1000).toFixed(1)}k Units` 
              : `${data.stats?.mainStock || 0} Units`} 
            icon={Package} 
            trend="up" 
            trendValue="In Warehouse"
            color="brand" 
            onClick={() => navigate('/admin/inventory')}
          />
          <ColoredStatCard 
            title="Total Out Products" 
            value={(data.stats?.totalUnitsDispatched || 0) >= 1000 
              ? `${((data.stats?.totalUnitsDispatched || 0) / 1000).toFixed(1)}k Units` 
              : `${data.stats?.totalUnitsDispatched || 0} Units`} 
            icon={ArrowRightLeft} 
            trend="up" 
            trendValue={`${data.stats?.activeTransfers || 0} Pending`}
            color="orange" 
            onClick={() => navigate('/admin/inventory-logs')}
          />
          <ColoredStatCard 
            title="Network Revenue" 
            value={(data.stats?.totalRevenue || 0) >= 100000 
              ? `₹${((data.stats?.totalRevenue || 0) / 100000).toFixed(1)}L` 
              : `₹${(data.stats?.totalRevenue || 0).toLocaleString()}`} 
            icon={TrendingUp} 
            trend="up" 
            trendValue={`${data.stats?.totalSalesCount || 0} Superstockist`}
            color="green" 
            onClick={() => navigate('/reports/daily')}
          />
        </Grid>

        {/* Top Colored Stats - Row 2: Entities */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6" mb="10">
          <ColoredStatCard 
            title="Total Depot" 
            value={`${data.stats?.totalBranches || 0} Locations`} 
            icon={Building} 
            trend="up" 
            trendValue="Active"
            color="blue" 
            onClick={() => navigate('/manage-branches')}
          />
          <ColoredStatCard 
            title="Total Superstockist Team" 
            value={`${data.stats?.totalSalesReps || 0} Members`} 
            icon={Users} 
            trend="up" 
            trendValue="Field Staff"
            color="purple" 
            onClick={() => navigate('/manage-sales')}
          />
          <ColoredStatCard 
            title="Total Distributors" 
            value={`${data.stats?.totalDistributors || 0} Partners`} 
            icon={Truck} 
            trend="up" 
            trendValue="Logistics"
            color="teal" 
            onClick={() => navigate('/manage-distributors')}
          />
        </Grid>

        {/* Top Colored Stats - Row 3: Catalog Stats */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6" mb="10">
          <ColoredStatCard 
            title="Product Varieties" 
            value={`${data.stats?.totalProductTypes || 0} Types`} 
            icon={Package} 
            trend="up" 
            trendValue="Unique Items"
            color="orange" 
            onClick={() => navigate('/admin/products')}
          />
          <ColoredStatCard 
            title="Product Categories" 
            value={`${data.stats?.totalCategories || 0} Categories`} 
            icon={LayoutGrid} 
            trend="up" 
            trendValue="Classification"
            color="pink" 
            onClick={() => navigate('/admin/products')}
          />
          <ColoredStatCard 
            title="Low Stock Warning" 
            value={`${data.stats?.lowStockCount || 0} Products`} 
            icon={AlertTriangle} 
            trend={data.stats?.lowStockCount > 0 ? 'down' : 'up'} 
            trendValue={data.stats?.lowStockCount > 0 ? 'Needs Restock' : 'All Healthy'}
            color={data.stats?.lowStockCount > 0 ? 'red' : 'green'} 
            onClick={() => navigate('/admin/low-stock')}
          />
        </Grid>

        {/* Charts Section */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6" mb="8">
          <GridItem colSpan={{ base: 3, lg: 2 }} className="premium-card" p="6">
            <Flex justify="space-between" align="center" mb="6">
              <HStack spacing="3">
                 <Box bg="brand.50" p="2" borderRadius="lg">
                    <Icon as={Package} color="brand.500" size={18} />
                 </Box>
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Dispatch Analytics</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Weekly stock movement volume</Text>
                 </VStack>
              </HStack>
              <HStack spacing="1">
                 <Button size="xs" variant="ghost" color="gray.500" fontSize="10px">Daily</Button>
                 <Button size="xs" colorScheme="brand" borderRadius="md" px="3" fontSize="10px">Weekly</Button>
              </HStack>
            </Flex>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                    cursor={{fill: 'rgba(41, 138, 198, 0.05)'}}
                  />
                  <Bar dataKey="dispatches" fill="#298AC6" radius={[4, 4, 0, 0]} barSize={30} name="Units Dispatched" />
                  <Bar dataKey="sales" fill="#34D399" radius={[4, 4, 0, 0]} barSize={30} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }} className="premium-card" p="6">
            <Flex justify="space-between" align="center" mb="6">
              <HStack spacing="3">
                 <Box bg="blue.50" p="2" borderRadius="lg">
                    <Icon as={TrendingUp} color="blue.500" size={18} />
                 </Box>
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Value Trend</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Overall consignment value</Text>
                 </VStack>
              </HStack>
              <Icon as={MoreVertical} color="gray.300" cursor="pointer" size={14} />
            </Flex>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2167E3" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2167E3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#2167E3" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GridItem>
        </Grid>
        {/* Low Stock Alerts Section */}
        {data.stats?.lowStockItems?.length > 0 && (
          <Box className="premium-card" p="6" mt="8" borderColor="orange.200" bg="orange.50/10">
            <Flex justify="space-between" align="center" mb="6">
              <HStack spacing="3">
                <Box bg="orange.100" p="2.5" borderRadius="xl" color="orange.600">
                  <AlertTriangle size={22} />
                </Box>
                <VStack align="start" spacing="0">
                  <Heading size="md" color="secondary" fontWeight="800">Low Stock Inventory Alerts</Heading>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">Critical items that need replenishment in Main Warehouse</Text>
                </VStack>
              </HStack>
              <Button size="sm" colorScheme="orange" variant="ghost" rightIcon={<ArrowUpRight size={14} />} onClick={() => navigate('/admin/inventory')}>
                Manage Inventory
              </Button>
            </Flex>

            <Box overflowX="auto">
               <Table variant="simple" size="sm">
                  <Thead>
                     <Tr>
                        <Th color="gray.400" fontSize="10px" borderBottomWidth="1px">Product Name</Th>
                        <Th color="gray.400" fontSize="10px" borderBottomWidth="1px">Category</Th>
                        <Th color="gray.400" fontSize="10px" borderBottomWidth="1px">Current Stock</Th>
                        <Th color="gray.400" fontSize="10px" borderBottomWidth="1px">Min Level</Th>
                        <Th color="gray.400" fontSize="10px" borderBottomWidth="1px" textAlign="right">Status</Th>
                     </Tr>
                  </Thead>
                  <Tbody>
                     {data.stats.lowStockItems.map((item, idx) => (
                        <Tr key={idx} _hover={{ bg: 'white' }}>
                           <Td py="4"><Text fontWeight="700" color="secondary">{item.name}</Text></Td>
                           <Td py="4"><Badge colorScheme="gray" variant="subtle" borderRadius="md" px="2">{item.category || 'N/A'}</Badge></Td>
                           <Td py="4"><Text fontWeight="800" color="orange.600">{item.stock} Units</Text></Td>
                           <Td py="4"><Text fontWeight="600" color="gray.500">{item.minLevel}</Text></Td>
                           <Td py="4" textAlign="right">
                              <Badge colorScheme="red" variant="solid" fontSize="9px" borderRadius="full" px="3">REPLENISH</Badge>
                           </Td>
                        </Tr>
                     ))}
                  </Tbody>
               </Table>
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Dashboard;


