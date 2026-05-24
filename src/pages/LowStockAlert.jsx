import { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, useToast, HStack, VStack, Spinner, Icon,
  Avatar, Progress, SimpleGrid
} from '@chakra-ui/react';
import { AlertTriangle, Package, RefreshCcw, ArrowLeft, Plus } from 'lucide-react';
import API from '../utils/api';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LowStockAlert = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/inventory/product-report');
      // Same logic as dashboard: warehouse stock <= minLevel
      const lowStock = data.filter(p => p.warehouseStock <= (p.minLevel || 5));
      setProducts(lowStock);
    } catch (error) {
      toast({ title: 'Error loading low stock data', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLowStock(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLowStock();
    setRefreshing(false);
    toast({ title: 'Refreshed', status: 'success', duration: 1500 });
  };

  const getStatusColor = (warehouseStock, minLevel) => {
    if (warehouseStock <= 0) return 'red';
    if (warehouseStock <= (minLevel || 5)) return 'orange';
    return 'green';
  };

  const outOfStock = products.filter(p => p.warehouseStock === 0).length;
  const critical = products.filter(p => p.warehouseStock > 0 && p.warehouseStock <= (p.minLevel || 5)).length;

  return (
    <Layout>
      <Box pb="10">
        {/* Header */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <HStack mb="2" cursor="pointer" onClick={() => navigate('/admin/inventory')} _hover={{ color: 'brand.500' }}>
              <ArrowLeft size={16} />
              <Text fontSize="xs" fontWeight="700" color="gray.400">Back to Inventory</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="800" letterSpacing="-1px">
              Low Stock Alerts
            </Heading>
            <Text color="gray.500" fontSize="sm" mt="1">Products that need immediate restocking</Text>
          </Box>
          <HStack spacing="3">
            <Button leftIcon={<RefreshCcw size={16} />} variant="ghost" borderRadius="xl" size="sm" onClick={handleRefresh} isLoading={refreshing}>
              Refresh
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" size="sm" onClick={() => navigate('/admin/inventory')}>
              Add Stock
            </Button>
          </HStack>
        </Flex>

        {loading ? (
          <Flex h="50vh" align="center" justify="center" direction="column" gap="4">
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text fontWeight="700" color="gray.400" fontSize="xs">Scanning inventory...</Text>
          </Flex>
        ) : (
          <>
            {/* Summary Cards */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="6" mb="8">
              <MotionBox whileHover={{ y: -3 }} bg="white" p="6" borderRadius="2xl" border="1px solid" borderColor="red.100" shadow="sm">
                <Flex align="center" gap="4">
                  <Box bg="red.50" p="3" borderRadius="xl" color="red.500"><AlertTriangle size={22} /></Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Total Alerts</Text>
                    <Heading size="lg" color="red.500" fontWeight="900">{products.length}</Heading>
                  </Box>
                </Flex>
              </MotionBox>
              <MotionBox whileHover={{ y: -3 }} bg="white" p="6" borderRadius="2xl" border="1px solid" borderColor="orange.100" shadow="sm">
                <Flex align="center" gap="4">
                  <Box bg="orange.50" p="3" borderRadius="xl" color="orange.500"><Package size={22} /></Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Critically Low</Text>
                    <Heading size="lg" color="orange.500" fontWeight="900">{critical}</Heading>
                  </Box>
                </Flex>
              </MotionBox>
              <MotionBox whileHover={{ y: -3 }} bg="white" p="6" borderRadius="2xl" border="1px solid" borderColor="red.200" shadow="sm">
                <Flex align="center" gap="4">
                  <Box bg="red.100" p="3" borderRadius="xl" color="red.600"><Package size={22} /></Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Out of Stock</Text>
                    <Heading size="lg" color="red.600" fontWeight="900">{outOfStock}</Heading>
                  </Box>
                </Flex>
              </MotionBox>
            </SimpleGrid>

            {/* Table */}
            <Box className="premium-card" overflow="hidden">
              <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="red.50/30">
                <HStack spacing="3">
                  <Box bg="red.100" p="2" borderRadius="lg" color="red.600"><AlertTriangle size={18} /></Box>
                  <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="800">Products Needing Restock</Heading>
                    <Text fontSize="10px" color="gray.400">{products.length} item{products.length !== 1 ? 's' : ''} below minimum level</Text>
                  </VStack>
                </HStack>
              </Box>

              <Box overflowX="auto">
                {products.length === 0 ? (
                  <Flex direction="column" align="center" py="20" gap="4">
                    <Box bg="green.50" p="5" borderRadius="full">
                      <Icon as={Package} color="green.400" fontSize="40px" />
                    </Box>
                    <Heading size="sm" color="green.500" fontWeight="800">All Stock Levels Healthy!</Heading>
                    <Text fontSize="sm" color="gray.400">No products are below minimum stock level.</Text>
                  </Flex>
                ) : (
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontSize="10px" color="gray.400" py="4" px="8">Product</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Warehouse Stock</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Branch Stock</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Total Stock</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Min Level</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Stock Level</Th>
                        <Th fontSize="10px" color="gray.400" py="4">Status</Th>
                        <Th fontSize="10px" color="gray.400" py="4" px="8">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products.map((p, idx) => (
                        <Tr key={p._id} _hover={{ bg: 'red.50/20' }}>
                          <Td borderColor="gray.100" py="4" px="8">
                            <HStack spacing="3">
                              <Avatar size="xs" icon={<Package size={14} />} bg={p.warehouseStock <= 0 ? 'red.100' : 'orange.100'} color={p.warehouseStock <= 0 ? 'red.500' : 'orange.500'} borderRadius="lg" />
                              <Box>
                                <Text fontWeight="800" color="secondary" fontSize="xs">{p.name}</Text>
                                <Text fontSize="10px" color="gray.400" fontWeight="600">{p.sku}</Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                            <Text fontWeight="800" fontSize="sm" color={p.warehouseStock <= 0 ? 'red.500' : 'orange.500'}>{p.warehouseStock}</Text>
                          </Td>
                          <Td borderColor="gray.100">
                            <Text fontWeight="700" fontSize="sm" color="gray.600">{p.branchStock}</Text>
                          </Td>
                          <Td borderColor="gray.100">
                            <Text fontWeight="900" fontSize="sm" color={p.totalStock === 0 ? 'red.600' : 'orange.600'}>{p.totalStock} Units</Text>
                          </Td>
                          <Td borderColor="gray.100">
                            <Text fontWeight="600" fontSize="sm" color="gray.500">{p.minLevel || 5} Units</Text>
                          </Td>
                          <Td borderColor="gray.100">
                            <VStack align="start" spacing="1">
                              <Progress
                                value={Math.max(0, Math.min((p.warehouseStock / ((p.minLevel || 5) * 2)) * 100, 100))}
                                size="sm"
                                w="80px"
                                borderRadius="full"
                                colorScheme={getStatusColor(p.warehouseStock, p.minLevel)}
                              />
                              <Text fontSize="9px" color="gray.400" fontWeight="700">
                                {p.warehouseStock <= 0 ? '0%' : `${Math.round((p.warehouseStock / ((p.minLevel || 5) * 2)) * 100)}%`}
                              </Text>
                            </VStack>
                          </Td>
                          <Td borderColor="gray.100">
                            <Badge
                              colorScheme={p.warehouseStock <= 0 ? 'red' : 'orange'}
                              variant="solid"
                              borderRadius="full"
                              px="3"
                              fontSize="9px"
                              fontWeight="800"
                            >
                              {p.warehouseStock <= 0 ? 'OUT OF STOCK' : 'CRITICALLY LOW'}
                            </Badge>
                          </Td>
                          <Td borderColor="gray.100" px="8">
                            <Button
                              size="xs"
                              colorScheme="brand"
                              borderRadius="lg"
                              leftIcon={<Plus size={12} />}
                              onClick={() => navigate('/admin/inventory')}
                            >
                              Restock
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default LowStockAlert;
