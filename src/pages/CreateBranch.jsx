import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Grid, 
  GridItem, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ChevronRight, Save, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

const CreateBranch = () => {
  const [formData, setFormData] = useState({
    branchId: '',
    name: '',
    location: '',
    manager: '',
    contact: '',
    gstin: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/Branches', formData);
      toast({
        title: 'Success',
        description: 'Branch created successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right'
      });
      navigate('/manage-Branches');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create branch',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb="6">
          <Box>
            <Heading size="md" color="secondary">Create New Depot</Heading>
            <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="gray" />} mt="1">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" color="gray.500" fontSize="sm">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage-branches" color="gray.500" fontSize="sm">Depot</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" color="brand.500" fontSize="sm" fontWeight="600">Create Depot</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Flex>

        <Box className="premium-card" p="8">
          <form onSubmit={handleSubmit}>
            <VStack spacing="8" align="stretch">
              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Depot Details</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Name</FormLabel>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter depot name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Depot Code / ID</FormLabel>
                      <Input name="branchId" value={formData.branchId} onChange={handleChange} placeholder="e.g. BR-001" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Full Address / Location</FormLabel>
                      <Input name="location" value={formData.location} onChange={handleChange} placeholder="Enter complete address" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Manager Information</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Depot Manager Name</FormLabel>
                      <Input name="manager" value={formData.manager} onChange={handleChange} placeholder="Full name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Phone Number</FormLabel>
                      <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone number" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">GSTIN (Optional)</FormLabel>
                      <Input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="e.g. 09XXXXX" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Login Credentials</Heading>
                <Text fontSize="xs" color="gray.500" mb="4">These credentials will be used by the depot manager to login.</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Email Address</FormLabel>
                      <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="branch@example.com" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Password</FormLabel>
                      <InputGroup size="md">
                        <Input 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter password" 
                          h="45px" 
                          borderRadius="lg" 
                        />
                        <InputRightElement h="full">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Flex justify="end" gap="3" pt="6" borderTop="1px solid" borderColor="gray.100">
                <Button variant="outline" colorScheme="gray" leftIcon={<X size={18} />} px="8" onClick={() => navigate('/manage-Branches')}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  colorScheme="brand" 
                  leftIcon={<Save size={18} />} 
                  px="10"
                  isLoading={loading}
                >
                  Save Depot
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default CreateBranch;
