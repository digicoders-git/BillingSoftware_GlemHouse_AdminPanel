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
  Edit2,
  Trash2,
  Settings,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const BranchEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { isOpen: isManageOpen, onOpen: onManageOpen, onClose: onManageClose } = useDisclosure(); 
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get(`/products/${id}`),
        API.get('/categories')
      ]);
      setFormData(prodRes.data);
      setCategories(catRes.data);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error loading product", status: "error" });
      navigate('/branch/manage-products');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileFormData = new FormData();
    fileFormData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/upload', fileFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData({ ...formData, image: data });
      setUploading(false);
      toast({ title: 'Image Uploaded', status: 'success' });
    } catch (error) {
      toast({ title: 'Upload Failed', status: 'error' });
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/products/${id}`, formData);
      toast({ title: "Product Updated Successfully", status: "success" });
      navigate('/branch/manage-products');
    } catch (error) {
      toast({ title: "Update Failed", description: error.response?.data?.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5555';

  if (loading) return <Layout><Flex justify="center" align="center" h="70vh"><Spinner size="xl" color="brand.500" /></Flex></Layout>;

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <HStack spacing="4">
            <IconButton icon={<ArrowLeft size={20} />} onClick={() => navigate('/branch/manage-products')} variant="outline" borderRadius="xl" bg="white" aria-label="back" />
            <Box>
              <Heading size="lg" color="secondary" fontWeight="800">Edit Product</Heading>
              <Text fontSize="sm" color="gray.500" fontWeight="500">Update product details and inventory</Text>
            </Box>
          </HStack>
          <HStack spacing="3">
             <Button variant="ghost" borderRadius="xl" onClick={() => navigate('/branch/manage-products')}>Cancel</Button>
             <Button leftIcon={<Save size={18} />} colorScheme="brand" borderRadius="xl" px="10" onClick={handleSubmit} isLoading={submitting}>Update Product</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <VStack spacing="8" align="stretch">
              <Box className="premium-card" p={{ base: 6, md: 10 }}>
                <HStack mb="8" spacing="3"><Box p="2.5" bg="brand.50" borderRadius="xl" color="brand.500"><Info size={22} /></Box><Heading size="sm" color="secondary">General Information</Heading></HStack>
                <VStack spacing="6">
                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="700">Product Name</FormLabel>
                    <Input h="55px" borderRadius="xl" bg="white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </FormControl>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="6" w="full">
                     <FormControl isRequired>
                        <FormLabel fontSize="13px" fontWeight="700">Category</FormLabel>
                        <Select h="55px" borderRadius="xl" bg="white" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="13px" fontWeight="700">Product SKU / ID</FormLabel>
                        <Input h="55px" borderRadius="xl" bg="gray.50" readOnly value={formData.sku} />
                      </FormControl>
                  </Grid>
                  <FormControl><FormLabel fontSize="13px" fontWeight="700">Description</FormLabel><Textarea h="150px" borderRadius="xl" bg="white" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></FormControl>
                </VStack>
              </Box>

              <Box className="premium-card" p={{ base: 6, md: 10 }}>
                <HStack mb="8" spacing="3"><Box p="2.5" bg="green.50" borderRadius="xl" color="green.500"><Package size={22} /></Box><Heading size="sm" color="secondary">Pricing & Inventory</Heading></HStack>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6" w="full">
                  <FormControl isRequired><FormLabel fontSize="13px" fontWeight="700">Unit Price ($)</FormLabel><Input type="number" h="55px" borderRadius="xl" bg="white" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></FormControl>
                  <FormControl isRequired><FormLabel fontSize="13px" fontWeight="700">Stock Qty</FormLabel><Input type="number" h="55px" borderRadius="xl" bg="white" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></FormControl>
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
                  <Input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                  <Box w="full" h="280px" borderRadius="2xl" border="2px dashed" borderColor="gray.200" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" cursor="pointer" position="relative" overflow="hidden" _hover={{ bg: 'white', borderColor: 'brand.500' }} onClick={() => fileInputRef.current.click()}>
                    {uploading ? <Spinner color="brand.500" /> : formData.image ? (
                      <>
                        <Image src={`${API_URL}/${formData.image}`} alt="Preview" w="100%" h="100%" objectFit="cover" />
                        <Box position="absolute" top="2" right="2"><IconButton icon={<X size={14} />} size="xs" colorScheme="red" borderRadius="full" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: '' }); }} aria-label="rem" /></Box>
                      </>
                    ) : <><Icon as={Plus} size={30} color="gray.400" mb="2" /><Text fontSize="xs" fontWeight="700">Change Image</Text></>}
                  </Box>
                </Box>
                <Box w="full" p="5" bg="brand.50" borderRadius="xl"><Text fontSize="12px" color="gray.600">Inventory levels will be updated immediately once changes are successfully saved.</Text></Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchEditProduct;
