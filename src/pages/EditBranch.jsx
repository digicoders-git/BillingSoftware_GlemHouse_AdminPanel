import { useState, useEffect } from 'react';
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
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ChevronRight, Save, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

const EditBranch = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    branchId: '',
    name: '',
    location: '',
    manager: '',
    contact: '',
    email: '',
    password: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBranchDetails();
  }, [id]);

  const fetchBranchDetails = async () => {
    try {
      const { data } = await API.get(`/branches/${id}`);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch branch details',
        status: 'error',
        duration: 3000,
      });
      navigate('/manage-branches');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/branches/${id}`, formData);
      toast({
        title: 'Success',
        description: 'Branch updated successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right'
      });
      navigate('/manage-branches');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update branch',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner color="brand.500" size="xl" />
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb="6">
          <Box>
            <Heading size="md" color="secondary">Edit Branch: {formData.name}</Heading>
            <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="gray" />} mt="1">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" color="gray.500" fontSize="sm">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage-branches" color="gray.500" fontSize="sm">Branches</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" color="brand.500" fontSize="sm" fontWeight="600">Edit Branch</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Flex>

        <Box className="premium-card" p="8">
          <form onSubmit={handleSubmit}>
            <VStack spacing="8" align="stretch">
              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Branch Details</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Name</FormLabel>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter branch name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Code / ID</FormLabel>
                      <Input name="branchId" value={formData.branchId} isReadOnly bg="gray.50" h="45px" borderRadius="lg" />
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
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Manager Name</FormLabel>
                      <Input name="manager" value={formData.manager} onChange={handleChange} placeholder="Full name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Phone Number</FormLabel>
                      <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone number" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Account Credentials</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Email Address</FormLabel>
                      <Input value={formData.email} isReadOnly bg="gray.50" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Login Password</FormLabel>
                      <InputGroup size="md">
                        <Input 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Update password" 
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
                <Button variant="outline" colorScheme="gray" leftIcon={<X size={18} />} px="8" onClick={() => navigate('/manage-branches')}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  colorScheme="brand" 
                  leftIcon={<Save size={18} />} 
                  px="10"
                  isLoading={saving}
                >
                  Update Branch
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default EditBranch;
