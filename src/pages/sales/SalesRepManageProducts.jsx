import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  FormControl,
  FormLabel,
  SimpleGrid,
  Tooltip,
  Progress,
  Select,
  Avatar,
  Spinner,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  Image
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  ShoppingBag,
  History,
  Layers,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const SalesRepManageProducts = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustAction, setAdjustAction] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get('/branch-inventory'); // Backend handles role filtering
      setInventory(data.inventory);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching inventory",
        status: "error",
      });
      setLoading(false);
    }
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setAdjustQty(1);
    setAdjustAction('add');
    onOpen();
  };

  const submitAdjustment = async () => {
    if (adjustQty <= 0) return;
    setUpdating(true);
    try {
      await API.put(`/branch-inventory/${selectedProduct._id}/adjust`, {
        action: adjustAction,
        quantity: adjustQty,
        reason: 'Super Stocklist Partner Manual Adjustment'
      });
      toast({ title: "Stock updated", status: "success" });
      onClose();
      fetchInventory();
    } catch (error) {
      toast({ title: "Adjustment failed", status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteDialog = (row) => {
    setProductToDelete(row);
    onDeleteOpen();
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/branch-inventory/${productToDelete._id}`);
      toast({ title: "Product Removed", status: "success" });
      onDeleteClose();
      fetchInventory();
    } catch (error) {
      toast({ title: "Delete Failed", status: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredInventory = inventory.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(p => statusFilter === 'All' ? true : p.status === statusFilter);

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
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">My Digital Shelf</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="500">Inventory currently available in your possession for Super Stocklist</Text>
          </Box>
          <HStack spacing="3">
             <Button 
                leftIcon={<Plus size={18} />} 
                colorScheme="brand" 
                borderRadius="2xl" 
                shadow="xl" 
                px="8" 
                h="48px"
                fontWeight="900"
                onClick={() => navigate('/sales/received-stock')}
                _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
             >
                Receive New Stock
             </Button>
          </HStack>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="6" mb="10">
            {[
              { label: 'Total Units', value: stats.totalItems, color: 'brand', icon: Package },
              { label: 'Shelf Value', value: `₹${stats.totalValue?.toLocaleString()}`, color: 'blue', icon: TrendingUp },
              { label: 'Low Items', value: stats.lowStockCount, color: 'orange', icon: AlertTriangle },
              { label: 'Out of Stock', value: stats.outOfStockCount, color: 'red', icon: History },
            ].map((stat, idx) => (
              <Box 
                key={idx} 
                className="premium-card" 
                p="6" 
                position="relative" 
                overflow="hidden"
                border="1px solid"
                borderColor="gray.100"
              >
                 <Flex justify="space-between" align="start">
                    <Box zIndex="1">
                        <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">{stat.label}</Text>
                        <Heading size="lg" color="secondary" mt="2" fontWeight="900">{stat.value}</Heading>
                    </Box>
                    <Box p="3" bg={`${stat.color}.50`} borderRadius="xl" color={`${stat.color}.500`} shadow="sm">
                        <Icon as={stat.icon} fontSize="20px" />
                    </Box>
                 </Flex>
                 <Box position="absolute" bottom="-10px" right="-10px" color={`${stat.color}.50`} opacity="0.5" transform="rotate(-15deg)">
                    <Icon as={stat.icon} fontSize="60px" />
                 </Box>
              </Box>
            ))}
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden" border="1px solid" borderColor="gray.100">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex gap="4" direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }}>
              <InputGroup maxW={{ base: "full", md: "400px" }}>
                <InputLeftElement h="48px"><Search size={18} color="#919EAB" /></InputLeftElement>
                <Input 
                    placeholder="Search by name or SKU..." 
                    bg="white" 
                    h="48px"
                    borderRadius="xl" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fontWeight="600"
                    border="1px solid"
                    borderColor="gray.100"
                />
              </InputGroup>
              <HStack spacing="4">
                 <Select 
                    placeholder="All Status" 
                    h="48px" 
                    bg="white"
                    w="180px" 
                    borderRadius="xl" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    fontWeight="700"
                    border="1px solid"
                    borderColor="gray.100"
                 >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                 </Select>
                 <IconButton icon={<Download size={18} />} variant="outline" h="48px" w="48px" borderRadius="xl" aria-label="Download" />
              </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
                <Thead bg="gray.50/50">
                <Tr>
                    <Th py="5" px="8" fontSize="10px" color="gray.400" letterSpacing="1px">PRODUCT DETAILS</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">CATEGORY</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">AVAILABLE STOCK</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">UNIT PRICE</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">HEALTH</Th>
                    <Th py="5" px="8" textAlign="right"></Th>
                </Tr>
                </Thead>
                <Tbody>
                {filteredInventory.map((row) => (
                    <Tr key={row._id} _hover={{ bg: 'gray.50/30' }} transition="0.2s">
                    <Td py="5" px="8">
                        <HStack spacing="4">
                        <Box p="2.5" bg="brand.50" color="brand.500" borderRadius="xl" shadow="sm"><Package size={18} /></Box>
                        <Box>
                            <Text fontWeight="800" fontSize="sm" color="secondary">{row.name}</Text>
                            <Text fontSize="10px" color="gray.400" fontWeight="800" letterSpacing="0.5px">{row.sku}</Text>
                        </Box>
                        </HStack>
                    </Td>
                    <Td>
                        <Badge variant="subtle" colorScheme="purple" borderRadius="lg" px="3" py="1" fontSize="10px" fontWeight="800">{row.category}</Badge>
                    </Td>
                    <Td>
                        <VStack align="start" spacing="1">
                            <Text fontWeight="900" fontSize="sm">{row.stock} <Text as="span" fontSize="10px" fontWeight="700" color="gray.400">UNITS</Text></Text>
                            <Progress value={Math.min((row.stock / 20) * 100, 100)} size="xs" w="60px" borderRadius="full" colorScheme={row.stock < 5 ? 'red' : 'green'} />
                        </VStack>
                    </Td>
                    <Td><Text fontWeight="900" fontSize="sm" color="secondary">₹{row.price?.toLocaleString()}</Text></Td>
                    <Td>
                        <Badge 
                            colorScheme={row.status === 'In Stock' ? 'green' : row.status === 'Low Stock' ? 'orange' : 'red'} 
                            variant="solid" 
                            borderRadius="full" 
                            px="3" 
                            py="0.5"
                            fontSize="9px"
                            fontWeight="900"
                        >
                        {row.status}
                        </Badge>
                    </Td>
                    <Td py="5" px="8" textAlign="right">
                        <HStack justify="flex-end" spacing="2">
                        <Tooltip label="Quick Adjust" borderRadius="lg">
                            <IconButton aria-label="Adjust" icon={<Layers size={16} />} size="sm" variant="ghost" color="brand.500" borderRadius="xl" onClick={() => handleAdjustStock(row)} />
                        </Tooltip>
                        <Menu>
                            <MenuButton as={IconButton} icon={<MoreVertical size={16} />} size="sm" variant="ghost" borderRadius="xl" />
                            <MenuList fontSize="xs" p="2" borderRadius="2xl" shadow="2xl" border="none">
                                <MenuItem borderRadius="lg" onClick={() => navigate('/sales/new-invoice')} fontWeight="700" py="2" icon={<Plus size={14}/>}>Generate Bill</MenuItem>
                                <Divider my="2" />
                                <MenuItem borderRadius="lg" color="red.500" onClick={() => openDeleteDialog(row)} fontWeight="700" py="2" icon={<Trash size={14}/>}>Remove Product</MenuItem>
                            </MenuList>
                        </Menu>
                        </HStack>
                    </Td>
                    </Tr>
                ))}
                </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      {/* Adjust Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontSize="sm" fontWeight="900">Adjust Shelf Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            <VStack spacing="4">
              <HStack w="full" spacing="3">
                 <Box flex="1" p="3" bg="gray.50" borderRadius="xl" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="gray.400">ON SHELF</Text>
                    <Text fontSize="md" fontWeight="900">{selectedProduct?.stock}</Text>
                 </Box>
                 <Box flex="1" p="3" bg="brand.50" borderRadius="xl" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="brand.400">NEW STOCK</Text>
                    <Text fontSize="md" fontWeight="900" color="brand.500">
                      {adjustAction === 'add' ? (selectedProduct?.stock + Number(adjustQty)) : (selectedProduct?.stock - Number(adjustQty))}
                    </Text>
                 </Box>
              </HStack>
              <SimpleGrid columns={2} spacing="3" w="full">
                  <Button size="sm" colorScheme="green" variant={adjustAction === 'add' ? 'solid' : 'outline'} onClick={() => setAdjustAction('add')}>Add</Button>
                  <Button size="sm" colorScheme="red" variant={adjustAction === 'remove' ? 'solid' : 'outline'} onClick={() => setAdjustAction('remove')}>Remove</Button>
              </SimpleGrid>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700">Quantity</FormLabel>
                <NumberInput value={adjustQty} min={1} onChange={(val) => setAdjustQty(Number(val))} size="sm">
                  <NumberInputField borderRadius="lg" />
                </NumberInput>
              </FormControl>
              <Button colorScheme="brand" w="full" onClick={submitAdjustment} isLoading={updating} borderRadius="xl">Confirm Update</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="900">Remove from Shelf?</AlertDialogHeader>
            <AlertDialogBody>
               Are you sure you want to remove <b>{productToDelete?.name}</b> from your shelf?
            </AlertDialogBody>
            <AlertDialogFooter gap="3">
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost">Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteProduct} isLoading={deleting} borderRadius="xl">Yes, Remove</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default SalesRepManageProducts;

