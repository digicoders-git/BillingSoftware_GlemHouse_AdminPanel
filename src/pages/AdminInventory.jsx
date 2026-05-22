import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  HStack,
  VStack,
  Spinner,
  Icon,
  Avatar,
  InputGroup,
  InputLeftElement,
  IconButton,
  Progress,
  Divider,
  Tag,
  TagLabel} from '@chakra-ui/react';
import { 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle, 
  Plus, 
  RefreshCcw,
  Search,
  Filter,
  History,
  TrendingUp,
  Box as BoxIcon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const AdminInventory = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: 'Restock'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, productsRes] = await Promise.all([
        API.get('/inventory/summary'),
        API.get('/inventory/product-report')
      ]);
      setSummary(summaryRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      toast({
        title: 'Sync Error',
        description: error.response?.data?.message || 'Failed to retrieve inventory data.',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast({ title: "Data Synced", status: "success", duration: 1500, size: "sm" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inventory/add', formData);
      toast({
        title: 'Stock Updated!',
        description: `${formData.quantity} units successfully added.`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      setFormData({ productId: '', quantity: '', reason: 'Restock' });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error adding stock',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'All' || 
     (filterStatus === 'Low' && p.totalStock <= 5 && p.totalStock > 0) ||
     (filterStatus === 'Out' && p.totalStock === 0) ||
     (filterStatus === 'Healthy' && p.totalStock > 5))
  );

  const getStatusColor = (stock) => {
    if (stock === 0) return 'red';
    if (stock <= 5) return 'orange';
    return 'green';
  };

  return (
    <Layout>
      <Box pb="10">
        {/* Header Section */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="800" letterSpacing="-1px">
              Warehouse Hub
            </Heading>
            <Text color="gray.500" fontSize="sm" mt="1">Real-time control over your central stock levels</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button 
                leftIcon={<History size={16} />} 
                variant="outline" 
                borderRadius="xl"
                size="sm"
                onClick={() => navigate('/admin/inventory-logs')}
            >
                View Logs
            </Button>
            <Button 
                leftIcon={<RefreshCcw size={16} />} 
                variant="ghost" 
                borderRadius="xl"
                size="sm"
                onClick={handleRefresh}
                isLoading={refreshing}
            >
                Sync
            </Button>
            <Button 
                leftIcon={<Plus size={18} />} 
                colorScheme="brand" 
                borderRadius="xl"
                size="sm"
                px="6"
                onClick={onOpen}
                shadow="0 4px 14px 0 rgba(41, 138, 198, 0.4)"
            >
                Add Stock
            </Button>
          </HStack>
        </Flex>

        {loading && !refreshing ? (
          <Flex h="50vh" align="center" justify="center" direction="column" gap="4">
             <Spinner size="xl" color="brand.500" thickness="4px" />
             <Text fontWeight="700" color="gray.400" fontSize="xs">Loading Inventory Records...</Text>
          </Flex>
        ) : (
          <>
            {/* Summary Stats Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="6" mb="10">
              <SummaryCard 
                title="Total Models" 
                value={summary?.totalProducts || 0} 
                icon={BoxIcon} 
                color="blue" 
                delay={0}
              />
              <SummaryCard 
                title="Global Network Stock" 
                value={summary?.totalGlobalStock || 0} 
                icon={Package} 
                color="brand" 
                delay={0.1}
                suffix="Units"
              />
              <SummaryCard 
                title="Lifetime IN" 
                value={summary?.stockIn || 0} 
                icon={ArrowDownCircle} 
                color="green" 
                delay={0.2}
              />
              <SummaryCard 
                title="Lifetime OUT" 
                value={summary?.stockOut || 0} 
                icon={ArrowUpCircle} 
                color="orange" 
                delay={0.3}
              />
            </SimpleGrid>

            {/* Critical Alert Bar */}
            <AnimatePresence>
              {summary?.lowStockCount > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  mb="8"
                  p="4"
                  bg="red.50"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="red.100"
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing="4">
                      <Box p="2.5" bg="red.100" borderRadius="xl" color="red.600">
                        <AlertTriangle size={20} />
                      </Box>
                      <Box>
                        <Text fontWeight="800" color="red.700" fontSize="sm">Attention Needed!</Text>
                        <Text color="red.600" fontSize="xs">{summary.lowStockCount} items are running below minimum safety levels.</Text>
                      </Box>
                    </HStack>
                    <Button size="xs" colorScheme="red" variant="solid" px="4" borderRadius="lg" onClick={() => setFilterStatus('Low')}>
                      Restock Now
                    </Button>
                  </Flex>
                </MotionBox>
              )}
            </AnimatePresence>

            {/* Inventory Table Container */}
            <Box className="premium-card" overflow="hidden">
               {/* Search & Filter Bar */}
               <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
                  <Flex direction={{ base: 'column', lg: 'row' }} gap="4" justify="space-between" align={{ base: 'stretch', lg: 'center' }}>
                     <InputGroup maxW={{ base: 'full', lg: '400px' }} size="sm">
                        <InputLeftElement pointerEvents="none">
                           <Search size={16} color="#919EAB" />
                        </InputLeftElement>
                        <Input 
                           placeholder="Search by name or SKU..." 
                           bg="white" 
                           borderRadius="xl" 
                           border="1px solid" 
                           borderColor="gray.200"
                           _focus={{ borderColor: 'brand.500', shadow: 'sm' }}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </InputGroup>
                     <HStack spacing="3">
                        <Tag size="lg" variant="subtle" colorScheme="gray" borderRadius="full" cursor="pointer" onClick={() => setFilterStatus('All')} opacity={filterStatus === 'All' ? 1 : 0.6}>
                           <TagLabel fontSize="10px" fontWeight="800">ALL</TagLabel>
                        </Tag>
                        <Tag size="lg" variant="subtle" colorScheme="orange" borderRadius="full" cursor="pointer" onClick={() => setFilterStatus('Low')} opacity={filterStatus === 'Low' ? 1 : 0.6}>
                           <TagLabel fontSize="10px" fontWeight="800">LOW</TagLabel>
                        </Tag>
                        <Tag size="lg" variant="subtle" colorScheme="red" borderRadius="full" cursor="pointer" onClick={() => setFilterStatus('Out')} opacity={filterStatus === 'Out' ? 1 : 0.6}>
                           <TagLabel fontSize="10px" fontWeight="800">OUT</TagLabel>
                        </Tag>
                        <Divider orientation="vertical" h="20px" />
                        <IconButton aria-label="Filter" icon={<Filter size={16} />} size="sm" variant="ghost" borderRadius="full" />
                     </HStack>
                  </Flex>
               </Box>

               {/* Table Content */}
               <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg="gray.50/50">
                      <Tr>
                        <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Product Model</Th>
                        <Th color="gray.400" border="none" py="4" fontSize="10px">Lifecycle</Th>
                        <Th color="gray.400" border="none" py="4" fontSize="10px">Inventory</Th>
                        <Th color="gray.400" border="none" py="4" fontSize="10px">Valuation</Th>
                        <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                        <Th color="gray.400" border="none" py="4" px="8"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredProducts.length > 0 ? filteredProducts.map((p, idx) => (
                        <MotionTr 
                          key={p._id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: idx * 0.03 }}
                          _hover={{ bg: 'gray.50/30' }}
                        >
                          <Td borderColor="gray.100" py="4" px="8">
                             <HStack spacing="3">
                                <Avatar 
                                  size="xs" 
                                  icon={<BoxIcon size={14} />} 
                                  bg="brand.50" 
                                  color="brand.500" 
                                  borderRadius="lg" 
                                />
                                <Box>
                                   <Text fontWeight="800" color="secondary" fontSize="xs">{p.name}</Text>
                                   <Text fontSize="10px" color="gray.400" fontWeight="700" letterSpacing="0.5px">{p.sku}</Text>
                                </Box>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <HStack spacing="4">
                                <VStack align="start" spacing="0">
                                   <Text fontSize="9px" color="gray.400" fontWeight="700">IN</Text>
                                   <Text fontSize="xs" fontWeight="800" color="green.500">+{p.totalIn}</Text>
                                </VStack>
                                <VStack align="start" spacing="0">
                                   <Text fontSize="9px" color="gray.400" fontWeight="700">OUT</Text>
                                   <Text fontSize="xs" fontWeight="800" color="orange.500">-{p.totalOut}</Text>
                                </VStack>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <VStack align="start" spacing="1">
                                <HStack spacing="2">
                                   <Text fontWeight="900" fontSize="sm" color={p.totalStock <= 5 ? "red.600" : "secondary"}>
                                      {p.totalStock} Units
                                   </Text>
                                   <Badge size="xs" variant="ghost" colorScheme="gray" fontSize="8px" fontWeight="700">TOTAL</Badge>
                                </HStack>
                                <HStack spacing="2">
                                   <Box>
                                      <Text fontSize="9px" color="gray.400" fontWeight="700">WHS: {p.warehouseStock}</Text>
                                   </Box>
                                   <Box>
                                      <Text fontSize="9px" color="brand.400" fontWeight="700">BCH: {p.branchStock}</Text>
                                   </Box>
                                </HStack>
                                <Progress 
                                   value={(p.totalStock / 50) * 100} 
                                   size="xs" 
                                   w="60px" 
                                   borderRadius="full" 
                                   colorScheme={getStatusColor(p.totalStock)} 
                                />
                             </VStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <Text fontWeight="800" color="secondary" fontSize="xs">₹{(p.value || 0).toLocaleString()}</Text>
                          </Td>
                          <Td borderColor="gray.100">
                             <Badge 
                                colorScheme={getStatusColor(p.totalStock)} 
                                variant="subtle" 
                                borderRadius="full" 
                                px="3" 
                                py="0.5" 
                                fontSize="9px" 
                                fontWeight="800"
                             >
                                {p.totalStock > 10 ? "Optimal" : p.totalStock > 0 ? "Critically Low" : "Empty"}
                             </Badge>
                          </Td>
                          <Td borderColor="gray.100" py="4" px="8">
                             <IconButton 
                                aria-label="More" 
                                icon={<Plus size={14} />} 
                                size="xs" 
                                variant="ghost" 
                                color="brand.500" 
                                borderRadius="full"
                                onClick={() => {
                                   setFormData({ ...formData, productId: p._id });
                                   onOpen();
                                }}
                             />
                          </Td>
                        </MotionTr>
                      )) : (
                        <Tr>
                           <Td colSpan="6" textAlign="center" py="20">
                              <VStack spacing="3">
                                 <Icon as={Search} color="gray.300" fontSize="30px" />
                                 <Text color="gray.400" fontWeight="700" fontSize="xs">No records found.</Text>
                                 <Button size="xs" variant="link" onClick={() => {setSearchTerm(''); setFilterStatus('All');}}>Reset Filters</Button>
                              </VStack>
                           </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
               </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Modern Add Stock Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.300" />
        <ModalContent borderRadius="3xl" overflow="hidden" p="1">
          <form onSubmit={handleSubmit}>
            <ModalHeader pb="0" pt="6" px="8">
               <HStack spacing="3">
                  <Box p="2.5" bg="brand.50" color="brand.500" borderRadius="xl">
                     <TrendingUp size={20} />
                  </Box>
                  <VStack align="start" spacing="0">
                     <Text fontSize="lg" fontWeight="900" color="secondary">Replenish Stock</Text>
                     <Text fontSize="11px" color="gray.400" fontWeight="600">Update warehouse inventory levels</Text>
                  </VStack>
               </HStack>
            </ModalHeader>
            <ModalCloseButton mt="4" mr="4" borderRadius="full" />
            <ModalBody py="8" px="8">
              <VStack spacing="5">
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.500">Target Product</FormLabel>
                  <Select 
                    placeholder="Choose a model to restock" 
                    bg="gray.50"
                    border="none"
                    h="50px"
                    borderRadius="xl"
                    fontSize="sm"
                    fontWeight="700"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  >
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} — ({p.sku})</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.500">Unit Quantity</FormLabel>
                  <Input 
                    type="number" 
                    placeholder="Enter amount (e.g. 100)" 
                    bg="gray.50"
                    border="none"
                    h="50px"
                    borderRadius="xl"
                    fontSize="sm"
                    fontWeight="700"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="800" color="gray.500">Reason / Reference</FormLabel>
                  <Input 
                    placeholder="e.g. Bulk Purchase, Returned Goods" 
                    bg="gray.50"
                    border="none"
                    h="50px"
                    borderRadius="xl"
                    fontSize="sm"
                    fontWeight="700"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter bg="gray.50/50" px="8" py="6">
              <Button variant="ghost" mr={3} borderRadius="xl" onClick={onClose} fontWeight="700">Discard</Button>
              <Button 
                 colorScheme="brand" 
                 type="submit" 
                 borderRadius="xl" 
                 px="10" 
                 h="45px" 
                 shadow="lg"
                 rightIcon={<ArrowRight size={18} />}
              >
                 Confirm Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

const SummaryCard = ({ title, value, icon, color, delay, suffix }) => (
  <MotionBox 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    bg="white" 
    p="6" 
    borderRadius="24px" 
    shadow="sm" 
    border="1px solid" 
    borderColor="gray.100"
    _hover={{ transform: 'translateY(-4px)', shadow: 'xl', borderColor: `${color}.200` }}
    cursor="default"
  >
    <Flex align="center">
      <Box p="3" bg={`${color}.50`} borderRadius="18px" mr="5">
        <Icon as={icon} color={`${color}.500`} fontSize="24px" />
      </Box>
      <VStack align="start" spacing="0">
        <Text color="gray.400" fontSize="10px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">{title}</Text>
        <HStack align="baseline" spacing="1">
           <Heading size="md" fontWeight="900" color="secondary" letterSpacing="-0.5px">{value}</Heading>
           {suffix && <Text fontSize="10px" fontWeight="700" color="gray.300">{suffix}</Text>}
        </HStack>
      </VStack>
    </Flex>
  </MotionBox>
);

export default AdminInventory;
