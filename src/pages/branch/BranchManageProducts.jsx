import { useState } from 'react';
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
  Avatar
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
  TrendingUp,
  Layers} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const BranchManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLowStockView = location.pathname.includes('low-stock');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const allProducts = [
    { name: 'iPhone 15 Pro', sku: 'IP15P-001', category: 'Mobile', price: 999, stock: 12, status: 'In Stock', value: '$11,988' },
    { name: 'MacBook Air M2', sku: 'MBA-M2-01', category: 'Laptop', price: 1299, stock: 5, status: 'Low Stock', value: '$6,495' },
    { name: 'AirPods Pro 2', sku: 'APP2-001', category: 'Accessories', price: 249, stock: 25, status: 'In Stock', value: '$6,225' },
    { name: 'USB-C Adapter', sku: 'USB-C-01', category: 'Accessories', price: 19, stock: 0, status: 'Out of Stock', value: '$0' },
    { name: 'iPad Pro', sku: 'IPP-001', category: 'Tablet', price: 799, stock: 8, status: 'In Stock', value: '$6,392' },
  ];

  const products = isLowStockView 
    ? allProducts.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock')
    : allProducts;

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">
               {isLowStockView ? 'Low Stock Alerts' : 'Stock Control Center'}
            </Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">
               {isLowStockView ? 'Immediate attention required for these items' : 'Monitor and manage your branch inventory levels'}
            </Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<History size={16} />} variant="outline" borderRadius="xl" size="sm" onClick={() => navigate('/branch/inventory-log')}>
              Inventory Log
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" px="6" size="sm" onClick={() => navigate('/branch/add-product')}>
              Add Product
            </Button>
          </HStack>
        </Flex>

        {/* Quick Stock Stats */}
        <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} spacing="6" mb="10">
           {[
              { label: 'Total Items', value: '124 Units', color: 'brand' },
              { label: 'Stock Value', value: '$42,850', color: 'blue' },
              { label: 'Low Stock', value: '8 Items', color: 'red' },
              { label: 'Out of Stock', value: '2 Items', color: 'secondary' },
           ].map((stat, idx) => (
              <Box key={idx} className="premium-card" p="5" borderLeft="3px solid" borderColor={`${stat.color}.400`} transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
                 <VStack align="start" spacing="0">
                    <Text fontSize="10px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                    <Heading size="md" color={stat.label === 'Low Stock' ? 'red.500' : 'secondary'} mt="1" fontWeight="700">{stat.value}</Heading>
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
                <Input placeholder="Search inventory..." bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" />
              </InputGroup>
              <HStack spacing="3">
                <Select placeholder="All Categories" borderRadius="lg" bg="white" maxW="150px" size="sm" fontSize="11px">
                  <option>Mobiles</option>
                  <option>Laptops</option>
                </Select>
                <Button leftIcon={<Filter size={16} />} variant="outline" borderRadius="lg" size="sm" px="4" fontWeight="600">Filters</Button>
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
                {products.map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                      <HStack spacing="3">
                        <Avatar size="xs" icon={<Package size={14} />} bg="brand.50" color="brand.500" borderRadius="lg" />
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
                    <Td borderColor="gray.100"><Text fontWeight="700" fontSize="xs">${row.price}</Text></Td>
                    <Td borderColor="gray.100"><Text fontWeight="700" color="secondary" fontSize="xs">{row.value}</Text></Td>
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
                            <MenuItem icon={<Edit size={12} />} fontSize="xs">Edit Details</MenuItem>
                            <MenuItem icon={<History size={12} />} fontSize="xs" onClick={() => navigate('/branch/inventory-log')}>Stock History</MenuItem>
                            <MenuItem icon={<Trash size={12} />} color="red.500" fontSize="xs">Delete</MenuItem>
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
                 <Box flex="1" p="3" bg="gray.50" borderRadius="lg" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="gray.400">CURRENT</Text>
                    <Text fontSize="md" fontWeight="800" color="secondary">{selectedProduct?.stock}</Text>
                 </Box>
                 <Icon as={ArrowUpRight} size={16} color="gray.300" />
                 <Box flex="1" p="3" bg="brand.50" borderRadius="lg" textAlign="center">
                    <Text fontSize="9px" fontWeight="800" color="brand.400">TARGET</Text>
                    <Text fontSize="md" fontWeight="800" color="brand.500">--</Text>
                 </Box>
              </HStack>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700">Action</FormLabel>
                <SimpleGrid columns={2} spacing="3">
                   <Button leftIcon={<Plus size={14} />} variant="outline" colorScheme="green" size="sm" borderRadius="lg">Add</Button>
                   <Button leftIcon={<Trash size={14} />} variant="outline" colorScheme="red" size="sm" borderRadius="lg">Remove</Button>
                </SimpleGrid>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700">Quantity</FormLabel>
                <Input type="number" size="sm" borderRadius="lg" bg="gray.50" border="none" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap="2">
            <Button variant="ghost" size="sm" onClick={onClose} borderRadius="lg">Cancel</Button>
            <Button colorScheme="brand" size="sm" px="6" borderRadius="lg">Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default BranchManageProducts;
