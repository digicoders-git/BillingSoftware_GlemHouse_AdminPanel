import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  VStack, 
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  Select
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const [show, setShow] = React.useState(false);
  const [role, setRole] = React.useState('admin');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('userRole', role);
    if (role === 'admin') {
      navigate('/');
    } else {
      navigate('/branch/dashboard');
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p="4">
      <Box 
        bg="white"
        w="full" 
        maxW="450px" 
        p={{ base: 8, md: 10 }}
        borderRadius="2xl"
        boxShadow="0 10px 40px rgba(0,0,0,0.08)"
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack spacing="6" align="center" mb="8">
          <Flex justify="center" w="full" mb="2">
            <Image 
              src={logo} 
              alt="DreamsPOS Logo" 
              w="180px"
              h="auto"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Flex>
          <Box textAlign="center">
            <Heading size="lg" color="#1B2850" fontWeight="800">Sign In</Heading>
            <Text fontSize="sm" color="gray.500" mt="2" fontWeight="500">Please select your role and enter details</Text>
          </Box>
        </VStack>

        <form onSubmit={handleLogin}>
          <VStack spacing="5">
            <FormControl id="role">
              <FormLabel fontSize="sm" fontWeight="600" color="#1B2850">Login As</FormLabel>
              <Select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                h="50px" 
                borderRadius="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                fontSize="15px"
                _focus={{ borderColor: '#FF9F43', bg: 'white', boxShadow: '0 0 0 1px #FF9F43' }}
              >
                <option value="admin">Main Admin (Super Admin)</option>
                <option value="branch">Branch Panel (Branch Manager)</option>
              </Select>
            </FormControl>

            <FormControl id="email">
              <FormLabel fontSize="sm" fontWeight="600" color="#1B2850">Email Address</FormLabel>
              <Input 
                type="email" 
                placeholder="admin@dreamspos.com" 
                h="50px" 
                borderRadius="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                fontSize="15px"
                _focus={{ borderColor: '#FF9F43', bg: 'white', boxShadow: '0 0 0 1px #FF9F43' }}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel fontSize="sm" fontWeight="600" color="#1B2850">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? 'text' : 'password'}
                  placeholder="Enter your password"
                  h="50px"
                  borderRadius="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize="15px"
                  _focus={{ borderColor: '#FF9F43', bg: 'white', boxShadow: '0 0 0 1px #FF9F43' }}
                />
                <InputRightElement h="full" pr="2">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShow(!show)}
                    icon={show ? <EyeOff size={18} color="#637381" /> : <Eye size={18} color="#637381" />}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    _hover={{ bg: 'transparent', color: '#1B2850' }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button 
              type="submit"
              w="full" 
              bg="#FF9F43"
              color="white" 
              h="50px" 
              fontSize="16px" 
              fontWeight="700"
              borderRadius="xl"
              mt="4"
              _hover={{ bg: '#FF8A1D', transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
