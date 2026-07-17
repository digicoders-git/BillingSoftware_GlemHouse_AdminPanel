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
  IconButton,
  Select
} from '@chakra-ui/react';
import { ChevronRight, Save, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';
import locationData from '../utils/locationData.json';

const CreateSales = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    agreementUrl: '',
    employeeName: '',
    employeeContact: ''
  });
  const [addressDetails, setAddressDetails] = useState({
    state: 'Uttar Pradesh',
    district: '',
    tehsil: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileFormData = new FormData();
    fileFormData.append('image', file); // API expects 'image' field for any file upload

    setUploading(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await API.post('/upload', fileFormData, config);
      setFormData({ ...formData, agreementUrl: data });
      setUploading(false);
      toast({ title: 'Agreement Uploaded', status: 'success', duration: 2000 });
    } catch (error) {
      toast({ title: 'Upload Failed', description: error.response?.data || 'An error occurred', status: 'error' });
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const locationString = [
        addressDetails.tehsil,
        addressDetails.district,
        addressDetails.state
      ].filter(Boolean).join(', ');

      const submitData = { ...formData, location: locationString };
      await API.post('/sales', submitData);
      toast({
        title: 'Success',
        description: 'Superstockist representative created successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right'
      });
      navigate('/manage-sales');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create Superstockist record',
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
            <Heading size="md" color="secondary">Create New Superstockist</Heading>
            <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="gray" />} mt="1">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" color="gray.500" fontSize="sm">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage-sales" color="gray.500" fontSize="sm">Superstockist</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" color="brand.500" fontSize="sm" fontWeight="600">Add Superstockist</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Flex>

        <Box className="premium-card" p="8">
          <form onSubmit={handleSubmit}>
            <VStack spacing="8" align="stretch">
              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Personal Details</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Full Name</FormLabel>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Superstockist ID</FormLabel>
                      <Input value="Auto-generated" isReadOnly h="45px" borderRadius="lg" bg="gray.100" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Contact Number</FormLabel>
                      <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone number" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Grid templateColumns="repeat(3, 1fr)" gap="6" mb="4">
                      <GridItem colSpan={{ base: 3, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="gray.700">State</FormLabel>
                          <Select 
                            value={addressDetails.state}
                            onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value, district: '', tehsil: '' })}
                            h="45px" borderRadius="lg"
                          >
                            <option value="">Select State</option>
                            {Object.keys(locationData).map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 3, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="gray.700">District</FormLabel>
                          <Select 
                            value={addressDetails.district}
                            onChange={(e) => setAddressDetails({ ...addressDetails, district: e.target.value, tehsil: '' })}
                            h="45px" borderRadius="lg"
                            isDisabled={!addressDetails.state}
                          >
                            <option value="">Select District</option>
                            {addressDetails.state && Object.keys(locationData[addressDetails.state] || {}).map(district => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 3, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Tehsil</FormLabel>
                          <Select 
                            value={addressDetails.tehsil}
                            onChange={(e) => setAddressDetails({ ...addressDetails, tehsil: e.target.value })}
                            h="45px" borderRadius="lg"
                            isDisabled={!addressDetails.district}
                          >
                            <option value="">Select Tehsil</option>
                            {addressDetails.district && (locationData[addressDetails.state]?.[addressDetails.district] || []).map(tehsil => (
                              <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Local Address / Street</FormLabel>
                      <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter street/building address" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Upload Agreement (PDF, Image)</FormLabel>
                      <Input type="file" onChange={uploadFileHandler} p="2" h="45px" borderRadius="lg" bg="white" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" />
                      {uploading && <Text fontSize="xs" color="blue.500" mt="1">Uploading...</Text>}
                      {formData.agreementUrl && <Text fontSize="xs" color="green.500" mt="1">Uploaded: {formData.agreementUrl}</Text>}
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box mb="10">
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Assigned Employee Details</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Employee Name</FormLabel>
                      <Input name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Enter employee name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Employee ID</FormLabel>
                      <Input value="Auto-generated" isReadOnly h="45px" borderRadius="lg" bg="gray.100" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Employee Contact Number</FormLabel>
                      <Input name="employeeContact" value={formData.employeeContact} onChange={handleChange} placeholder="Phone number" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="brand.500" display="inline-block" pb="1">Account Credentials</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Email (Username)</FormLabel>
                      <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Superstockist@example.com" h="45px" borderRadius="lg" />
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
                          placeholder="Create password" 
                          h="45px" 
                          borderRadius="lg" 
                        />
                        <InputRightElement h="full">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Flex justify="end" gap="3" pt="6" borderTop="1px solid" borderColor="gray.100">
                <Button variant="outline" leftIcon={<X size={18} />} onClick={() => navigate('/manage-sales')}>Cancel</Button>
                <Button 
                  type="submit"
                  colorScheme="brand" 
                  leftIcon={<Save size={18} />} 
                  isLoading={loading}
                  px="10"
                >
                  Save Superstockist
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default CreateSales;


