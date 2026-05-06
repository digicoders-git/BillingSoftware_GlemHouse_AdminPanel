import React, { useEffect } from 'react';
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
  Avatar,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  ShoppingCart, 
  TrendingUp, 
  EllipsisVertical as MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Package,
  Receipt,
  Plus,
  Calendar,
  History,
  Activity
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
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: '10 AM', sales: 1200, orders: 4 },
  { name: '12 PM', sales: 3400, orders: 8 },
  { name: '02 PM', sales: 4500, orders: 12 },
  { name: '04 PM', sales: 2800, orders: 7 },
  { name: '06 PM', sales: 5900, orders: 15 },
  { name: '08 PM', sales: 3200, orders: 9 },
  { name: '10 PM', sales: 1500, orders: 3 },
];

const StatCard = ({ title, value, icon, trend, color, onClick }) => (
  <Box 
    className="premium-card" 
    p="5" 
    transition="all 0.3s" 
    _hover={{ transform: 'translateY(-3px)', shadow: 'md', cursor: 'pointer', borderColor: `${color}.200` }}
    onClick={onClick}
  >
    <Flex justify="space-between" align="start">
      <Box>
        <Text color="gray.400" fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">{title}</Text>
        <Heading size="md" fontWeight="700" color="secondary" mt="1">{value}</Heading>
        <HStack mt="3" spacing="2">
          <Badge 
            colorScheme={trend.startsWith('+') ? 'green' : 'red'} 
            variant="subtle" 
            borderRadius="full" 
            px="2.5"
            py="0.5"
            fontSize="10px"
            fontWeight="700"
          >
            {trend}
          </Badge>
          <Text fontSize="10px" color="gray.400" fontWeight="500">Performance</Text>
        </HStack>
      </Box>
      <Box bg={`${color}.50`} p="3.5" borderRadius="16px" color={`${color}.500`}>
        <Icon as={icon} fontSize="20" />
      </Box>
    </Flex>
  </Box>
);

const BranchDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for low stock items and show automated alert
    const lowStockItems = 3; 
    if (lowStockItems > 0) {
      toast({
        title: "Bhai, Stock is Low!",
        description: `You have ${lowStockItems} items running low on stock.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [toast]);

  return (
    <Layout>
      <Box pb="10">
        {/* Welcome Header */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="6">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Branch Control Center</Heading>
            <Text fontSize="sm" color="gray.500" mt="1" fontWeight="400">
               Bhai, your branch is performing <Text as="span" color="green.500" fontWeight="600">Excellent</Text> today!
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
            value="$12,450" 
            icon={TrendingUp} 
            trend="+15.4%" 
            color="green" 
            onClick={() => navigate('/branch/sales-history')}
          />
          <StatCard 
            title="Current Inventory" 
            value="842 Units" 
            icon={Package} 
            trend="-2.1%" 
            color="brand" 
            onClick={() => navigate('/branch/manage-products')}
          />
          <StatCard 
            title="Today's Invoices" 
            value="32 Bills" 
            icon={Receipt} 
            trend="+8 New" 
            color="blue" 
            onClick={() => navigate('/branch/sales-history')}
          />
          <StatCard 
            title="Low Stock Alerts" 
            value="03 Items" 
            icon={AlertCircle} 
            trend="Critical" 
            color="red" 
            onClick={() => navigate('/branch/low-stock')}
          />
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
          <GridItem colSpan={{ base: 3, lg: 2 }} className="premium-card" p="6">
            <Flex justify="space-between" align="center" mb="6">
              <HStack spacing="3">
                 <Box bg="green.50" p="2" borderRadius="lg">
                    <Icon as={Activity} color="green.500" size={18} />
                 </Box>
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Sales Velocity</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Hourly revenue tracking</Text>
                 </VStack>
              </HStack>
              <Box bg="gray.50" px="3" py="1" borderRadius="lg">
                 <Text fontSize="10px" fontWeight="700" color="secondary">Today, May 06</Text>
              </Box>
            </Flex>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#28C76F" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#28C76F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#919EAB', fontSize: 10, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#28C76F" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
             <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6" bg="secondary" color="white">
                   <VStack align="start" spacing="4">
                      <Heading size="xs" fontWeight="700">Quick Actions</Heading>
                      <Button w="full" size="sm" leftIcon={<Plus size={14} />} bg="whiteAlpha.100" _hover={{ bg: 'whiteAlpha.200' }} border="1px solid white" variant="solid" color="white" borderRadius="xl" onClick={() => navigate('/branch/new-invoice')}>
                         Create Invoice
                      </Button>
                      <Button w="full" size="sm" leftIcon={<Package size={14} />} bg="whiteAlpha.100" _hover={{ bg: 'whiteAlpha.200' }} border="1px solid white" variant="solid" color="white" borderRadius="xl" onClick={() => navigate('/branch/manage-products')}>
                         Inventory Check
                      </Button>
                   </VStack>
                </Box>

                <Box className="premium-card" p="6">
                   <Heading size="xs" mb="5" color="secondary" fontWeight="700">Recent Orders</Heading>
                   <VStack align="stretch" spacing="4">
                      {[
                        { id: '#INV-8821', time: '5 mins ago', amount: '$420' },
                        { id: '#INV-8820', time: '12 mins ago', amount: '$1,250' },
                        { id: '#INV-8819', time: '45 mins ago', amount: '$85' },
                      ].map((inv, idx) => (
                        <Flex key={idx} justify="space-between" align="center">
                           <VStack align="start" spacing="0">
                              <Text fontSize="xs" fontWeight="700" color="secondary">{inv.id}</Text>
                              <Text fontSize="10px" color="gray.400">{inv.time}</Text>
                           </VStack>
                           <Text fontWeight="800" color="brand.500" fontSize="sm">{inv.amount}</Text>
                        </Flex>
                      ))}
                   </VStack>
                </Box>
             </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchDashboard;
