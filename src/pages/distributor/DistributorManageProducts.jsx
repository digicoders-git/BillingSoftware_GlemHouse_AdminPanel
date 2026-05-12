import { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Input, 
  HStack, 
  VStack, 
  Flex, 
  IconButton,
  useToast,
  Spinner,
  Image,
  Tag,
  Icon,
  Grid
} from '@chakra-ui/react';
import { Search, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const DistributorManageProducts = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const toast = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/distributor-inventory');
      setInventory(data.inventory || []);
      setStats(data.stats);
    } catch (error) {
      toast({
        title: "Error loading inventory",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Partner Warehouse</Heading>
            <Text color="gray.500" fontWeight="500">Manage your current stock and shelf levels</Text>
          </Box>
          <HStack spacing="4" w={{ base: 'full', md: 'auto' }}>
            <Box position="relative" w={{ base: 'full', md: '300px' }}>
              <Input 
                placeholder="Search products..." 
                pl="10" 
                borderRadius="xl" 
                bg="white" 
                shadow="sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400">
                <Search size={18} />
              </Box>
            </Box>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap="6" mb="10">
          <StatMiniCard title="Total Stock" value={stats.totalItems} icon={Package} color="brand" />
          <StatMiniCard title="Stock Value" value={`₹${stats.totalValue.toLocaleString()}`} icon={TrendingUp} color="green" />
          <StatMiniCard title="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} color="orange" />
          <StatMiniCard title="Out of Stock" value={stats.outOfStockCount} icon={AlertTriangle} color="red" />
        </Grid>

        <Box className="premium-card" overflow="hidden">
          {loading ? (
            <Flex justify="center" align="center" py="20">
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th py="5" fontSize="11px" color="gray.400">Product Details</Th>
                    <Th py="5" fontSize="11px" color="gray.400">Category</Th>
                    <Th py="5" fontSize="11px" color="gray.400">Price</Th>
                    <Th py="5" fontSize="11px" color="gray.400">Stock Status</Th>
                    <Th py="5" fontSize="11px" color="gray.400" textAlign="right">Inventory Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredInventory.map((item) => (
                    <Tr key={item._id} _hover={{ bg: 'gray.50/50' }}>
                      <Td py="5">
                        <HStack spacing="4">
                          <VStack align="start" spacing="0">
                            <Text fontWeight="800" color="secondary" fontSize="sm">{item.name}</Text>
                            <Text fontSize="xs" color="gray.400">{item.sku}</Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Tag size="sm" variant="subtle" colorScheme="gray" borderRadius="full">
                          {item.category}
                        </Tag>
                      </Td>
                      <Td>
                        <Text fontWeight="700" fontSize="sm">₹{item.price.toLocaleString()}</Text>
                      </Td>
                      <Td>
                        <HStack spacing="3">
                          <Text fontWeight="900" fontSize="md">{item.stock}</Text>
                          <Badge 
                            colorScheme={item.status === 'In Stock' ? 'green' : (item.status === 'Low Stock' ? 'orange' : 'red')}
                            variant="subtle"
                            px="3"
                            py="1"
                            borderRadius="full"
                            fontSize="9px"
                          >
                            {item.status}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td textAlign="right">
                        <Text fontWeight="900" color="brand.500">₹{item.value.toLocaleString()}</Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {filteredInventory.length === 0 && (
                 <Flex direction="column" align="center" py="10">
                    <Text color="gray.400" fontWeight="600">No products found in your inventory</Text>
                 </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

const StatMiniCard = ({ title, value, icon, color }) => (
  <Box bg="white" p="5" borderRadius="2xl" shadow="sm">
    <Flex align="center">
      <Box p="3" bg={`${color}.50`} borderRadius="xl" color={`${color}.500`} mr="4">
        <Icon as={icon} fontSize="20" />
      </Box>
      <VStack align="start" spacing="0">
        <Text color="gray.400" fontSize="xs" fontWeight="700" textTransform="uppercase">{title}</Text>
        <Heading size="md" fontWeight="900" color="secondary">{value}</Heading>
      </VStack>
    </Flex>
  </Box>
);

export default DistributorManageProducts;
