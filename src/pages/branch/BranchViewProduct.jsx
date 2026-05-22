import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack,
  Icon,
  IconButton,
  Image,
  Spinner,
  Badge,
  Grid,
  GridItem,
  Divider,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Layers,
  Calendar,
  Info,
  Edit
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const BranchViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      navigate('/branch/manage-products');
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
              <Heading size="lg" color="secondary" fontWeight="800">Product Details</Heading>
              <Text fontSize="sm" color="gray.500" fontWeight="500">Viewing detailed specifications for {product.name}</Text>
            </Box>
          </HStack>
          <Button leftIcon={<Edit size={18} />} colorScheme="brand" borderRadius="xl" px="8" onClick={() => navigate(`/branch/edit-product/${product._id}`)}>Edit Product</Button>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          {/* Left Column: Image & Basic Info */}
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <Box className="premium-card" p="6" textAlign="center">
              <Box borderRadius="2xl" overflow="hidden" mb="6" bg="gray.50" h="300px" display="flex" align="center" justify="center">
                {product.image ? (
                  <Image src={`${API_URL}/${product.image}`} alt={product.name} objectFit="contain" w="full" h="full" />
                ) : (
                  <Icon as={Package} size={100} color="gray.200" />
                )}
              </Box>
              <VStack spacing="2" align="center">
                <Badge colorScheme="blue" borderRadius="full" px="3" py="1" fontSize="10px">{product.category}</Badge>
                <Heading size="md" color="secondary" fontWeight="800">{product.name}</Heading>
                <Text fontSize="sm" color="gray.400" fontWeight="600">{product.sku}</Text>
              </VStack>
              
              <Divider my="6" />
              
              <SimpleGrid columns={2} spacing="4">
                <Box p="4" bg="brand.50" borderRadius="xl">
                   <Text fontSize="10px" color="brand.500" fontWeight="800">PRICE</Text>
                   <Text fontSize="lg" fontWeight="800" color="secondary">₹{Number(product.price).toLocaleString()}</Text>
                </Box>
                <Box p="4" bg="green.50" borderRadius="xl">
                   <Text fontSize="10px" color="green.500" fontWeight="800">STOCK</Text>
                   <Text fontSize="lg" fontWeight="800" color="secondary">{product.stock} Units</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </GridItem>

          {/* Right Column: Detailed Info */}
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <VStack spacing="8" align="stretch">
              <Box className="premium-card" p="8">
                <HStack mb="6" spacing="3">
                  <Box p="2.5" bg="brand.50" borderRadius="xl" color="brand.500"><Info size={22} /></Box>
                  <Heading size="sm" color="secondary">General Specifications</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="8">
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">Full Name</Text>
                    <Text fontWeight="600" color="secondary">{product.name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">Category</Text>
                    <Text fontWeight="600" color="secondary">{product.category}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">SKU Identifier</Text>
                    <Text fontWeight="600" color="secondary">{product.sku}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">Last Updated</Text>
                    <Text fontWeight="600" color="secondary">{moment(product.updatedAt).format('DD MMM YYYY, hh:mm A')}</Text>
                  </Box>
                </SimpleGrid>

                <Divider my="8" />

                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" mb="2">Product Description</Text>
                  <Text color="gray.600" lineHeight="1.8">{product.description || 'No description provided for this product.'}</Text>
                </Box>
              </Box>

              <Box className="premium-card" p="8" bg="gray.900" color="white">
                <Flex justify="space-between" align="center">
                   <HStack spacing="4">
                      <Box p="3" bg="whiteAlpha.200" borderRadius="xl">
                         <Layers size={22} color="white" />
                      </Box>
                      <Box>
                         <Text fontSize="xs" color="whiteAlpha.600" fontWeight="700">Inventory Status</Text>
                         <Text fontSize="lg" fontWeight="800">Active Listing</Text>
                      </Box>
                   </HStack>
                   <Button variant="whiteAlpha" colorScheme="whiteAlpha" borderRadius="xl" leftIcon={<Calendar size={16} />} size="sm" onClick={() => navigate('/branch/inventory-log')}>View History</Button>
                </Flex>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchViewProduct;
