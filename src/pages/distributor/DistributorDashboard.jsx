import { useEffect, useState } from 'react';
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
  SimpleGrid,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  Package,
  Receipt,
  Plus,
  History,
  Target,
  ShoppingBag,
  Users
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const MotionBox = motion(Box);

const DistributorDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: '',
    stats: {
      totalItems: 0,
      totalSales: 0,
      todayRevenue: 0,
      todayQty: 0
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
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'start', md: 'center' }} 
          mb="10" 
          p="8"
          bg="brand.600"
          borderRadius="3xl"
          color="white"
          shadow="xl"
          position="relative"
        >
          <Box zIndex="1">
            <Badge colorScheme="whiteAlpha" mb="2">Partner (Distributor) Panel</Badge>
            <Heading size="lg" fontWeight="900" letterSpacing="-1px">
               Welcome, {data.name || 'Partner'}
            </Heading>
            <Text fontSize="sm" opacity="0.9">Manage your stock and retail distribution</Text>
          </Box>
          <HStack spacing="3" zIndex="1" mt={{ base: 4, md: 0 }}>
             <Menu>
                <MenuButton 
                  as={Button} 
                  leftIcon={<Plus size={18} />} 
                  bg="white" 
                  color="brand.600" 
                  borderRadius="xl"
                  _hover={{ bg: 'gray.50' }}
                  _active={{ bg: 'gray.100' }}
                >
                  New Sale
                </MenuButton>
                <MenuList zIndex="10" color="secondary" borderRadius="xl" shadow="2xl" border="none" p="2">
                   <MenuItem 
                      icon={<Receipt size={16} />} 
                      fontWeight="700" 
                      fontSize="sm" 
                      borderRadius="lg"
                      onClick={() => navigate('/distributor/new-invoice-gst')}
                   >
                      With GST Billing
                   </MenuItem>
                   <MenuItem 
                      icon={<ShoppingBag size={16} />} 
                      fontWeight="700" 
                      fontSize="sm" 
                      borderRadius="lg"
                      onClick={() => navigate('/distributor/new-invoice')}
                   >
                      Without GST Billing
                   </MenuItem>
                </MenuList>
             </Menu>
             <Button leftIcon={<History size={18} />} variant="outline" color="white" borderRadius="xl" onClick={() => navigate('/distributor/history')}>Sales History</Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="6" mb="10">
          <StatCard 
            title="Retail Sales" 
            value={`₹${data.stats.todayRevenue?.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
            subtitle={`${data.stats.todayQty} units sold today`}
          />
          <StatCard 
            title="Partner Stock" 
            value={data.stats.totalItems}
            icon={Package}
            color="brand"
            subtitle="Units in your warehouse"
          />
          <StatCard 
            title="Total Customers" 
            value={data.stats.totalCustomers || 0}
            icon={Users}
            color="orange"
            subtitle="Unique retail reach"
          />
          <StatCard 
            title="Total Bills" 
            value={data.stats.totalSales}
            icon={Receipt}
            color="purple"
            subtitle="Successful transactions"
          />
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
           <GridItem colSpan={{ base: 3, lg: 2 }}>
              <Box className="premium-card" p="8">
                 <Heading size="xs" mb="6" color="secondary" fontWeight="900">DISTRIBUTION TREND</Heading>
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
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 11, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 11, fontWeight: 700}} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="sales" stroke="#298AC6" strokeWidth={4} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </Box>
              </Box>
           </GridItem>

           <GridItem colSpan={{ base: 3, lg: 1 }}>
              <VStack spacing="8" align="stretch">
                 <Box className="premium-card" p="6">
                    <Heading size="xs" mb="6" color="secondary" fontWeight="900">RECENT CUSTOMERS</Heading>
                    <VStack align="stretch" spacing="4">
                       {data.recentSales.map((sale, i) => (
                         <Flex key={i} justify="space-between" align="center" p="3" bg="gray.50" borderRadius="xl">
                            <Box>
                               <Text fontSize="xs" fontWeight="800" color="secondary">{sale.customerName}</Text>
                               <Text fontSize="10px" color="gray.400">{sale.time}</Text>
                            </Box>
                            <Text fontSize="xs" fontWeight="900">₹{sale.amount}</Text>
                         </Flex>
                       ))}
                    </VStack>
                 </Box>
                 
                 <Box className="premium-card" p="6">
                    <Heading size="xs" mb="6" color="secondary" fontWeight="900">LOW STOCK WARNING</Heading>
                    {data.lowStockPreview.length === 0 ? (
                      <Flex direction="column" align="center" py="4">
                         <CircularProgress value={100} color="green.400" size="60px">
                            <CircularProgressLabel fontSize="xs">OK</CircularProgressLabel>
                         </CircularProgress>
                         <Text fontSize="xs" mt="3" color="gray.500">Inventory is healthy</Text>
                      </Flex>
                    ) : (
                      <VStack align="stretch" spacing="3">
                        {data.lowStockPreview.map((item, i) => (
                          <Box key={i}>
                             <Flex justify="space-between" fontSize="xs" mb="1">
                                <Text fontWeight="700">{item.name}</Text>
                                <Text fontWeight="900" color="red.500">{item.stock} left</Text>
                             </Flex>
                             <Progress value={(item.stock / 10) * 100} size="xs" colorScheme="red" borderRadius="full" />
                          </Box>
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

const StatCard = ({ title, value, icon, subtitle, color }) => (
  <MotionBox 
    whileHover={{ y: -5 }}
    bg="white" 
    p="6" 
    borderRadius="3xl" 
    shadow="sm"
    _hover={{ shadow: 'xl' }}
  >
    <Flex justify="space-between">
       <VStack align="start" spacing="0">
          <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase">{title}</Text>
          <Heading size="md" fontWeight="900" color="secondary">{value}</Heading>
          <Text fontSize="10px" color="gray.400">{subtitle}</Text>
       </VStack>
       <Box p="3" bg={`${color}.50`} borderRadius="xl" color={`${color}.500`}>
          <Icon as={icon} fontSize="20px" />
       </Box>
    </Flex>
  </MotionBox>
);

export default DistributorDashboard;

