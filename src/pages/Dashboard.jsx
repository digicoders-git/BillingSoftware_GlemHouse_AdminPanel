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
  Button} from '@chakra-ui/react';
import { 
  TrendingUp, 
  EllipsisVertical as MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Package,
  Truck,
  Activity,
  Calendar
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

const data = [
  { name: 'Mon', dispatches: 40, revenue: 2400 },
  { name: 'Tue', dispatches: 30, revenue: 1398 },
  { name: 'Wed', dispatches: 50, revenue: 9800 },
  { name: 'Thu', dispatches: 27, revenue: 3908 },
  { name: 'Fri', dispatches: 18, revenue: 4800 },
  { name: 'Sat', dispatches: 23, revenue: 3800 },
  { name: 'Sun', dispatches: 34, revenue: 4300 },
];

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

  return (
    <Layout>
      <Box pb="10">
        {/* Welcome Header */}
        <Flex justify="space-between" align="end" mb="10">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Master Control Dashboard</Heading>
            <Text fontSize="sm" color="gray.500" mt="1" fontWeight="400">
               Managing <Text as="span" color="brand.500" fontWeight="600">12 Branches</Text> and <Text as="span" color="brand.500" fontWeight="600">48 Active Transfers</Text> today
            </Text>
          </Box>
          <Box bg="white" p="2" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
             <HStack spacing="2" px="2">
                <Icon as={Calendar} size={14} color="brand.500" />
                <Text fontSize="12px" fontWeight="600" color="gray.600">May 06, 2026</Text>
             </HStack>
          </Box>
        </Flex>

        {/* Top Colored Stats */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6" mb="10">
          <ColoredStatCard 
            title="Registered Branches" 
            value="12 Units" 
            icon={Building} 
            trend="up" 
            trendValue="+2 New"
            color="secondary" 
            onClick={() => navigate('/manage-branches')}
          />
          <ColoredStatCard 
            title="Total Stock Dispatched" 
            value="18.6k Units" 
            icon={Package} 
            trend="up" 
            trendValue="+12.5%"
            color="brand" 
            onClick={() => navigate('/total-dispatch-stock')}
          />
          <ColoredStatCard 
            title="Network Allocation" 
            value="82.4%" 
            icon={Activity} 
            trend="up" 
            trendValue="+5.2%"
            color="green" 
            onClick={() => navigate('/product-allocation')}
          />
          <ColoredStatCard 
            title="Active Transfers" 
            value="48 Loads" 
            icon={Truck} 
            trend="up" 
            trendValue="High Speed"
            color="blue" 
            onClick={() => navigate('/product-movement')}
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
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                    cursor={{fill: 'rgba(255, 159, 67, 0.05)'}}
                  />
                  <Bar dataKey="dispatches" fill="#FF9F43" radius={[4, 4, 0, 0]} barSize={30} />
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
                <AreaChart data={data}>
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
                  <Area type="monotone" dataKey="revenue" stroke="#2167E3" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
