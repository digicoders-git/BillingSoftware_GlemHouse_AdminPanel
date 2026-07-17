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
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Select
} from '@chakra-ui/react';
import { ChevronRight, Save, Eye, EyeOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';
import locationData from '../utils/locationData.json';

const CreateDistributor = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
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
    tehsil: '',
    localAddress: ''
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
    fileFormData.append('image', file);

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
      const fullLocation = [
        addressDetails.localAddress,
        addressDetails.tehsil,
        addressDetails.district,
        addressDetails.state
      ].filter(Boolean).join(', ');

      const submitData = { ...formData, location: fullLocation };
      await API.post('/distributors', submitData);
      toast({
        title: 'Success',
        description: 'Distributor created successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right'
      });
      navigate('/manage-distributors');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create distributor',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex justify="space-between" align="center" mb="10">
          <Box>
             <HStack spacing="3" mb="2" cursor="pointer" onClick={() => navigate(-1)} _hover={{ color: 'brand.500' }}>
               <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
               <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Back to Distributors</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">Onboard Distributor</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="500">Register a new distributor in the supply chain</Text>
          </Box>
        </Flex>

        <Box className="premium-card" p="0" overflow="hidden" border="1px solid" borderColor="gray.100">
          <form onSubmit={handleSubmit}>
            <VStack spacing="0" align="stretch">
              <Box p="8" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
                <HStack spacing="4" mb="8">
                    <Box p="3" bg="brand.50" color="brand.500" borderRadius="2xl" shadow="sm"><User size={20} /></Box>
                    <Box>
                        <Heading size="sm" color="secondary" fontWeight="800">Distributor Information</Heading>
                        <Text fontSize="xs" color="gray.400">Basic business and identification details</Text>
                    </Box>
                </HStack>
                
                <Grid templateColumns="repeat(2, 1fr)" gap="8">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Business Name</FormLabel>
                      <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="e.g. Agarwal Distributors" 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="700"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.100"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Distributor Unique ID</FormLabel>
                      <Input 
                        value="Auto-generated" 
                        isReadOnly 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="900"
                        bg="gray.100"
                        border="1px solid"
                        borderColor="gray.100"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Contact Number</FormLabel>
                      <Input 
                        name="contact" 
                        value={formData.contact} 
                        onChange={handleChange} 
                        placeholder="+91 XXXXX XXXXX" 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="700"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.100"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Grid templateColumns="repeat(2, 1fr)" gap="6" mb="4">
                      <GridItem colSpan={{ base: 2, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">State</FormLabel>
                          <Select 
                            value={addressDetails.state}
                            onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value, district: '', tehsil: '' })}
                            h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100"
                          >
                            <option value="">Select State</option>
                            {Object.keys(locationData).map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 2, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">District</FormLabel>
                          <Select 
                            value={addressDetails.district}
                            onChange={(e) => setAddressDetails({ ...addressDetails, district: e.target.value, tehsil: '' })}
                            h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100"
                            isDisabled={!addressDetails.state}
                          >
                            <option value="">Select District</option>
                            {addressDetails.state && Object.keys(locationData[addressDetails.state] || {}).map(district => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 2, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Tehsil</FormLabel>
                          <Select 
                            value={addressDetails.tehsil}
                            onChange={(e) => setAddressDetails({ ...addressDetails, tehsil: e.target.value })}
                            h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100"
                            isDisabled={!addressDetails.district}
                          >
                            <option value="">Select Tehsil</option>
                            {addressDetails.district && (locationData[addressDetails.state]?.[addressDetails.district] || []).map(tehsil => (
                              <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 2, md: 1 }}>
                        <FormControl isRequired>
                          <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Local Address</FormLabel>
                          <Input 
                            value={addressDetails.localAddress} 
                            onChange={(e) => setAddressDetails({ ...addressDetails, localAddress: e.target.value })} 
                            placeholder="Street / Area details" 
                            h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100" 
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Upload Agreement (PDF, Image)</FormLabel>
                      <Input 
                        type="file" 
                        onChange={uploadFileHandler} 
                        p="3" 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        bg="white" 
                        border="1px solid"
                        borderColor="gray.100"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" 
                      />
                      {uploading && <Text fontSize="xs" color="blue.500" mt="1" fontWeight="600">Uploading...</Text>}
                      {formData.agreementUrl && <Text fontSize="xs" color="green.500" mt="1" fontWeight="600">Uploaded: {formData.agreementUrl}</Text>}
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box p="8" bg="white">
                <HStack spacing="4" mb="8">
                    <Box p="3" bg="brand.50" color="brand.500" borderRadius="2xl" shadow="sm"><User size={20} /></Box>
                    <Box>
                        <Heading size="sm" color="secondary" fontWeight="800">Assigned Employee</Heading>
                        <Text fontSize="xs" color="gray.400">Employee managing this distributor</Text>
                    </Box>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap="8">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Employee Name</FormLabel>
                      <Input name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Enter employee name" h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Employee ID</FormLabel>
                      <Input value="Auto-generated" isReadOnly h="55px" variant="filled" borderRadius="xl" fontWeight="900" bg="gray.100" border="1px solid" borderColor="gray.100" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Employee Contact Number</FormLabel>
                      <Input name="employeeContact" value={formData.employeeContact} onChange={handleChange} placeholder="Phone number" h="55px" variant="filled" borderRadius="xl" fontWeight="700" bg="white" border="1px solid" borderColor="gray.100" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box p="8" bg="white">
                <HStack spacing="4" mb="8">
                    <Box p="3" bg="purple.50" color="purple.500" borderRadius="2xl" shadow="sm"><Eye size={20} /></Box>
                    <Box>
                        <Heading size="sm" color="secondary" fontWeight="800">Account Credentials</Heading>
                        <Text fontSize="xs" color="gray.400">Used for distributor portal authentication</Text>
                    </Box>
                </HStack>
                
                <Grid templateColumns="repeat(2, 1fr)" gap="8">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Official Email Address</FormLabel>
                      <Input 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        type="email" 
                        placeholder="dist@distributor.com" 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="700"
                        bg="gray.50/50"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Portal Password</FormLabel>
                      <InputGroup size="md">
                        <Input 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="••••••••" 
                          h="55px" 
                          variant="filled"
                          borderRadius="xl" 
                          fontWeight="700"
                          bg="gray.50/50"
                        />
                        <InputRightElement h="full" pr="2">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle Password"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box p="8" borderTop="1px solid" borderColor="gray.50" bg="gray.50/30">
                <Flex justify="end" gap="4">
                    <Button 
                        variant="ghost" 
                        h="55px" 
                        px="8" 
                        borderRadius="xl" 
                        fontWeight="800"
                        onClick={() => navigate('/manage-distributors')}
                    >
                        Discard
                    </Button>
                    <Button 
                        type="submit"
                        colorScheme="brand" 
                        leftIcon={<Save size={20} />} 
                        isLoading={loading}
                        h="55px"
                        px="12"
                        borderRadius="2xl"
                        fontWeight="900"
                        shadow="xl"
                        _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
                    >
                        Create Distributor Profile
                    </Button>
                </Flex>
              </Box>
            </VStack>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default CreateDistributor;
