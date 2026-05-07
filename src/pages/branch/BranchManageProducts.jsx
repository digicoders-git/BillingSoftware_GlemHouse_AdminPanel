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
  AlertDialogOverlay
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash,
  ArrowUpRight,
  Package,
  History,
  Layers,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Download
} from 'lucide-react';
import { 
  MenuDivider
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const BranchManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isLowStockView = location.pathname.includes('low-stock');
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
      const { data } = await API.get('/branch-inventory');
      setInventory(data.inventory);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching inventory",
        status: "error",
        duration: 3000,
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
        quantity: adjustQty
      });
      toast({
        title: "Stock updated",
        status: "success",
        duration: 2000,
      });
      onClose();
      fetchInventory();
    } catch (error) {
      toast({
        title: "Adjustment failed",
        description: error.response?.data?.message || "Error updating stock",
        status: "error",
        duration: 3000,
      });
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
      toast({
        title: "Product Removed",
        description: `"${productToDelete.name}" has been successfully removed from your branch inventory.`,
        status: "success",
        duration: 3000,
      });
      onDeleteClose();
      fetchInventory();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Error removing product",
        status: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (inventory.length === 0) return;
    
    const headers = ['Product Name', 'SKU', 'Category', 'Stock', 'Unit Price', 'Total Value', 'Status'];
    const csvData = inventory.map(p => [
      `"${p.name}"`,
      p.sku,
      p.category,
      p.stock,
      p.price,
      p.value,
      p.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Branch_Inventory_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, inventory data has been downloaded as CSV.",
      status: "success",
    });
  };

  const filteredInventory = inventory.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(p => isLowStockView ? (p.status === 'Low Stock' || p.status === 'Out of Stock') : true)
  .filter(p => statusFilter === 'All' ? true : p.status === statusFilter);

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
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb={isLowStockView ? '6' : '10'} gap="4">
          <Box>
            <HStack spacing="3" mb="1">
              {isLowStockView && (
                <Button leftIcon={<ArrowLeft size={16} />} variant="ghost" size="sm" borderRadius="xl" onClick={() => navigate('/branch/manage-products')} px="2" color="gray.500">
                  Back
                </Button>
              )}
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">
               {isLowStockView ? '⚠️ Low Stock Alerts' : 'Stock Control Center'}
            </Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">
               {isLowStockView 
                 ? `${filteredInventory.length} item${filteredInventory.length !== 1 ? 's' : ''} need immediate attention`
                 : 'Monitor and manage your branch inventory levels'}
            </Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            {isLowStockView ? (
              <>
                <Button leftIcon={<Package size={16} />} variant="outline" borderRadius="xl" size="sm" onClick={() => navigate('/branch/manage-products')}>
                  All Products
                </Button>
                <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" px="6" size="sm" onClick={() => navigate('/branch/received-stock')}>
                  Receive Stock
                </Button>
              </>
            ) : (
              <>
                <Button leftIcon={<History size={16} />} variant="outline" borderRadius="xl" size="sm" onClick={() => navigate('/branch/inventory-log')}>
                  Inventory Log
                </Button>
                <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" px="6" size="sm" onClick={() => navigate('/branch/received-stock')}>
                  Receive Stock
                </Button>
              </>
            )}
          </HStack>
        </Flex>

        {/* Low Stock Warning Banner */}
        {isLowStockView && filteredInventory.length > 0 && (
          <Box mb="8" p="4" bg="orange.50" borderRadius="xl" border="1px solid" borderColor="orange.200">
            <HStack spacing="3">
              <Box p="2" bg="orange.100" borderRadius="lg" color="orange.500">
                <AlertTriangle size={18} />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="700" color="orange.700">
                  {stats.outOfStockCount > 0 
                    ? `${stats.outOfStockCount} item${stats.outOfStockCount > 1 ? 's' : ''} completely out of stock — restock immediately!`
                    : `${stats.lowStockCount} item${stats.lowStockCount > 1 ? 's' : ''} running critically low`
                  }
                </Text>
                <Text fontSize="xs" color="orange.600">Click "Receive Stock" to replenish inventory.</Text>
              </Box>
            </HStack>
          </Box>
        )}

        {/* Quick Stock Stats */}
        <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} spacing="6" mb="10">
           {(isLowStockView ? [
              { label: 'Critical Items', value: `${filteredInventory.length} Items`, color: 'orange', onClick: null },
              { label: 'Low Stock', value: `${stats.lowStockCount ?? 0} Items`, color: 'orange', onClick: null },
              { label: 'Out of Stock', value: `${stats.outOfStockCount ?? 0} Items`, color: 'red', onClick: null },
              { label: 'Total Inventory', value: `${stats.totalItems ?? 0} Units`, color: 'brand', onClick: () => navigate('/branch/manage-products') },
           ] : [
              { label: 'Total Units', value: `${stats.totalItems ?? 0} Units`, color: 'brand', onClick: null },
              { label: 'Stock Value', value: `₹${stats.totalValue?.toLocaleString() ?? 0}`, color: 'blue', onClick: null },
              { label: 'Low Stock', value: `${stats.lowStockCount ?? 0} Items`, color: 'orange', onClick: () => navigate('/branch/low-stock') },
              { label: 'Out of Stock', value: `${stats.outOfStockCount ?? 0} Items`, color: 'red', onClick: () => navigate('/branch/low-stock') },
           ]).map((stat, idx) => (
              <Box 
                key={idx} 
                className="premium-card" 
                p="5" 
                borderLeft="3px solid" 
                borderColor={`${stat.color}.400`} 
                transition="all 0.3s" 
                cursor={stat.onClick ? 'pointer' : 'default'}
                _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}
                onClick={stat.onClick}
              >
                 <VStack align="start" spacing="0">
                    <Text fontSize="10px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                    <Heading size="md" color="secondary" mt="1" fontWeight="700">{stat.value}</Heading>
                 </VStack>
              </Box>
           ))}
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex direction={{ base: 'column', lg: 'row' }} gap="4" justify="space-between" align={{ base: 'stretch', lg: 'center' }}>
              <InputGroup maxW={{ base: 'full', lg: '350px' }} size="sm">
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="#919EAB" />
                </InputLeftElement>
                <Input 
                  placeholder="Search inventory..." 
                  bg="white" 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="gray.200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <HStack spacing="3">
                <Select placeholder="All Categories" borderRadius="lg" bg="white" maxW="150px" size="sm" fontSize="11px">
                  <option>Mobiles</option>
                  <option>Laptops</option>
                  <option>Accessories</option>
                </Select>
                <Menu>
                  <MenuButton 
                    as={Button} 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Filter size={16} />} 
                    rightIcon={<ChevronDown size={14} />}
                    borderRadius="lg" 
                    fontWeight="600"
                    px="4"
                  >
                    Filter: {statusFilter}
                  </MenuButton>
                  <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                    <MenuItem fontSize="xs" fontWeight="700" onClick={() => setStatusFilter('All')}>All Products</MenuItem>
                    <MenuDivider />
                    <MenuItem fontSize="xs" fontWeight="700" color="green.500" onClick={() => setStatusFilter('In Stock')}>In Stock</MenuItem>
                    <MenuItem fontSize="xs" fontWeight="700" color="orange.500" onClick={() => setStatusFilter('Low Stock')}>Low Stock</MenuItem>
                    <MenuItem fontSize="xs" fontWeight="700" color="red.500" onClick={() => setStatusFilter('Out of Stock')}>Out of Stock</MenuItem>
                  </MenuList>
                </Menu>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  leftIcon={<Download size={16} />} 
                  borderRadius="lg" 
                  fontWeight="600"
                  px="4"
                  onClick={handleExport}
                >
                  Export
                </Button>
              </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Product Details</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Category</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Inventory</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Unit Price</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Total Value</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                  <Th color="gray.400" border="none" py="4" px="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredInventory.length > 0 ? filteredInventory.map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                      <HStack spacing="3">
                        <Avatar 
                          size="xs" 
                          src={row.image ? (row.image.startsWith('http') ? row.image : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${row.image.startsWith('uploads/') ? row.image : `uploads/${row.image}`}`) : null}
                          icon={<Package size={14} />} 
                          bg="brand.50" 
                          color="brand.500" 
                          borderRadius="lg" 
                        />
                        <Box>
                          <Text fontWeight="700" color="secondary" fontSize="xs">{row.name}</Text>
                          <Text fontSize="10px" color="gray.400" fontWeight="600">{row.sku}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <Badge bg="blue.50" color="blue.600" variant="subtle" borderRadius="full" px="2" fontSize="9px" fontWeight="700">
                        {row.category}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100">
                       <VStack align="start" spacing="0">
                          <Text fontWeight="800" fontSize="xs" color={row.stock < 10 ? 'red.500' : 'secondary'}>{row.stock} Units</Text>
                          <Progress value={(row.stock / 50) * 100} size="xs" w="50px" borderRadius="full" colorScheme={row.stock < 10 ? 'red' : 'green'} mt="1" />
                       </VStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontWeight="700" fontSize="xs">₹{row.price}</Text></Td>
                    <Td borderColor="gray.100"><Text fontWeight="700" color="secondary" fontSize="xs">₹{row.value?.toLocaleString()}</Text></Td>
                    <Td borderColor="gray.100">
                      <Badge 
                        bg={row.status === 'In Stock' ? 'green.50' : row.status === 'Low Stock' ? 'orange.50' : 'red.50'} 
                        color={row.status === 'In Stock' ? 'green.600' : row.status === 'Low Stock' ? 'orange.600' : 'red.600'} 
                        borderRadius="full" 
                        px="2.5"
                        py="0.5"
                        fontSize="9px"
                        fontWeight="700"
                        variant="subtle"
                      >
                         <HStack spacing="1">
                            <Box w="5px" h="5px" borderRadius="full" bg={row.status === 'In Stock' ? 'green.600' : row.status === 'Low Stock' ? 'orange.600' : 'red.600'} />
                            <Text>{row.status}</Text>
                         </HStack>
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" py="4" px="8">
                      <HStack spacing="1">
                        <Tooltip label="Adjust Stock" borderRadius="lg">
                          <IconButton aria-label="Adjust Stock" icon={<Layers size={14} />} variant="ghost" size="xs" color="gray.400" borderRadius="full" onClick={() => handleAdjustStock(row)} />
                        </Tooltip>
                        <Menu>
                          <MenuButton as={IconButton} aria-label="Actions" icon={<MoreVertical size={14} />} variant="ghost" size="xs" borderRadius="full" />
                          <MenuList borderRadius="xl" shadow="2xl" border="none" p="1">
                            <MenuItem icon={<Icon as={Package} size={12} />} fontSize="xs" onClick={() => navigate(`/branch/view-product/${row.productID}`)}>View Details</MenuItem>
                            <MenuItem icon={<Edit size={12} />} fontSize="xs" onClick={() => navigate(`/branch/edit-product/${row.productID}`)}>Edit Product</MenuItem>
                            <MenuItem icon={<History size={12} />} fontSize="xs" onClick={() => navigate('/branch/inventory-log')}>Stock History</MenuItem>
                            <Divider my="1" />
                            <MenuItem icon={<Trash size={12} />} fontSize="xs" color="red.500" onClick={() => openDeleteDialog(row)}>Delete Product</MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan="7" textAlign="center" py="10" color="gray.400">No products found in inventory</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      {/* Adjust Stock Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" p="1">
          <ModalHeader>
             <VStack align="start" spacing="0">
                <Text fontSize="sm" fontWeight="800" color="secondary">Adjust Stock</Text>
                <Text fontSize="10px" color="gray.400">{selectedProduct?.name}</Text>
             </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4" py="2">
              <HStack w="full" spacing="3">
                 <Box flex="1" p="3" bg="background" borderRadius="lg" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="gray.400">CURRENT</Text>
                    <Text fontSize="md" fontWeight="800" color="secondary">{selectedProduct?.stock}</Text>
                 </Box>
                 <Icon as={ArrowUpRight} size={16} color="gray.300" />
                 <Box flex="1" p="3" bg="brand.50" borderRadius="lg" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="brand.400">TARGET</Text>
                    <Text fontSize="md" fontWeight="800" color="brand.500">
                      {adjustAction === 'add' ? (selectedProduct?.stock + Number(adjustQty)) : (selectedProduct?.stock - Number(adjustQty))}
                    </Text>
                 </Box>
              </HStack>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700">Action</FormLabel>
                <SimpleGrid columns={2} spacing="3">
                   <Button 
                    leftIcon={<Plus size={14} />} 
                    variant={adjustAction === 'add' ? 'solid' : 'outline'} 
                    colorScheme="green" 
                    size="sm" 
                    borderRadius="lg"
                    onClick={() => setAdjustAction('add')}
                  >Add</Button>
                   <Button 
                    leftIcon={<Trash size={14} />} 
                    variant={adjustAction === 'remove' ? 'solid' : 'outline'} 
                    colorScheme="red" 
                    size="sm" 
                    borderRadius="lg"
                    onClick={() => setAdjustAction('remove')}
                  >Remove</Button>
                </SimpleGrid>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700">Quantity</FormLabel>
                <NumberInput 
                  value={adjustQty} 
                  min={1} 
                  max={adjustAction === 'remove' ? selectedProduct?.stock : 1000}
                  onChange={(val) => setAdjustQty(Number(val))}
                  size="sm"
                >
                  <NumberInputField borderRadius="lg" bg="background" border="none" />
                  <NumberInputStepper>
                    <NumberIncrementStepper border="none" />
                    <NumberDecrementStepper border="none" />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap="2">
            <Button variant="ghost" size="sm" onClick={onClose} borderRadius="lg">Cancel</Button>
            <Button 
              colorScheme="brand" 
              size="sm" 
              px="6" 
              borderRadius="lg" 
              onClick={submitAdjustment}
              isLoading={updating}
            >Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl" mx="4">
            <AlertDialogHeader fontSize="lg" fontWeight="800" color="secondary">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody color="gray.600">
              Bhai, kya aap sach mein{' '}
              <Text as="span" fontWeight="700" color="secondary">
                "{productToDelete?.name}"
              </Text>{' '}
              ko inventory se hatana chahte hain? Ye action wapas nahi liya ja sakta.
            </AlertDialogBody>

            <AlertDialogFooter gap="3">
              <Button ref={cancelRef} onClick={onDeleteClose} borderRadius="xl" variant="ghost">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteProduct}
                borderRadius="xl"
                px="6"
                isLoading={deleting}
                boxShadow="0 4px 14px 0 rgba(229, 62, 62, 0.35)"
              >
                Yes, Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default BranchManageProducts;

