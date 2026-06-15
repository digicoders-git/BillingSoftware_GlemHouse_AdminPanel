import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  HStack, 
  VStack,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Spinner,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Image} from '@chakra-ui/react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  ShoppingBag,
  AlertTriangle,
  Image as ImageIcon,
  Upload,
  Download
} from 'lucide-react';
import Layout from '../components/Layout';
import API from '../utils/api';
import Papa from 'papaparse';

const AdminProducts = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const BASE_URL = 'http://localhost:5555';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const fileInputRef = React.useRef();
  const csvInputRef = React.useRef();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    minLevel: 5,
    image: '',
    hsn: '',
    batch: '',
    packSize: '',
    cartenSize: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to load products", status: "error" });
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await API.post('/upload', formDataObj, config);
      setFormData(prev => ({ ...prev, image: `/uploads/${data}` }));
      setUploading(false);
      toast({ title: "Image uploaded", status: "success" });
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast({ title: "Upload failed", status: "error" });
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category || '',
        description: product.description || '',
        minLevel: product.minLevel || 5,
        image: product.image || '',
        hsn: product.hsn || '',
        batch: product.batch || '',
        packSize: product.packSize || '',
        cartenSize: product.cartenSize || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        minLevel: 5,
        image: '',
        hsn: '',
        batch: '',
        packSize: '',
        cartenSize: ''
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData);
        toast({ title: "Product updated successfully", status: "success" });
      } else {
        await API.post('/products', formData);
        toast({ title: "New product created", status: "success" });
      }
      onClose();
      fetchProducts();
    } catch (error) {
      toast({ 
        title: editingProduct ? "Update failed" : "Creation failed", 
        description: error.response?.data?.message || "Check your input", 
        status: "error" 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? It will be removed from all inventories.')) {
      try {
        await API.delete(`/products/${id}`);
        toast({ title: "Product deleted", status: "success" });
        fetchProducts();
      } catch (error) {
        toast({ title: "Delete failed", status: "error" });
      }
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadSampleCSV = () => {
    const headers = ['Name', 'SKU', 'Price', 'Stock', 'MinLevel', 'Category', 'HSN', 'Batch', 'PackSize', 'CartenSize'];
    const sample = ['Example Product', 'SKU-001', '100', '50', '5', 'General', '', '', '1 Pcs', '10 Pcs'];
    const csvContent = headers.join(',') + '\n' + sample.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCSV(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const bulkProducts = results.data.map(row => ({
            name: row.Name || row.name,
            sku: row.SKU || row.sku,
            price: Number(row.Price || row.price) || 0,
            stock: Number(row.Stock || row.stock) || 0,
            minLevel: Number(row.MinLevel || row.minLevel) || 5,
            category: row.Category || row.category || '',
            hsn: row.HSN || row.hsn || '',
            batch: row.Batch || row.batch || '',
            packSize: row.PackSize || row.packSize || '',
            cartenSize: row.CartenSize || row.cartenSize || ''
          })).filter(p => p.name);

          if (bulkProducts.length === 0) {
            toast({ title: 'No valid products found in CSV', status: 'warning' });
            return setUploadingCSV(false);
          }

          const res = await API.post('/products/bulk', { products: bulkProducts });
          toast({ title: res.data.message || 'Products imported successfully', status: 'success' });
          if (res.data.errors && res.data.errors.length > 0) {
             toast({ title: 'Some SKUs were skipped', description: `${res.data.errors.length} duplicates found.`, status: 'info' });
          }
          fetchProducts();
        } catch (error) {
          toast({ title: 'Import failed', description: error.response?.data?.message || 'Check your CSV format', status: 'error' });
        } finally {
          setUploadingCSV(false);
          if (csvInputRef.current) csvInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <Layout>
      <Box pb="10">
        {/* Header */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Master Product Catalog</Heading>
            <Text color="gray.500" fontWeight="500">Create and manage products available across your network</Text>
          </Box>
          <HStack spacing="3">
            <Button 
              size="sm" 
              variant="outline" 
              colorScheme="brand" 
              borderRadius="lg" 
              leftIcon={<Download size={16} />}
              onClick={downloadSampleCSV}
            >
              Sample CSV
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              colorScheme="brand" 
              borderRadius="lg" 
              leftIcon={<Upload size={16} />}
              onClick={() => csvInputRef.current.click()}
              isLoading={uploadingCSV}
            >
              Import CSV
            </Button>
            <input type="file" accept=".csv" ref={csvInputRef} onChange={handleCSVUpload} style={{ display: 'none' }} />
            <Button 
              leftIcon={<Plus size={18} />} 
              colorScheme="brand" 
              borderRadius="xl" 
              px="6" 
              shadow="lg"
              onClick={() => handleOpenModal()}
            >
              Create Product
            </Button>
          </HStack>
        </Flex>

        {/* Search & Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing="6" mb="8">
           <Box className="premium-card" p="4" colSpan={{ base: 1, md: 2 }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<Search size={18} color="gray" />} />
                <Input 
                  placeholder="Search by name or SKU..." 
                  variant="filled" 
                  borderRadius="xl" 
                  h="45px" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
           </Box>
           <Box className="premium-card" p="4">
              <HStack spacing="3">
                 <Box p="2" bg="brand.50" borderRadius="lg" color="brand.500"><ShoppingBag size={20} /></Box>
                 <Box>
                    <Text fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Total Products</Text>
                    <Text fontSize="lg" fontWeight="900" color="secondary">{products.length}</Text>
                 </Box>
              </HStack>
           </Box>
           <Box className="premium-card" p="4">
              <HStack spacing="3">
                 <Box p="2" bg="orange.50" borderRadius="lg" color="orange.500"><AlertTriangle size={20} /></Box>
                 <Box>
                    <Text fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Low Stock items</Text>
                    <Text fontSize="lg" fontWeight="900" color="secondary">{products.filter(p => p.stock <= p.minLevel).length}</Text>
                 </Box>
              </HStack>
           </Box>
        </SimpleGrid>

        {/* Table */}
        <Box className="premium-card" overflow="hidden">
           <Table variant="simple">
             <Thead bg="gray.50/50">
               <Tr>
                 <Th py="4" px="6" border="none" fontSize="10px">Product</Th>
                 <Th py="4" border="none" fontSize="10px">HSN / Batch</Th>
                 <Th py="4" border="none" fontSize="10px">Pack Size</Th>
                 <Th py="4" border="none" fontSize="10px">Carten Size</Th>
                 <Th py="4" border="none" fontSize="10px">Category</Th>
                 <Th py="4" border="none" fontSize="10px">Price</Th>
                 <Th py="4" border="none" fontSize="10px">Main Stock</Th>
                 <Th py="4" border="none" fontSize="10px">Status</Th>
                 <Th py="4" px="6" border="none"></Th>
               </Tr>
             </Thead>
             <Tbody>
               {loading ? (
                 <Tr><Td colSpan="6" textAlign="center" py="10"><Spinner color="brand.500" /></Td></Tr>
                ) : currentProducts.map((p) => (
                  <Tr key={p._id} _hover={{ bg: 'gray.50/30' }}>
                   <Td py="4" px="6">
                     <HStack spacing="3">
                        <Avatar size="sm" src={p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`} name={p.name} borderRadius="lg" bg="gray.100" color="gray.500" icon={<Package size={16} />} />
                        <Box>
                           <Text fontWeight="800" color="secondary" fontSize="sm">{p.name}</Text>
                           <Text fontSize="10px" color="gray.400" fontWeight="700">{p.sku}</Text>
                        </Box>
                     </HStack>
                   </Td>
                   <Td>
                      <VStack align="start" spacing="0">
                        <Text fontWeight="800" color="secondary" fontSize="sm">{p.hsn || 'N/A'}</Text>
                        <Text fontSize="10px" color="gray.400" fontWeight="700">Batch: {p.batch || 'N/A'}</Text>
                      </VStack>
                   </Td>
                   <Td><Text fontWeight="800" color="secondary" fontSize="sm">{p.packSize || 'N/A'}</Text></Td>
                   <Td><Text fontWeight="800" color="secondary" fontSize="sm">{p.cartenSize || 'N/A'}</Text></Td>
                   <Td><Badge colorScheme="gray" variant="subtle" px="2" py="0.5" borderRadius="md" fontSize="10px">{p.category || 'Uncategorized'}</Badge></Td>
                   <Td><Text fontWeight="900" color="secondary" fontSize="sm">₹{p.price.toLocaleString()}</Text></Td>
                   <Td>
                      <VStack align="start" spacing="0">
                        <Text fontWeight="800" color={p.stock <= p.minLevel ? 'orange.500' : 'secondary'} fontSize="sm">{p.stock} Units</Text>
                        <Text fontSize="10px" color="gray.400">Min: {p.minLevel}</Text>
                      </VStack>
                   </Td>
                   <Td>
                      <Badge colorScheme={p.stock > p.minLevel ? 'green' : (p.stock > 0 ? 'orange' : 'red')} fontSize="9px" borderRadius="full" px="2.5">
                         {p.stock > p.minLevel ? 'IN STOCK' : (p.stock > 0 ? 'LOW STOCK' : 'OUT OF STOCK')}
                      </Badge>
                   </Td>
                   <Td px="6" textAlign="right">
                      <Menu>
                        <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" borderRadius="full" />
                        <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                           <MenuItem icon={<Edit3 size={14} />} fontSize="xs" fontWeight="700" onClick={() => handleOpenModal(p)}>Edit Details</MenuItem>
                           <MenuItem icon={<Trash2 size={14} />} fontSize="xs" fontWeight="700" color="red.500" onClick={() => handleDelete(p._id)}>Delete Product</MenuItem>
                        </MenuList>
                      </Menu>
                   </Td>
                 </Tr>
               ))}
             </Tbody>
           </Table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Flex justify="space-between" align="center" p="4" borderTop="1px solid" borderColor="gray.100" bg="white">
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                </Text>
                <HStack spacing="2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <HStack spacing="1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button 
                        key={i + 1} 
                        size="sm" 
                        variant={currentPage === i + 1 ? "solid" : "ghost"}
                        colorScheme={currentPage === i + 1 ? "brand" : "gray"}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </HStack>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    isDisabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
         </Box>
      </Box>

      {/* Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <form onSubmit={handleSubmit}>
          <ModalContent borderRadius="2xl" shadow="2xl">
            <ModalHeader borderBottom="1px solid" borderColor="gray.100" py="6">
               <HStack spacing="3">
                  <Box p="2" bg="brand.50" borderRadius="xl" color="brand.500">
                    <Package size={20} />
                  </Box>
                  <VStack align="start" spacing="0">
                    <Text fontSize="sm" fontWeight="800" color="brand.500">PRODUCT MANAGEMENT</Text>
                    <Heading size="md" color="secondary">{editingProduct ? 'Edit Product' : 'Create New Product'}</Heading>
                  </VStack>
               </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py="8">
              <VStack spacing="5" align="stretch">
                 <SimpleGrid columns={2} spacing="5">
                    <FormControl isRequired>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Product Name</FormLabel>
                       <Input 
                        placeholder="e.g. iPhone 15 Pro" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </FormControl>
                    <FormControl>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">SKU / Model ID</FormLabel>
                       <Input 
                        placeholder="e.g. APL-IP15P" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        isDisabled={!!editingProduct}
                       />
                    </FormControl>
                 </SimpleGrid>

                 <SimpleGrid columns={3} spacing="5">
                    <FormControl isRequired>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Price (₹)</FormLabel>
                       <Input 
                        type="number" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                       />
                    </FormControl>
                    <FormControl>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Initial Stock</FormLabel>
                       <Input 
                        type="number" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                       />
                    </FormControl>
                    <FormControl>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Min. Stock Level</FormLabel>
                       <Input 
                        type="number" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.minLevel}
                        onChange={(e) => setFormData({...formData, minLevel: e.target.value})}
                       />
                    </FormControl>
                 </SimpleGrid>

                 <SimpleGrid columns={3} spacing={5}>
                   <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Category</FormLabel>
                      <Input 
                        placeholder="e.g. Electronics, Furniture" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                   </FormControl>
                   <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">HSN Code</FormLabel>
                      <Input 
                        placeholder="e.g. 8516" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.hsn}
                        onChange={(e) => setFormData({...formData, hsn: e.target.value})}
                      />
                   </FormControl>
                   <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Batch No.</FormLabel>
                      <Input 
                        placeholder="e.g. BATCH-001" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.batch}
                        onChange={(e) => setFormData({...formData, batch: e.target.value})}
                      />
                   </FormControl>
                 </SimpleGrid>

                 <SimpleGrid columns={2} spacing={5}>
                    <FormControl>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Pack Size</FormLabel>
                       <Input 
                        placeholder="e.g. 10 Pcs" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.packSize}
                        onChange={(e) => setFormData({...formData, packSize: e.target.value})}
                       />
                    </FormControl>
                    <FormControl>
                       <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Carten Size</FormLabel>
                       <Input 
                        placeholder="e.g. 100 Pcs" 
                        h="45px" 
                        borderRadius="xl" 
                        fontWeight="700" 
                        value={formData.cartenSize}
                        onChange={(e) => setFormData({...formData, cartenSize: e.target.value})}
                       />
                    </FormControl>
                 </SimpleGrid>

                 <FormControl>
                    <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Product Image</FormLabel>
                    <HStack spacing="4">
                       <Box 
                        w="80px" 
                        h="80px" 
                        borderRadius="xl" 
                        bg="gray.50" 
                        border="2px dashed" 
                        borderColor="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                       >
                          {formData.image ? (
                             <Image src={formData.image.startsWith('http') ? formData.image : `${BASE_URL}${formData.image}`} alt="Preview" objectFit="cover" w="full" h="full" />
                          ) : (
                             <ImageIcon size={24} color="gray" />
                          )}
                       </Box>
                       <VStack align="start" spacing="2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            borderRadius="lg" 
                            leftIcon={<Plus size={14} />}
                            onClick={() => fileInputRef.current.click()}
                            isLoading={uploading}
                          >
                            Choose File
                          </Button>
                          <Text fontSize="10px" color="gray.400">Supported: JPG, PNG, WEBP (Max 10MB)</Text>
                          <Input 
                            type="file" 
                            ref={fileInputRef} 
                            display="none" 
                            onChange={uploadFileHandler}
                          />
                       </VStack>
                    </HStack>
                 </FormControl>

                 <FormControl>
                    <FormLabel fontSize="10px" fontWeight="800" color="gray.500" textTransform="uppercase">Description</FormLabel>
                    <Textarea 
                      placeholder="Product details, specs, etc..." 
                      borderRadius="xl" 
                      fontWeight="500" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                 </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter bg="gray.50/50" borderTop="1px solid" borderColor="gray.100" py="6" borderBottomRadius="2xl">
              <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl">Cancel</Button>
              <Button type="submit" colorScheme="brand" borderRadius="xl" px="8" shadow="lg">
                {editingProduct ? 'Update Product' : 'Save Product'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Layout>
  );
};

export default AdminProducts;
