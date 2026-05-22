import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  Textarea, 
  Grid, 
  GridItem, 
  HStack,
  Icon,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Image,
  Spinner
} from '@chakra-ui/react';
import { 
  Plus, 
  Package, 
  Image as ImageIcon, 
  ArrowLeft,
  Save,
  Info,
  RefreshCcw,
  Edit2,
  Trash2,
  Settings,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const BranchAddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { isOpen: isManageOpen, onOpen: onManageOpen, onClose: onManageClose } = useDisclosure(); 
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingCat, setEditingCat] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    minLevel: '5',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
    generateSKU();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories');
    }
  };

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const sku = `SKU-${new Date().getFullYear()}-${random}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('image', file);

    setUploading(true);
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const { data } = await API.post('/upload', fileFormData, config);
      setFormData({ ...formData, image: data }); // 'data' is the filename returned by backend
      setUploading(false);
      toast({ title: 'Image Uploaded', status: 'success', duration: 2000 });
    } catch (error) {
      toast({ title: 'Upload Failed', status: 'error' });
      setUploading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName) return;
    try {
      if (editingCat) {
        const { data } = await API.put(`/categories/${editingCat._id}`, { name: newCatName });
        setCategories(categories.map(c => c._id === data._id ? data : c));
        toast({ title: 'Category updated', status: 'success' });
      } else {
        const { data } = await API.post('/categories', { name: newCatName });
        setCategories([...categories, data]);
        setFormData({ ...formData, category: data.name });
        toast({ title: 'Category added', status: 'success' });
      }
      setNewCatName('');
      setEditingCat(null);
      onClose();
    } catch (error) {
      toast({ title: 'Error saving category', status: 'error' });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      toast({ title: 'Category deleted', status: 'success' });
    } catch (error) {
      toast({ title: 'Error deleting category', status: 'error' });
    }
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setNewCatName(cat.name);
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
       toast({ title: "Please fill required fields", status: "warning" });
       return;
    }
    setLoading(true);
    try {
      // Create product
      await API.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      toast({ title: "Product Added Successfully", status: "success" });
      navigate('/branch/manage-products');
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5555';

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <HStack spacing="4">
            <IconButton icon={<ArrowLeft size={20} />} onClick={() => navigate('/branch/manage-products')} variant="outline" borderRadius="xl" bg="white" aria-label="back" />
            <Box>
              <Heading size="lg" color="secondary" fontWeight="800">Add New Product</Heading>
              <Text fontSize="sm" color="gray.500" fontWeight="500">Create a new entry for your inventory</Text>
            </Box>
          </HStack>
          <HStack spacing="3">
             <Button variant="ghost" borderRadius="xl" onClick={() => navigate('/branch/manage-products')} px="6">Cancel</Button>
             <Button leftIcon={<Save size={18} />} colorScheme="brand" borderRadius="xl" px="10" onClick={handleSubmit} isLoading={loading}>Save Product</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <VStack spacing="8" align="stretch">
              <Box className="premium-card" p={{ base: 6, md: 10 }}>
                <HStack mb="8" spacing="3">
                  <Box p="2.5" bg="brand.50" borderRadius="xl" color="brand.500"><Info size={22} /></Box>
                  <Heading size="sm" color="secondary" fontWeight="700">General Information</Heading>
                </HStack>
                
                <VStack spacing="6">
                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="700">Product Name</FormLabel>
                    <Input placeholder="Enter product name" h="55px" borderRadius="xl" bg="white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </FormControl>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="6" w="full">
                     <FormControl isRequired>
                        <FormLabel fontSize="13px" fontWeight="700">
                          Category
                          <IconButton size="xs" icon={<Settings size={12} />} variant="link" ml="2" onClick={onManageOpen} aria-label="Manage" />
                        </FormLabel>
                        <Select h="55px" borderRadius="xl" bg="white" value={formData.category} onChange={(e) => {
                          if (e.target.value === 'ADD_NEW') {
                            setEditingCat(null);
                            setNewCatName('');
                            onOpen();
                          } else {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}>
                          <option value="ADD_NEW" style={{ fontWeight: 'bold', color: '#298AC6' }}>+ Add New Category</option>
                          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="13px" fontWeight="700">Product SKU / ID</FormLabel>
                        <InputGroup size="lg">
                          <Input h="55px" borderRadius="xl" bg="gray.50" readOnly value={formData.sku} />
                          <InputRightElement h="full"><IconButton icon={<RefreshCcw size={16} />} variant="ghost" onClick={generateSKU} aria-label="reg" /></InputRightElement>
                        </InputGroup>
                      </FormControl>
                  </Grid>

                  <FormControl><FormLabel fontSize="13px" fontWeight="700">Description</FormLabel><Textarea placeholder="Describe the product..." borderRadius="xl" bg="white" h="150px" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></FormControl>
                </VStack>
              </Box>

              <Box className="premium-card" p={{ base: 6, md: 10 }}>
                <HStack mb="8" spacing="3"><Box p="2.5" bg="green.50" borderRadius="xl" color="green.500"><Package size={22} /></Box><Heading size="sm" color="secondary">Stock & Pricing</Heading></HStack>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6" w="full">
                  <FormControl isRequired><FormLabel fontSize="13px" fontWeight="700">Unit Price ($)</FormLabel><Input type="number" h="55px" borderRadius="xl" bg="white" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></FormControl>
                  <FormControl isRequired><FormLabel fontSize="13px" fontWeight="700">Initial Stock</FormLabel><Input type="number" h="55px" borderRadius="xl" bg="white" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></FormControl>
                  <FormControl isRequired><FormLabel fontSize="13px" fontWeight="700">Low Stock Alert</FormLabel><Input type="number" h="55px" borderRadius="xl" bg="white" value={formData.minLevel} onChange={(e) => setFormData({ ...formData, minLevel: e.target.value })} /></FormControl>
                </Grid>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <Box className="premium-card" p="8" position="sticky" top="100px">
              <VStack spacing="8">
                <Box w="full">
                  <HStack mb="6" spacing="3"><Box p="2.5" bg="blue.50" borderRadius="xl" color="blue.500"><ImageIcon size={22} /></Box><Heading size="sm" color="secondary">Product Media</Heading></HStack>
                  
                  <Input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                  />

                  <Box 
                    w="full" 
                    h="280px" 
                    borderRadius="2xl" 
                    border="2px dashed" 
                    borderColor={formData.image ? 'brand.200' : 'gray.200'} 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    bg={formData.image ? 'white' : 'gray.50'} 
                    cursor="pointer" 
                    position="relative"
                    overflow="hidden"
                    _hover={{ bg: 'white', borderColor: 'brand.500', shadow: 'sm' }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {uploading ? (
                      <VStack spacing="3">
                        <Spinner color="brand.500" />
                        <Text fontSize="xs" fontWeight="600">Uploading...</Text>
                      </VStack>
                    ) : formData.image ? (
                      <>
                        <Image 
                          src={formData.image.startsWith('http') ? formData.image : `${API_URL}/${formData.image.startsWith('uploads/') ? formData.image : `uploads/${formData.image}`}`} 
                          alt="Preview" 
                          w="100%" 
                          h="100%" 
                          objectFit="cover" 
                        />
                        <Box position="absolute" top="2" right="2">
                           <IconButton 
                            icon={<X size={14} />} 
                            size="xs" 
                            colorScheme="red" 
                            borderRadius="full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, image: '' });
                            }}
                            aria-label="Remove image"
                           />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Icon as={Plus} size={30} color="gray.400" mb="2" />
                        <Text fontSize="xs" fontWeight="700">Add Product Image</Text>
                        <Text fontSize="10px" color="gray.400" mt="1">PNG, JPG up to 5MB</Text>
                      </>
                    )}
                  </Box>
                </Box>
                <Box w="full" p="5" bg="brand.50" borderRadius="xl"><Text fontSize="12px" color="gray.600">Uploading a product photo is highly recommended to make inventory identification easier.</Text></Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      {/* Add/Edit Category Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(8px)" /><ModalContent borderRadius="2xl">
          <ModalHeader>{editingCat ? 'Edit Category' : 'Add New Category'}</ModalHeader><ModalCloseButton />
          <ModalBody><FormControl><FormLabel fontSize="sm" fontWeight="600">Category Name</FormLabel><Input placeholder="e.g. Smartwatches" h="50px" borderRadius="xl" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} /></FormControl></ModalBody>
          <ModalFooter gap="3"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button colorScheme="brand" borderRadius="xl" px="6" onClick={handleSaveCategory}>{editingCat ? 'Update' : 'Add'}</Button></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Manage Categories Modal */}
      <Modal isOpen={isManageOpen} onClose={onManageClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(8px)" /><ModalContent borderRadius="2xl">
          <ModalHeader>Manage Categories</ModalHeader><ModalCloseButton />
          <ModalBody pb="6">
            <List spacing={3}>
              {categories.map(cat => (
                <ListItem key={cat._id} p="3" bg="gray.50" borderRadius="lg">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="600">{cat.name}</Text>
                    <HStack>
                      <IconButton size="xs" icon={<Edit2 size={12} />} variant="ghost" onClick={() => openEdit(cat)} aria-label="edit" />
                      <IconButton size="xs" icon={<Trash2 size={12} />} variant="ghost" colorScheme="red" onClick={() => handleDeleteCategory(cat._id)} aria-label="del" />
                    </HStack>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default BranchAddProduct;
