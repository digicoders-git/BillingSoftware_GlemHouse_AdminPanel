import { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Icon,
  Grid,
  GridItem,
  Progress,
  List,
  ListItem,
  ListIcon,
  Divider
} from '@chakra-ui/react';
import { 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Layout from '../components/Layout';
import API from '../utils/api';

const ChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  
  const toast = useToast();

  const calculateStrength = (pass) => {
    let s = 0;
    if (pass.length > 7) s += 25;
    if (/[A-Z]/.test(pass)) s += 25;
    if (/[0-9]/.test(pass)) s += 25;
    if (/[^A-Za-z0-9]/.test(pass)) s += 25;
    return s;
  };

  useEffect(() => {
    setStrength(calculateStrength(newPassword));
  }, [newPassword]);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Form Incomplete',
        description: 'All fields are required for security verification.',
        status: 'warning',
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords Mismatch',
        description: 'The new password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    if (strength < 50) {
       toast({
         title: 'Weak Password',
         description: 'Please choose a stronger password for better security.',
         status: 'error',
         duration: 3000,
       });
       return;
    }

    setLoading(true);
    try {
      await API.put('/users/change-password', {
        oldPassword,
        newPassword
      });
      
      toast({
        title: 'Security Updated',
        description: "Your account password has been changed successfully.",
        status: 'success',
        duration: 4000,
        position: 'top-right',
      });
      
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: error.response?.data?.message || 'The current password you entered is incorrect.',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 25) return 'red';
    if (strength <= 50) return 'orange';
    if (strength <= 75) return 'yellow';
    return 'green';
  };

  const getStrengthText = () => {
    if (strength <= 25) return 'Very Weak';
    if (strength <= 50) return 'Weak';
    if (strength <= 75) return 'Medium';
    return 'Strong';
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <HStack spacing="3" mb="1">
               <Box p="2" bg="brand.50" borderRadius="xl" color="brand.500">
                  <Lock size={24} />
               </Box>
               <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Security Dashboard</Heading>
            </HStack>
            <Text color="gray.500" fontWeight="500" ml="12">Protect your account with a high-security password</Text>
          </Box>
          <HStack spacing="3">
             <Button leftIcon={<AlertCircle size={16} />} variant="ghost" colorScheme="orange" fontSize="xs" fontWeight="800" borderRadius="xl">Security Audit</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="10">
           <GridItem colSpan={{ base: 3, lg: 2 }}>
              <Box className="premium-card" p={{ base: 6, md: 10 }}>
                <VStack spacing="8" align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="800" color="gray.500" textTransform="uppercase">Current Password</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        type={showOld ? 'text' : 'password'} 
                        placeholder="Enter your current password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        borderRadius="2xl"
                        h="60px"
                        bg="gray.50"
                        border="none"
                        fontSize="md"
                        _focus={{ bg: 'white', shadow: 'xl', ring: '2px', ringColor: 'brand.500' }}
                      />
                      <InputRightElement h="full" pr="2">
                        <IconButton 
                          variant="ghost" 
                          icon={showOld ? <EyeOff size={20} /> : <Eye size={20} />} 
                          onClick={() => setShowOld(!showOld)} 
                          aria-label="Toggle"
                          color="gray.400"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Divider />

                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="800" color="gray.500" textTransform="uppercase">New Password</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        type={showNew ? 'text' : 'password'} 
                        placeholder="Create a strong password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        borderRadius="2xl"
                        h="60px"
                        bg="gray.50"
                        border="none"
                        fontSize="md"
                        _focus={{ bg: 'white', shadow: 'xl', ring: '2px', ringColor: 'brand.500' }}
                      />
                      <InputRightElement h="full" pr="2">
                        <IconButton 
                          variant="ghost" 
                          icon={showNew ? <EyeOff size={20} /> : <Eye size={20} />} 
                          onClick={() => setShowNew(!showNew)} 
                          aria-label="Toggle"
                          color="gray.400"
                        />
                      </InputRightElement>
                    </InputGroup>
                    
                    {newPassword && (
                      <Box mt="4">
                        <Flex justify="space-between" align="center" mb="2">
                           <Text fontSize="xs" fontWeight="800" color={`${getStrengthColor()}.500`}>STRENGTH: {getStrengthText().toUpperCase()}</Text>
                           <Text fontSize="xs" fontWeight="800" color="gray.400">{strength}%</Text>
                        </Flex>
                        <Progress value={strength} size="xs" colorScheme={getStrengthColor()} borderRadius="full" bg="gray.100" />
                      </Box>
                    )}
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="800" color="gray.500" textTransform="uppercase">Confirm New Password</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        type={showConfirm ? 'text' : 'password'} 
                        placeholder="Re-type new password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        borderRadius="2xl"
                        h="60px"
                        bg="gray.50"
                        border="none"
                        fontSize="md"
                        _focus={{ bg: 'white', shadow: 'xl', ring: '2px', ringColor: 'brand.500' }}
                      />
                      <InputRightElement h="full" pr="2">
                        <IconButton 
                          variant="ghost" 
                          icon={showConfirm ? <EyeOff size={20} /> : <Eye size={20} />} 
                          onClick={() => setShowConfirm(!showConfirm)} 
                          aria-label="Toggle"
                          color="gray.400"
                        />
                      </InputRightElement>
                    </InputGroup>
                    {confirmPassword && newPassword !== confirmPassword && (
                       <HStack mt="2" color="red.500">
                          <Icon as={AlertCircle} size={14} />
                          <Text fontSize="xs" fontWeight="700">Passwords do not match</Text>
                       </HStack>
                    )}
                  </FormControl>

                  <Box pt="4">
                    <Button 
                      colorScheme="brand" 
                      h="60px" 
                      borderRadius="2xl" 
                      leftIcon={<ShieldCheck size={20} />}
                      isLoading={loading}
                      onClick={handleSave}
                      px="12"
                      fontSize="md"
                      fontWeight="800"
                      shadow="0 10px 25px rgba(41, 138, 198, 0.4)"
                      _hover={{ transform: 'translateY(-2px)', shadow: '0 15px 30px rgba(41, 138, 198, 0.5)' }}
                      isDisabled={strength < 50 || newPassword !== confirmPassword}
                    >
                      Update Security Key
                    </Button>
                  </Box>
                </VStack>
              </Box>
           </GridItem>

           <GridItem colSpan={{ base: 3, lg: 1 }}>
              <VStack spacing="6" align="stretch">
                 <Box className="premium-card" p="8" bg="gray.900" color="white">
                    <HStack mb="6" spacing="3">
                       <Box p="2.5" bg="whiteAlpha.200" borderRadius="xl">
                          <ShieldCheck size={24} color="#FFF" />
                       </Box>
                       <Heading size="sm" fontWeight="700">Security Guard</Heading>
                    </HStack>
                    
                    <Text fontSize="xs" color="gray.400" mb="6" fontWeight="500">
                       Follow these requirements to ensure your account remains protected from unauthorized access.
                    </Text>

                    <List spacing={4}>
                      <ListItem fontSize="xs" fontWeight="600" color={newPassword.length >= 8 ? "green.300" : "gray.400"}>
                        <ListIcon as={newPassword.length >= 8 ? CheckCircle2 : XCircle} boxSize={4} />
                        Minimum 8 characters
                      </ListItem>
                      <ListItem fontSize="xs" fontWeight="600" color={/[A-Z]/.test(newPassword) ? "green.300" : "gray.400"}>
                        <ListIcon as={/[A-Z]/.test(newPassword) ? CheckCircle2 : XCircle} boxSize={4} />
                        At least one uppercase letter
                      </ListItem>
                      <ListItem fontSize="xs" fontWeight="600" color={/[0-9]/.test(newPassword) ? "green.300" : "gray.400"}>
                        <ListIcon as={/[0-9]/.test(newPassword) ? CheckCircle2 : XCircle} boxSize={4} />
                        At least one number (0-9)
                      </ListItem>
                      <ListItem fontSize="xs" fontWeight="600" color={/[^A-Za-z0-9]/.test(newPassword) ? "green.300" : "gray.400"}>
                        <ListIcon as={/[^A-Za-z0-9]/.test(newPassword) ? CheckCircle2 : XCircle} boxSize={4} />
                        Special character (!@#$%^&*)
                      </ListItem>
                    </List>
                 </Box>

                 <Box className="premium-card" p="8" border="2px solid" borderColor="brand.50">
                    <Heading size="xs" color="secondary" mb="4" textTransform="uppercase" letterSpacing="1px">Need Help?</Heading>
                    <Text fontSize="xs" color="gray.500" mb="6">If you're having trouble remembering your password, please contact the system administrator.</Text>
                    <Button variant="ghost" size="sm" color="brand.500" rightIcon={<ChevronRight size={16} />} px="0" _hover={{ bg: 'transparent', textDecoration: 'underline' }}>
                       Support Center
                    </Button>
                 </Box>
              </VStack>
           </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ChangePassword;
