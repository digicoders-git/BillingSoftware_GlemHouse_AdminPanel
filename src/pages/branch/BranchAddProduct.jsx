import React from 'react';
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
  IconButton
} from '@chakra-ui/react';
import { 
  Plus, 
  Package, 
  Image as ImageIcon, 
  ArrowLeft,
  Save,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const BranchAddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Product Added",
      description: "Bhai, the new product has been successfully added to your branch inventory.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
    setTimeout(() => navigate('/branch/manage-products'), 1000);
  };

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <HStack spacing="4">
            <IconButton 
              icon={<ArrowLeft size={20} />} 
              onClick={() => navigate('/branch/manage-products')} 
              variant="ghost" 
              borderRadius="full" 
              aria-label="Go back"
            />
            <Box>
              <Heading size="md" color="secondary">Add New Product</Heading>
              <Text fontSize="sm" color="gray.500">Create a new product entry for your branch</Text>
            </Box>
          </HStack>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
             <Button variant="ghost" borderRadius="xl" flex={1} onClick={() => navigate('/branch/manage-products')}>Cancel</Button>
             <Button leftIcon={<Save size={18} />} colorScheme="brand" borderRadius="xl" px="8" flex={1} onClick={handleSubmit}>Save Product</Button>
          </HStack>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
            {/* General Information */}
            <GridItem colSpan={{ base: 3, lg: 2 }}>
              <VStack spacing="6" align="stretch">
                <Box className="premium-card" p="6">
                  <HStack mb="6" spacing="2">
                    <Box p="2" bg="brand.50" borderRadius="lg" color="brand.500">
                      <Info size={20} />
                    </Box>
                    <Heading size="sm" color="secondary">Product Information</Heading>
                  </HStack>
                  
                  <VStack spacing="5">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700">Product Name</FormLabel>
                      <Input placeholder="e.g. iPhone 15 Pro" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
                    </FormControl>

                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="4" w="full">
                       <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="700">Category</FormLabel>
                        <Select placeholder="Select category" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }}>
                          <option>Mobiles</option>
                          <option>Laptops</option>
                          <option>Accessories</option>
                          <option>Tablets</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="700">Product SKU / ID</FormLabel>
                        <Input placeholder="e.g. SKU-12345" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
                      </FormControl>
                    </Grid>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="700">Description</FormLabel>
                      <Textarea placeholder="Enter product details..." borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} h="120px" pt="4" />
                    </FormControl>
                  </VStack>
                </Box>

                <Box className="premium-card" p="6">
                   <HStack mb="6" spacing="2">
                    <Box p="2" bg="green.50" borderRadius="lg" color="green.500">
                      <Package size={20} />
                    </Box>
                    <Heading size="sm" color="secondary">Inventory & Pricing</Heading>
                  </HStack>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4" w="full">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700">Unit Price ($)</FormLabel>
                      <Input type="number" placeholder="0.00" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700">Opening Stock</FormLabel>
                      <Input type="number" placeholder="0" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700">Min. Alert Level</FormLabel>
                      <Input type="number" placeholder="5" h="50px" borderRadius="xl" bg="gray.50" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
                    </FormControl>
                  </Grid>
                </Box>
              </VStack>
            </GridItem>

            {/* Product Image */}
            <GridItem colSpan={{ base: 3, lg: 1 }}>
              <Box className="premium-card" p="6" h="full">
                <HStack mb="6" spacing="2">
                  <Box p="2" bg="blue.50" borderRadius="lg" color="blue.500">
                    <ImageIcon size={20} />
                  </Box>
                  <Heading size="sm" color="secondary">Product Media</Heading>
                </HStack>

                <VStack spacing="6">
                   <Box 
                    w="full" 
                    h="200px" 
                    borderRadius="2xl" 
                    border="2px dashed" 
                    borderColor="gray.200" 
                    display="flex" 
                    flexDirection="column"
                    alignItems="center" 
                    justifyContent="center"
                    bg="gray.50"
                    cursor="pointer"
                    _hover={{ bg: 'gray.100', borderColor: 'brand.400' }}
                    transition="all 0.2s"
                   >
                     <Icon as={Plus} size={30} color="gray.400" mb="2" />
                     <Text fontSize="xs" color="gray.500" fontWeight="600">Upload Image</Text>
                     <Text fontSize="10px" color="gray.400" mt="1">PNG, JPG up to 5MB</Text>
                   </Box>

                   <Box w="full">
                      <Heading size="xs" mb="4" color="secondary" textTransform="uppercase">Guidelines</Heading>
                      <VStack align="stretch" spacing="3">
                         <Flex align="center" gap="2">
                            <Box w="6px" h="6px" bg="brand.400" borderRadius="full" />
                            <Text fontSize="xs" color="gray.500">Recommended size: 800x800px</Text>
                         </Flex>
                         <Flex align="center" gap="2">
                            <Box w="6px" h="6px" bg="brand.400" borderRadius="full" />
                            <Text fontSize="xs" color="gray.500">White background looks best</Text>
                         </Flex>
                         <Flex align="center" gap="2">
                            <Box w="6px" h="6px" bg="brand.400" borderRadius="full" />
                            <Text fontSize="xs" color="gray.500">Max file size allowed is 5MB</Text>
                         </Flex>
                      </VStack>
                   </Box>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
};

export default BranchAddProduct;
