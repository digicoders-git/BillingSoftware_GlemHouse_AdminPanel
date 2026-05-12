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
  HStack 
} from '@chakra-ui/react';
import { ChevronRight, Save, Eye, EyeOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

const CreateDistributor = () => {
  const [formData, setFormData] = useState({
    distributorId: '',
    name: '',
    location: '',
    contact: '',
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
      await API.post('/distributors', formData);
      toast({
        title: 'Success',
        description: 'Distributor partner created successfully',
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
               <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Back to Partners</Text>
            </HStack>
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">Onboard Distributor</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="500">Register a new distribution partner in the supply chain</Text>
          </Box>
        </Flex>

        <Box className="premium-card" p="0" overflow="hidden" border="1px solid" borderColor="gray.100">
          <form onSubmit={handleSubmit}>
            <VStack spacing="0" align="stretch">
              <Box p="8" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
                <HStack spacing="4" mb="8">
                    <Box p="3" bg="brand.50" color="brand.500" borderRadius="2xl" shadow="sm"><User size={20} /></Box>
                    <Box>
                        <Heading size="sm" color="secondary" fontWeight="800">Partner Information</Heading>
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
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Distributor Unique ID</FormLabel>
                      <Input 
                        name="distributorId" 
                        value={formData.distributorId} 
                        onChange={handleChange} 
                        placeholder="e.g. DST-2024-001" 
                        h="55px" 
                        variant="filled"
                        borderRadius="xl" 
                        fontWeight="900"
                        bg="white"
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
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Primary Region / City</FormLabel>
                      <Input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="e.g. Indore, Madhya Pradesh" 
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
                </Grid>
              </Box>

              <Box p="8" bg="white">
                <HStack spacing="4" mb="8">
                    <Box p="3" bg="purple.50" color="purple.500" borderRadius="2xl" shadow="sm"><Eye size={20} /></Box>
                    <Box>
                        <Heading size="sm" color="secondary" fontWeight="800">Account Credentials</Heading>
                        <Text fontSize="xs" color="gray.400">Used for partner portal authentication</Text>
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
                        placeholder="dist@partner.com" 
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
                        Create Partner Profile
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
